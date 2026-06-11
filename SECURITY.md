# Security

## Supported Versions

Only the latest published npm version is actively maintained.

## Reporting A Vulnerability

Please report security issues privately through GitHub Security Advisories when
available for the repository:

```text
https://github.com/Dimon94/brainstorming-only/security/advisories/new
```

If advisories are unavailable, open a GitHub issue with a minimal description
and avoid posting secrets, tokens, private keys, exploit payloads, or private
conversation content.

## Scope

Security-sensitive areas include:

- The installer writing to `~/.codex/skills` or `~/.claude/skills`.
- Any future host integration that handles structured choices.
- Any future logic that writes project context docs.

## Local Data Boundary

The package no longer creates local recovery journals or hidden cache
directories. It does not require gstack telemetry, analytics, or runtime
commands. Project context docs should not store credentials, tokens, private
keys, or sensitive personal data.

## Maintainer Response

For confirmed vulnerabilities, the expected response is:

1. Reproduce the issue.
2. Patch the smallest affected surface.
3. Add a regression test when practical.
4. Publish a patch release.
5. Credit the reporter unless they ask to stay anonymous.
