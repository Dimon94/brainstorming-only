# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses semantic versioning for npm releases.

## [Unreleased]

## [0.1.3] - 2026-05-27

### Changed

- Unified terminal convergence and blocking choice pauses around the same A/B/C
  option format, with exactly one recommended option and an explicit reason.
- Updated the skill protocol, README docs, and content tests to remove the old
  `Brainstorming outcome` / `Open options` terminal shape.

## [0.1.2] - 2026-05-22

### Changed

- Changed the brainstorming convergence contract so terminal outcomes can carry
  non-blocking A/B/C open options, while host-native structured choices are
  reserved for blocking decision pauses.

## [0.1.1] - 2026-05-22

### Added

- Added a conditional external calibration step for market, product, adoption,
  and current-practice questions, with privacy-safe search boundaries.

### Changed

- Changed the Codex structured-choice fallback so missing `request_user_input`
  now emits fixed Markdown A/B/C options instead of asking users to change
  collaboration modes.
- Documented the Codex `default_mode_request_user_input` config and a copyable
  prompt for enabling Default-mode choice popups.

## [0.1.0] - 2026-05-22

### Added

- Initial public `brainstorming-only` skill package for Codex and Claude skill
  directories.
- Discussion-only brainstorming contract with a hard stop before specs, plans,
  scaffolding, commits, or PRs.
- Product diagnostic and builder-mode postures for shaping ideas before any
  downstream work starts.
- Adversarial clarity rules that push the agent to name weak assumptions,
  missing evidence, and failure modes.
- Host-native structured choice protocol for Codex, Claude Code, and
  gstack-style hosts.
- Local recovery journal under `~/.brainstorming/` with 10 question-answer pair
  checkpoints, key-decision checkpoints, short user quotes, and `meta.json`
  recovery fields.
- Standalone project slug logic inspired by `office-hours` without depending on
  gstack runtime files, commands, telemetry, or caches.
- npm installer that can install the skill into Codex, Claude, or both.
- Tests for journal behavior, session closure, skill content contracts, and
  gstack independence.

### Documentation

- Added public README coverage for one-line install, local data boundaries,
  project signals, and verification commands.
- Added architecture, contributing, security, and code of conduct documents for
  open-source use.
