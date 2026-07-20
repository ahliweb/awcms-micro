/**
 * Pure, accessible HTML rendering for the public `/search` page (Issue #270,
 * ADR-0031 §5). Everything user-derived (query, titles, urls) is escaped with
 * `escapeHtml`; snippet HTML is ALREADY safe (built by `renderSafeSnippet` —
 * escaped content with only our own `<mark>`), so it is embedded as-is. Core
 * search works with NO JavaScript (a native `<form>` + result links, fully
 * keyboard accessible); the suggestion typeahead is progressive enhancement via a
 * small inline script that degrades gracefully if blocked.
 */
import { escapeHtml } from "../../../lib/html/escape";
import type { SearchResultItem } from "../application/search-service";

export type SearchPageLabels = {
  title: string;
  heading: string;
  inputLabel: string;
  placeholder: string;
  button: string;
  enterTerm: string;
  tooShort: string;
  noResults: string;
  resultsHeading: string;
  next: string;
  suggestionsLabel: string;
};

export type SearchPageView = {
  locale: string;
  siteName: string;
  query: string;
  minQueryLength: number;
  reason?: "empty" | "too_short" | "too_long";
  items: readonly SearchResultItem[];
  nextCursor: string | null;
  labels: SearchPageLabels;
};

function renderResultItem(item: SearchResultItem): string {
  const badge = escapeHtml(item.resourceType.replace(/_/g, " "));
  return `<li class="site-search-result">
  <h3><a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a></h3>
  <p class="site-search-snippet">${item.snippet}</p>
  <p class="site-search-type"><span>${badge}</span></p>
</li>`;
}

export function renderSearchPageBody(view: SearchPageView): string {
  const { labels } = view;
  const hasQuery = view.query.length > 0;

  let resultsHtml: string;
  if (view.reason === "too_short") {
    resultsHtml = `<p class="site-search-hint">${escapeHtml(labels.tooShort)}</p>`;
  } else if (!hasQuery) {
    resultsHtml = `<p class="site-search-hint">${escapeHtml(labels.enterTerm)}</p>`;
  } else if (view.items.length === 0) {
    resultsHtml = `<p class="site-search-hint">${escapeHtml(labels.noResults)}</p>`;
  } else {
    resultsHtml = `<ol class="site-search-results" aria-label="${escapeHtml(labels.resultsHeading)}">
${view.items.map(renderResultItem).join("\n")}
</ol>`;
  }

  const nextLink =
    view.nextCursor && hasQuery
      ? `<nav class="site-search-pagination"><a rel="next" href="/search?q=${encodeURIComponent(
          view.query
        )}&amp;cursor=${encodeURIComponent(view.nextCursor)}">${escapeHtml(
          labels.next
        )}</a></nav>`
      : "";

  // Progressive-enhancement suggestion typeahead: an ARIA combobox. The
  // suggestions list is populated by the inline script from
  // /api/v1/site-search/suggest; keyboard navigation (ArrowDown/Up, Enter,
  // Escape) is handled there. Without JS, the input is a normal search field.
  return `<main class="site-search-page">
  <h1>${escapeHtml(labels.heading)}</h1>
  <form class="site-search-form" role="search" method="get" action="/search">
    <label for="site-search-input">${escapeHtml(labels.inputLabel)}</label>
    <input
      id="site-search-input"
      type="search"
      name="q"
      value="${escapeHtml(view.query)}"
      placeholder="${escapeHtml(labels.placeholder)}"
      autocomplete="off"
      role="combobox"
      aria-expanded="false"
      aria-controls="site-search-suggestions"
      aria-autocomplete="list"
      aria-label="${escapeHtml(labels.inputLabel)}"
      minlength="${view.minQueryLength}"
    />
    <button type="submit">${escapeHtml(labels.button)}</button>
    <ul
      id="site-search-suggestions"
      class="site-search-suggestions"
      role="listbox"
      aria-label="${escapeHtml(labels.suggestionsLabel)}"
      hidden
    ></ul>
  </form>
  <section class="site-search-results-region" aria-live="polite">
    ${resultsHtml}
    ${nextLink}
  </section>
  <script type="application/json" id="site-search-config">${escapeHtml(
    JSON.stringify({ minQueryLength: view.minQueryLength })
  )}</script>
  <script>${SUGGESTION_SCRIPT}</script>
</main>`;
}

/**
 * Inline typeahead script (progressive enhancement). No template interpolation of
 * user data — it fetches JSON from the same-origin suggestion endpoint and builds
 * option elements with `textContent` (never innerHTML), so it cannot introduce
 * markup. Implements the ARIA combobox keyboard pattern.
 */
const SUGGESTION_SCRIPT = `
(function(){
  var input = document.getElementById('site-search-input');
  var list = document.getElementById('site-search-suggestions');
  var cfgEl = document.getElementById('site-search-config');
  if(!input||!list||!cfgEl) return;
  var cfg = {}; try { cfg = JSON.parse(cfgEl.textContent||'{}'); } catch(e){}
  var minLen = cfg.minQueryLength||2;
  var active = -1; var options = []; var timer = null;
  function close(){ list.hidden=true; input.setAttribute('aria-expanded','false'); active=-1; options=[]; list.replaceChildren(); }
  function render(items){
    list.replaceChildren(); options=[];
    items.forEach(function(it,i){
      var li=document.createElement('li');
      li.setAttribute('role','option'); li.id='site-search-opt-'+i; li.textContent=it.title;
      li.addEventListener('mousedown',function(e){ e.preventDefault(); window.location.href=it.url; });
      list.appendChild(li); options.push(it);
    });
    if(items.length){ list.hidden=false; input.setAttribute('aria-expanded','true'); }
    else { close(); }
  }
  function fetchSuggest(q){
    fetch('/api/v1/site-search/suggest?q='+encodeURIComponent(q),{headers:{'accept':'application/json'}})
      .then(function(r){ return r.ok?r.json():null; })
      .then(function(d){ if(d&&d.data&&Array.isArray(d.data.items)) render(d.data.items.slice(0,10)); })
      .catch(function(){});
  }
  input.addEventListener('input',function(){
    var q=input.value.trim();
    if(timer) clearTimeout(timer);
    if(q.length<minLen){ close(); return; }
    timer=setTimeout(function(){ fetchSuggest(q); },150);
  });
  input.addEventListener('keydown',function(e){
    if(list.hidden) return;
    if(e.key==='ArrowDown'){ e.preventDefault(); active=Math.min(active+1,options.length-1); highlight(); }
    else if(e.key==='ArrowUp'){ e.preventDefault(); active=Math.max(active-1,0); highlight(); }
    else if(e.key==='Enter'&&active>=0){ e.preventDefault(); window.location.href=options[active].url; }
    else if(e.key==='Escape'){ close(); }
  });
  function highlight(){
    var kids=list.children;
    for(var i=0;i<kids.length;i++){ kids[i].setAttribute('aria-selected', i===active?'true':'false'); }
    if(active>=0){ input.setAttribute('aria-activedescendant','site-search-opt-'+active); }
  }
  document.addEventListener('click',function(e){ if(!list.contains(e.target)&&e.target!==input) close(); });
})();
`;
