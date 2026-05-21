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
