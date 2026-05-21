#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");

const SKILL_NAME = "brainstorming-only";
const args = new Set(process.argv.slice(2));
const silent = args.has("--silent");
const installCodex = args.has("--codex");
const installClaude = args.has("--claude");
const installBoth = args.has("--both") || (!installCodex && !installClaude);

function log(message) {
  if (!silent) {
    console.log(message);
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function defaultCodexHome() {
  return process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
}

function defaultClaudeHome() {
  return process.env.CLAUDE_HOME || path.join(os.homedir(), ".claude");
}

function copyDir(source, destination) {
  fs.rmSync(destination, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, {
    recursive: true,
    filter: (entry) => !entry.includes(`${path.sep}.DS_Store`),
  });
}

function main() {
  const packageRoot = path.resolve(__dirname, "..");
  const source = path.join(packageRoot, SKILL_NAME);

  if (!fs.existsSync(path.join(source, "SKILL.md"))) {
    fail(`Cannot find bundled skill at ${source}`);
  }

  const destinations = [];

  if (installBoth || installCodex) {
    destinations.push({
      label: "Codex",
      path: path.join(defaultCodexHome(), "skills", SKILL_NAME),
    });
  }

  if (installBoth || installClaude) {
    destinations.push({
      label: "Claude",
      path: path.join(defaultClaudeHome(), "skills", SKILL_NAME),
    });
  }

  for (const destination of destinations) {
    copyDir(source, destination.path);
    log(`Installed $${SKILL_NAME} for ${destination.label} to ${destination.path}`);
  }

  log("");
  log("Use it in a compatible AI agent with:");
  log(`  Use $${SKILL_NAME} to compare these product directions and help me choose one.`);
  log("");
  log("Install only one ecosystem with --codex or --claude. Install both with --both.");
}

main();
