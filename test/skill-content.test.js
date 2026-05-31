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
  assert.match(skill, /Use the same A\/B\/C option shape for terminal convergence and blocking pauses/);
  assert.match(skill, /Every option set must include exactly one recommended option/);
  assert.match(protocol, /DefaultModeRequestUserInput/);
  assert.match(protocol, /default_mode_request_user_input = true/);
  assert.match(protocol, /emit the\s+fallback A\/B\/C decision block and stop/);
  assert.match(protocol, /Use terminal A\/B\/C options as the default convergence shape/);
  assert.match(protocol, /## Terminal Options/);
  assert.match(protocol, /Do not ask the user to change\s+collaboration modes/);
  assert.match(protocol, /must not be called or\s+implied to be the Codex native option UI/);
  assert.match(readme, /default_mode_request_user_input = true/);
  assert.match(readme, /falls back to a fixed Markdown A\/B\/C choice\s+block/);
  assert.match(readme, /one visible option format for blocking choice pauses and terminal\s+convergence/);
  assert.match(readme, /marks one option as\s+recommended, and explains why that recommendation wins/);
  assert.match(readme, /Please enable Codex Default-mode choice popups/);
  assert.match(readme, /preserving all existing settings/);
  assert.match(readmeZh, /default_mode_request_user_input = true/);
  assert.match(readmeZh, /固定 Markdown A\/B\/C 选项块/);
  assert.match(readmeZh, /同一种可见选项格式处理“阻塞选择暂停”和“最终收敛”/);
  assert.match(readmeZh, /标出一个推荐项，并说明推荐理由/);
  assert.match(readmeZh, /想让 Codex 直接开启这个设置/);
  assert.match(readmeZh, /并保留现有配置/);

  assert.doesNotMatch(skill, /Plan mode/);
  assert.doesNotMatch(protocol, /Plan mode/);
  assert.doesNotMatch(readme, /Plan mode/);
  assert.doesNotMatch(readmeZh, /Plan mode/);
  assert.doesNotMatch(protocol, /do not emit\s+the fallback A\/B\/C decision block/);
  assert.doesNotMatch(skill, /Structured choice pauses outrank convergence/);
  assert.doesNotMatch(skill, /Brainstorming outcome/);
  assert.doesNotMatch(protocol, /Brainstorming outcome/);
  assert.doesNotMatch(readme, /Brainstorming outcome/);
  assert.doesNotMatch(readmeZh, /Brainstorming outcome/);
});

test("readmes cite prior art and avoid implying affiliation", () => {
  const readme = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");
  const readmeZh = fs.readFileSync(path.join(__dirname, "..", "README.zh-CN.md"), "utf8");

  assert.match(readme, /## Prior Art And Attribution/);
  assert.match(readme, /https:\/\/github\.com\/obra\/superpowers/);
  assert.match(readme, /https:\/\/github\.com\/obra\/superpowers\/blob\/main\/skills\/brainstorming\/SKILL\.md/);
  assert.match(readme, /https:\/\/github\.com\/garrytan\/gstack/);
  assert.match(readme, /https:\/\/github\.com\/garrytan\/gstack\/blob\/main\/office-hours\/SKILL\.md/);
  assert.match(readme, /https:\/\/github\.com\/Dimon94\/cc-devflow/);
  assert.match(readme, /not\s+affiliated with, sponsored by, or endorsed by/);
  assert.match(readme, /## Recommended Skill Suites/);
  assert.match(readme, /one roadmap entry point, feature and bug-investigation loops, verification gates, PR review, and main-branch parity/);
  assert.match(readme, /same maintainer/);

  assert.match(readmeZh, /## 前人工作与致谢/);
  assert.match(readmeZh, /https:\/\/github\.com\/obra\/superpowers/);
  assert.match(readmeZh, /https:\/\/github\.com\/obra\/superpowers\/blob\/main\/skills\/brainstorming\/SKILL\.md/);
  assert.match(readmeZh, /https:\/\/github\.com\/garrytan\/gstack/);
  assert.match(readmeZh, /https:\/\/github\.com\/garrytan\/gstack\/blob\/main\/office-hours\/SKILL\.md/);
  assert.match(readmeZh, /https:\/\/github\.com\/Dimon94\/cc-devflow/);
  assert.match(readmeZh, /没有从属、赞助或官方背书关系/);
  assert.match(readmeZh, /## 推荐的 SKILL 套件/);
  assert.match(readmeZh, /同作者项目/);
  assert.match(readmeZh, /区分新需求闭环和 Bug 调查闭环/);
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

test("skill supports confirmed self-growing project context docs", () => {
  const skill = fs.readFileSync(skillPath, "utf8");

  assert.match(skill, /## Project Context Docs/);
  assert.match(skill, /check for existing domain context/);
  assert.match(skill, /If `CONTEXT-MAP\.md` exists at the project root, read it first/);
  assert.match(skill, /Treat `CONTEXT-MAP\.md` as an\s+active multi-context signal only when the file exists/);
  assert.match(skill, /If no `CONTEXT-MAP\.md` exists but a root `CONTEXT\.md` exists/);
  assert.match(skill, /If neither `CONTEXT-MAP\.md` nor `CONTEXT\.md` exists, continue normally/);
  assert.match(skill, /do not suggest creating it/);
  assert.match(skill, /Keep `CONTEXT\.md` glossary-only/);
  assert.match(skill, /Treat ADRs as sparse decision records under `docs\/adr\/`/);
  assert.match(skill, /hard to reverse, surprising\s+without context, and the result of a real trade-off/);
  assert.match(skill, /Propose the\s+exact small addition and ask the user to confirm before editing any project\s+file/);
  assert.match(skill, /Create or suggest `CONTEXT-MAP\.md` when the project does not already have one/);

  assert.doesNotMatch(skill, /always create `CONTEXT-MAP\.md`/i);
  assert.doesNotMatch(skill, /update `CONTEXT\.md` right there/i);
});
