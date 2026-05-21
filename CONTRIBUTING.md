# Contributing

Thanks for improving `brainstorming-only`. The project is intentionally small,
so contributions should keep the runtime contract easy to audit.

## Local Setup

```bash
git clone https://github.com/Dimon94/brainstorming-only.git
cd brainstorming-only
npm test
```

No install step is required for development because the project uses Node's
built-in test runner and has no runtime dependencies.

## Useful Commands

```bash
npm test
npm run pack:check
node scripts/install.js --codex
node scripts/install.js --claude
```

`npm run pack:check` shows exactly what will ship to npm.

## Development Rules

- Keep the skill discussion-only. Do not add automatic planning,
  implementation, commit, PR, or scaffold behavior.
- Keep recovery data outside the project workspace under `~/.brainstorming/`.
- Do not introduce gstack runtime dependencies. The project may describe
  gstack-style hosts, but the package must not call gstack runtime commands,
  gstack environment paths, gstack-owned caches, or telemetry tools.
- Prefer host-native decision UI. Do not fake Codex `request_user_input` with a
  Markdown A/B/C block when the native tool is unavailable.
- Add tests for behavior that future maintainers could accidentally weaken.

## Test Expectations

Before opening a PR or preparing a release, run:

```bash
npm test
npm run pack:check
git diff --check
```

For journal changes, include tests in `test/journal.test.js`.

For skill contract or README changes, include tests in
`test/skill-content.test.js` when the contract is important enough to protect.

## Release Checklist

1. Update `CHANGELOG.md`.
2. Verify `package.json` has the intended version.
3. Run `npm test`.
4. Run `npm publish --dry-run --access public`.
5. Merge the release branch into `main` with a linear history.
6. Push `main` and the release tag.
7. Publish from `main`.
8. Verify:

   ```bash
   npm view brainstorming-only version
   npx --yes brainstorming-only@<version> --codex
   ```

## Documentation

When behavior changes, update the docs in the same PR:

- `README.md` and `README.zh-CN.md` for users.
- `ARCHITECTURE.md` for package shape and runtime boundaries.
- `CHANGELOG.md` for release notes.
- `SECURITY.md` if privacy or reporting guidance changes.

## Code Of Conduct

This project follows [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
