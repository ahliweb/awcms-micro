vcl 4.1;

# AWCMS-Micro edge cache (Issue #353, ADR-0037).
#
# Topology: Traefik (TLS) -> Varnish -> app (Astro SSR) -> PostgreSQL.
# Varnish is OPTIONAL. Removing this service must leave a fully working
# site, so nothing here may be load-bearing for correctness — it only
# removes repeat work from the database.
#
# The application is authoritative about what may be cached and for how
# long: it sends `Surrogate-Control` (consumed and stripped here, never
# delivered to a browser). This file re-checks the two rules that would be
# catastrophic to get wrong, rather than trusting that header alone:
#
#   1. a request carrying a session cookie is never served from, or stored
#      in, the cache;
#   2. a response carrying `Set-Cookie` is never stored.
#
# Rule 2 matters specifically because cookies queued through Astro's
# `context.cookies` (the visitor-analytics visitor key) are merged into the
# response AFTER middleware runs and are therefore invisible to the
# application-side policy. This is the only place that check can be
# complete.

import std;

backend app {
    .host = "app";
    .port = "4321";
    .connect_timeout = 3s;
    .first_byte_timeout = 60s;
    .between_bytes_timeout = 30s;
}

# Invalidation is reachable only from private networks. Combined with the
# shared-secret check below this is defence in depth: the container also
# publishes no host port of its own in the shipped overlay.
acl purge_network {
    "localhost";
    "127.0.0.1";
    "10.0.0.0"/8;
    "172.16.0.0"/12;
    "192.168.0.0"/16;
}

sub vcl_recv {
    # Invalidation endpoint.
    #
    # Deliberately a POST to a reserved PATH rather than a custom `BAN`
    # method, which is the conventional Varnish idiom: Bun's `fetch`
    # silently rewrites an unknown method to `GET` (verified on Bun 1.3.14
    # against this very service — the request arrived as `ReqMethod GET`,
    # was served as an ordinary page, and returned 200, so the caller could
    # not tell an invalidation had never happened). Relying on a custom verb
    # surviving every HTTP client in the chain is not something this layer
    # can verify at runtime, so it does not depend on it.
    if (req.url == "/__awcms-edge-cache/ban") {
        if (req.method != "POST") {
            return (synth(405, "Method Not Allowed"));
        }

        if (client.ip !~ purge_network) {
            return (synth(403, "Forbidden"));
        }

        if (std.getenv("EDGE_CACHE_PURGE_TOKEN") == "") {
            return (synth(403, "Invalidation disabled"));
        }

        if (!req.http.X-Purge-Token
            || req.http.X-Purge-Token != std.getenv("EDGE_CACHE_PURGE_TOKEN")) {
            return (synth(403, "Forbidden"));
        }

        if (!req.http.X-Ban-Host) {
            return (synth(400, "X-Ban-Host required"));
        }

        # Host equality keeps a ban inside one tenant; the path is a regex
        # supplied by the caller, which is why the application side
        # (`edge-cache-purge.ts`) restricts its character set before it
        # ever reaches this expression.
        ban("obj.http.X-Ban-Host == " + req.http.X-Ban-Host
            + " && obj.http.X-Ban-Url ~ " + req.http.X-Ban-Path);

        return (synth(200, "Banned"));
    }

    if (req.method != "GET" && req.method != "HEAD") {
        return (pass);
    }

    if (req.http.Authorization) {
        return (pass);
    }

    # Authenticated readers bypass the cache entirely, in both directions.
    if (req.http.Cookie ~ "(^|;\s*)awcms_micro_session=") {
        return (pass);
    }

    # Normalize the cookie header down to the locale cookie only. The
    # application sends `Vary: Cookie` on every cacheable response, so
    # after this normalization the stored variants are per-locale rather
    # than per-visitor — which is what keeps the hit rate usable while the
    # `Vary` header stays correct for any other cache in the chain.
    if (req.http.Cookie) {
        set req.http.Cookie = ";" + req.http.Cookie;
        set req.http.Cookie = regsuball(req.http.Cookie, "; +", ";");
        set req.http.Cookie = regsuball(req.http.Cookie, ";(awcms_micro_locale)=", "; \1=");
        set req.http.Cookie = regsuball(req.http.Cookie, ";[^ ][^;]*", "");
        set req.http.Cookie = regsuball(req.http.Cookie, "^[; ]+|[; ]+$", "");

        if (req.http.Cookie == "") {
            unset req.http.Cookie;
        }
    }

    return (hash);
}

sub vcl_backend_response {
    # Remembered on the object so a BAN can target one tenant's host and a
    # path pattern. Removed again in vcl_deliver.
    set beresp.http.X-Ban-Host = bereq.http.host;
    set beresp.http.X-Ban-Url = bereq.url;

    # Default deny: without an explicit, positive instruction from the
    # application this response is not stored. `uncacheable` plus a short
    # TTL creates a hit-for-pass object, so a stream of requests for an
    # uncacheable URL does not serialize behind the request coalescing
    # Varnish would otherwise apply.
    if (!beresp.http.Surrogate-Control
        || beresp.http.Surrogate-Control ~ "no-store") {
        set beresp.uncacheable = true;
        set beresp.ttl = 10s;
        return (deliver);
    }

    # See this file's header: the complete Set-Cookie check can only
    # happen here.
    if (beresp.http.Set-Cookie) {
        set beresp.uncacheable = true;
        set beresp.ttl = 10s;
        return (deliver);
    }

    if (beresp.status != 200) {
        set beresp.uncacheable = true;
        set beresp.ttl = 10s;
        return (deliver);
    }

    set beresp.ttl = std.duration(
        regsub(beresp.http.Surrogate-Control, "^.*max-age=([0-9]+).*$", "\1") + "s",
        60s
    );

    # `stale-if-error` becomes Varnish grace: how long a stale object may
    # still be served while the origin is unhealthy. This is the behaviour
    # the whole layer exists for — a database incident degrades to slightly
    # stale pages instead of 503s.
    if (beresp.http.Surrogate-Control ~ "stale-if-error=[0-9]+") {
        set beresp.grace = std.duration(
            regsub(beresp.http.Surrogate-Control, "^.*stale-if-error=([0-9]+).*$", "\1") + "s",
            600s
        );
    } else {
        set beresp.grace = 600s;
    }

    # Never leaked to a client: the aggressive TTL is for shared caches
    # only, while the browser obeys the separate `Cache-Control`.
    unset beresp.http.Surrogate-Control;

    return (deliver);
}

sub vcl_synth {
    # Marker the caller checks. Without it, ANY 200 reaching the client —
    # including an ordinary page served because the request never matched
    # the branch above — would read as a successful invalidation. That is
    # exactly the failure this endpoint was rebuilt to make impossible.
    if (resp.reason == "Banned") {
        set resp.http.X-Edge-Cache-Ban = "ok";
    }

    return (deliver);
}

sub vcl_deliver {
    unset resp.http.X-Ban-Host;
    unset resp.http.X-Ban-Url;

    # Unconditionally, not only on the cacheable path: an uncacheable
    # response is delivered straight from vcl_backend_response, so
    # stripping it there alone still leaked `Surrogate-Control: no-store`
    # (and, on a pass, the real TTL) to clients. Verified against a live
    # Varnish 7.7.3 before and after this line.
    unset resp.http.Surrogate-Control;

    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT";
    } else {
        set resp.http.X-Cache = "MISS";
    }

    # Varnish's own version is not useful to a client and narrows the
    # attack surface description an attacker gets for free.
    unset resp.http.Via;
    unset resp.http.X-Varnish;

    return (deliver);
}
