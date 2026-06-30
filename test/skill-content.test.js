const assert = require("assert");
const fs = require("fs");
const path = require("path");
const test = require("node:test");

const skillPath = path.join(__dirname, "..", "brainstorming-only", "SKILL.md");
const referencesDir = path.join(__dirname, "..", "brainstorming-only", "references");

test("skill follows writing-great-skills progressive disclosure structure", () => {
  const skill = fs.readFileSync(skillPath, "utf8");
  const lineCount = skill.trimEnd().split("\n").length;
  const description = skill.match(/description: "([^"]+)"/)[1];

  assert.ok(lineCount <= 100, `SKILL.md should stay under 100 lines, got ${lineCount}`);
  assert.ok(description.length <= 1024);
  assert.match(description, /^Brainstorming-only for standalone ideation/);
  assert.match(description, /Use when/);
  assert.match(skill, /## Quick Start/);
  assert.match(skill, /## Load References/);
  assert.match(skill, /references\/brainstorming-method\.md/);
  assert.match(skill, /references\/project-context-docs\.md/);
  assert.match(skill, /references\/recommendation-reliability\.md/);
  assert.match(skill, /references\/user-choice-output-protocol\.md/);
  assert.match(skill, /Done when/);
  assert.doesNotMatch(skill, /## Adversarial Clarity/);
  assert.doesNotMatch(skill, /## Product Diagnostic Posture/);
});

test("method reference encodes adversarial brainstorming instead of cheap affirmation", () => {
  const method = fs.readFileSync(path.join(referencesDir, "brainstorming-method.md"), "utf8");

  assert.match(method, /## Adversarial Clarity/);
  assert.match(method, /No cheap praise/);
  assert.match(method, /weak idea look finished/);
  assert.match(method, /hidden assumptions/);
  assert.match(method, /pre-mortem/);
  assert.match(method, /What would make this collapse\?/);
});

test("skill uses project context docs instead of legacy local persistence", () => {
  const skill = fs.readFileSync(skillPath, "utf8");
  const contextDocs = fs.readFileSync(path.join(referencesDir, "project-context-docs.md"), "utf8");
  const readme = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");
  const readmeZh = fs.readFileSync(path.join(__dirname, "..", "README.zh-CN.md"), "utf8");
  const architecture = fs.readFileSync(path.join(__dirname, "..", "ARCHITECTURE.md"), "utf8");

  assert.match(skill, /Durable knowledge persists only through project context docs/);
  assert.match(skill, /references\/project-context-docs\.md/);
  assert.match(contextDocs, /Do not create a separate session journal/);
  assert.match(contextDocs, /When a term is resolved, update the applicable `CONTEXT\.md` inline/);
  assert.match(readme, /It does not keep a separate session\s+journal, hidden local cache, or recovery directory/);
  assert.match(readmeZh, /不再维护单独的 session journal、隐藏本地缓存或恢复目录/);
  assert.match(architecture, /no separate recovery journal, checkpoint helper, or hidden local\s+cache/);

  assert.doesNotMatch(skill, /_JOURNAL_SCRIPT/);
  assert.doesNotMatch(skill, /scripts\/journal\.js/);
  assert.doesNotMatch(skill, /~\/\.brainstorming/);
  assert.doesNotMatch(skill, /record-qa/);
  assert.doesNotMatch(readme, /~\/\.brainstorming/);
  assert.doesNotMatch(readmeZh, /~\/\.brainstorming/);
  assert.doesNotMatch(architecture, /scripts\/journal\.js/);
});

test("skill documents Codex default-mode native choices and Markdown fallback", () => {
  const skill = fs.readFileSync(skillPath, "utf8");
  const protocol = fs.readFileSync(path.join(referencesDir, "user-choice-output-protocol.md"), "utf8");
  const readme = fs.readFileSync(path.join(__dirname, "..", "README.md"), "utf8");
  const readmeZh = fs.readFileSync(path.join(__dirname, "..", "README.zh-CN.md"), "utf8");

  assert.match(skill, /Use the same A\/B\/C option shape for terminal convergence and blocking pauses/);
  assert.match(skill, /references\/user-choice-output-protocol\.md/);
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

test("skill keeps question loops from turning into implementation plans", () => {
  const skill = fs.readFileSync(skillPath, "utf8");

  assert.match(skill, /Run the question loop, not a one-question preface/);
  assert.match(skill, /Ask exactly one\s+branch-resolving question/);
  assert.match(skill, /then stop and wait/);
  assert.match(skill, /Local evidence can smart-skip factual\s+questions, but cannot skip user-owned product or scope decisions/);
  assert.match(skill, /\*\*Question Loop\*\*/);
  assert.match(skill, /Done across turns when no blocking product, scope, or\s+contract choice remains/);
  assert.match(skill, /summarize only after the question loop is closed/);
  assert.match(skill, /with no implementation order,\s+task breakdown/);
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
  const method = fs.readFileSync(path.join(referencesDir, "brainstorming-method.md"), "utf8");

  assert.match(method, /## External Calibration/);
  assert.match(method, /Trigger only when external reality can materially change the discussion/);
  assert.match(method, /product, market, adoption/);
  assert.match(method, /current best\s+practices/);
  assert.match(method, /competitors, substitutes, incumbent workflows/);
  assert.match(method, /Show generalized search terms/);
  assert.match(method, /Do not search for project names, company\s+names, proprietary concepts, customer names, or sensitive details/);
  assert.match(method, /2-3 high-signal sources/);
  assert.match(method, /common wisdom/);
  assert.match(method, /current discourse/);
  assert.match(method, /implication for our premises/);
  assert.match(method, /must not be the final judge/);

  assert.doesNotMatch(method, /always search the web for every brainstorming session/i);
  assert.doesNotMatch(method, /write a design document after external calibration/i);
});

test("skill gates non-trivial recommendations through reliability checks", () => {
  const skill = fs.readFileSync(skillPath, "utf8");
  const method = fs.readFileSync(path.join(referencesDir, "brainstorming-method.md"), "utf8");
  const protocol = fs.readFileSync(path.join(referencesDir, "user-choice-output-protocol.md"), "utf8");
  const reliability = fs.readFileSync(path.join(referencesDir, "recommendation-reliability.md"), "utf8");

  assert.match(skill, /references\/recommendation-reliability\.md/);
  assert.match(method, /For non-trivial recommendations, read\s+`recommendation-reliability\.md`/);
  assert.match(method, /second-sample pass/);

  assert.match(protocol, /## Recommendation Reliability Check/);
  assert.match(protocol, /Stable reliability checks stay hidden/);
  assert.match(protocol, /Unstable checks must disclose a\s+short `second-sample check`/);
  assert.match(protocol, /roundtable check/);
  assert.match(protocol, /Never expose raw chain-of-thought/);

  assert.match(reliability, /# Recommendation Reliability/);
  assert.match(reliability, /## Trigger/);
  assert.match(reliability, /## Second-Sample Pass/);
  assert.match(reliability, /## Output Rule/);
  assert.match(reliability, /## Decision Roundtable/);
  assert.match(reliability, /not a fourth\s+brainstorming posture/);
  assert.match(reliability, /Use 3 independent perspectives by default and at most 5/);
  assert.match(reliability, /The main assistant acts as judge/);
  assert.match(reliability, /Do not decide by vote/);
  assert.match(reliability, /## External Calibration Seat/);
  assert.match(reliability, /optional roundtable seat, not a default seat/);
  assert.match(reliability, /privacy gate/);
  assert.match(reliability, /Do not search for project names, company\s+names, proprietary concepts, customer names, or sensitive details/);
  assert.match(reliability, /Do not reveal raw chain-of-thought/);
});

test("skill supports grill-with-docs style project context docs", () => {
  const skill = fs.readFileSync(skillPath, "utf8");
  const contextDocs = fs.readFileSync(path.join(referencesDir, "project-context-docs.md"), "utf8");

  assert.match(skill, /references\/project-context-docs\.md/);
  assert.match(skill, /Project context persistence is a side effect after a confirmed durable fact/);
  assert.match(skill, /does not control the question loop/);
  assert.match(contextDocs, /## Persistence Adapter Contract/);
  assert.match(contextDocs, /Trigger:/);
  assert.match(contextDocs, /Input:/);
  assert.match(contextDocs, /Output:/);
  assert.match(contextDocs, /Non-goals:/);
  assert.match(contextDocs, /confirmed facts only, not candidate facts/);
  assert.match(contextDocs, /Only `failed` blocks the brainstorming session/);
  assert.match(contextDocs, /## Finding Context Docs/);
  assert.match(contextDocs, /If `CONTEXT-MAP\.md` exists at the project root, read it first/);
  assert.match(contextDocs, /If no `CONTEXT-MAP\.md` exists but root `CONTEXT\.md` exists/);
  assert.match(contextDocs, /If neither exists, continue normally/);
  assert.match(contextDocs, /## Lazy File Creation/);
  assert.match(contextDocs, /create one when the first domain term, boundary, or\s+relationship is resolved/);
  assert.match(contextDocs, /create it only when the first ADR-worthy decision is\s+reached/);
  assert.match(contextDocs, /Do not create or suggest `CONTEXT-MAP\.md`/);
  assert.match(contextDocs, /Challenge user language against existing `CONTEXT\.md` terms/);
  assert.match(contextDocs, /Sharpen vague language by proposing a precise canonical term/);
  assert.match(contextDocs, /Cross-reference with code/);
  assert.match(contextDocs, /`CONTEXT\.md` is a glossary only/);
  assert.match(contextDocs, /must not contain implementation detail,\s+scratch notes, task prose, specs, plans, or memory dumps/);
  assert.match(contextDocs, /update the applicable `CONTEXT\.md` inline/);
  assert.match(contextDocs, /Offer an ADR only when all three are true/);
  assert.match(contextDocs, /Hard to reverse/);
  assert.match(contextDocs, /Surprising without context/);
  assert.match(contextDocs, /Real trade-off/);
  assert.match(contextDocs, /Do not create a separate session journal/);

  assert.doesNotMatch(contextDocs, /always create `CONTEXT-MAP\.md`/i);
  assert.doesNotMatch(contextDocs, /ask the user to confirm before editing any project\s+file/i);
  assert.doesNotMatch(contextDocs, /record the candidate in the brainstorming\s+journal/i);
  assert.doesNotMatch(contextDocs, /batch confirmed updates at the end/i);
  assert.doesNotMatch(contextDocs, /candidate facts decide persistence/i);
});
