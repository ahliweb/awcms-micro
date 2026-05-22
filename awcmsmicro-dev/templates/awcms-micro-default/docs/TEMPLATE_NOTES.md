# Template Notes

## Scope

This template exists as an AWCMS-Micro example only.

## What It Demonstrates

- a small Astro-first public site shell
- a minimal EmDash seed file for local setup and repeatable example content
- explicit AWCMS-Micro conventions in a new folder
- compatibility with EmDash runtime patterns without editing EmDash core

## What It Does Not Do

- it does not replace EmDash built-in templates
- it does not register itself into EmDash core
- it does not add custom plugin or template loading mechanisms

## Safe Adoption Path

Copy the folder into a project workspace, then customize it through normal EmDash configuration and site-level code.

This example now uses published package versions so it can install outside the parent monorepo without rewriting dependency specifiers.
