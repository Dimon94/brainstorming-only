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

test("skill documents Codex default-mode native choices and Markdown fallback", () => {
  const skill = fs.readFileSync(skillPath, "utf8");
  const protocolPath = path.join(
    __dirname,
    "..",
    "brainstorming-only",
    "references",
    "user-choice-output-protocol.md"
  );
  const protocol = fs.readFileSync(protocolPath, "utf8");
  const readme = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");
  const readmeZh = fs.readFileSync(path.join(__dirname, "..", "README.zh-CN.md"), "utf8");

  assert.match(skill, /request_user_input` when it is listed in the available tools/);
  assert.match(skill, /emit the fixed A\/B\/C Markdown fallback/);
  assert.match(skill, /Do not ask the user to change collaboration modes/);
  assert.match(protocol, /DefaultModeRequestUserInput/);
  assert.match(protocol, /default_mode_request_user_input = true/);
  assert.match(protocol, /emit the\s+fallback A\/B\/C decision block and stop/);
  assert.match(protocol, /Do not ask the user to change\s+collaboration modes/);
  assert.match(protocol, /must not be called or\s+implied to be the Codex native option UI/);
  assert.match(readme, /default_mode_request_user_input = true/);
  assert.match(readme, /falls back to a fixed Markdown A\/B\/C choice\s+block/);
  assert.match(readme, /Please enable Codex Default-mode choice popups/);
  assert.match(readme, /preserving all existing settings/);
  assert.match(readmeZh, /default_mode_request_user_input = true/);
  assert.match(readmeZh, /固定 Markdown A\/B\/C 选项块/);
  assert.match(readmeZh, /想让 Codex 直接开启这个设置/);
  assert.match(readmeZh, /并保留现有配置/);

  assert.doesNotMatch(skill, /Plan mode/);
  assert.doesNotMatch(protocol, /Plan mode/);
  assert.doesNotMatch(readme, /Plan mode/);
  assert.doesNotMatch(readmeZh, /Plan mode/);
  assert.doesNotMatch(protocol, /do not emit\s+the fallback A\/B\/C decision block/);
});

test("skill keeps external calibration conditional, private, and premise-focused", () => {
  const skill = fs.readFileSync(skillPath, "utf8");

  const targetedQuestions = "3. **Ask targeted questions**";
  const externalCalibration = "4. **External calibration**";
  const premiseChallenge = "5. **Challenge the premises**";

  assert.ok(skill.includes(externalCalibration));
  assert.ok(
    skill.indexOf(targetedQuestions) < skill.indexOf(externalCalibration),
    "external calibration must happen after internal framing and targeted questions"
  );
  assert.ok(
    skill.indexOf(externalCalibration) < skill.indexOf(premiseChallenge),
    "external calibration must feed premise challenge before options and convergence"
  );

  assert.match(skill, /Trigger only when/);
  assert.match(skill, /product, market, adoption/);
  assert.match(skill, /current best practices/);
  assert.match(skill, /competitors, substitutes, or incumbent workflows/);
  assert.match(skill, /Show the generalized search terms/);
  assert.match(skill, /Do not search for project names, company names, proprietary concepts, customer names, or sensitive details/);
  assert.match(skill, /2-3 high-signal sources/);
  assert.match(skill, /common wisdom/);
  assert.match(skill, /current discourse/);
  assert.match(skill, /implication for our premises/);
  assert.match(skill, /must not be the final judge/);
  assert.match(skill, /do not turn this into a competitive-research report, design document, implementation plan, or final-ranking mechanism/);

  assert.doesNotMatch(skill, /always search the web for every brainstorming session/i);
  assert.doesNotMatch(skill, /write a design document after external calibration/i);
});
