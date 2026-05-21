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
- The journal helper writing to `~/.brainstorming/`.
- Any logic that records user quotes or recovery context.
- Any future host integration that handles structured choices.

## Local Data Boundary

The package is designed to keep recovery data local. It does not require gstack
telemetry, analytics, or runtime commands. The journal should not store
credentials, tokens, private keys, or sensitive personal data. If sensitive
material appears during brainstorming, record only the decision-relevant
constraint and redact the secret itself.

## Maintainer Response

For confirmed vulnerabilities, the expected response is:

1. Reproduce the issue.
2. Patch the smallest affected surface.
3. Add a regression test when practical.
4. Publish a patch release.
5. Credit the reporter unless they ask to stay anonymous.
