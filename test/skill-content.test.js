const assert = require("assert");
const fs = require("fs");
const path = require("path");
const test = require("node:test");

const skillPath = path.join(__dirname, "..", "brainstorming-only", "SKILL.md");

test("skill encodes adversarial brainstorming instead of cheap affirmation", () => {
  const skill = fs.readFileSync(skillPath, "utf8");

  assert.match(skill, /## Adversarial Clarity/);
  assert.match(skill, /No cheap praise/);
  assert.match(skill, /weak idea look finished/);
  assert.match(skill, /hidden assumptions/);
  assert.match(skill, /pre-mortem/);
  assert.match(skill, /What would make this collapse\?/);
});

test("journal helper is resolved before use and fails closed when missing", () => {
  const skill = fs.readFileSync(skillPath, "utf8");
  const helperSetup = '_JOURNAL_SCRIPT="$HOME/.codex/skills/brainstorming-only/scripts/journal.js"';
  const firstHelperUse = 'node "$_JOURNAL_SCRIPT"';

  assert.ok(skill.includes(helperSetup));
  assert.ok(skill.includes(firstHelperUse));
  assert.ok(
    skill.indexOf(helperSetup) < skill.indexOf(firstHelperUse),
    "journal helper path must be assigned before the first node invocation"
  );
  assert.match(skill, /Cannot resolve brainstorming-only journal helper/);
  assert.match(skill, /return 1 2>\/dev\/null \|\| exit 1/);
});
