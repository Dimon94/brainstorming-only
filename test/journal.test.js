const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");

const {
  closeSession,
  readMeta,
  recordQuestionAnswer,
  resolveProjectSlug,
  slugFromRemoteUrl,
  startSession,
  writeCheckpoint,
} = require("../brainstorming-only/scripts/journal");

function makeTempBase() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "brainstorming-journal-"));
}

function fixedDate(second = 12) {
  return new Date(2026, 4, 21, 15, 30, second);
}

test("derives the project slug from git remote shape without gstack runtime", () => {
  assert.equal(
    slugFromRemoteUrl("https://github.com/Dimon94/brainstorming-only.git"),
    "Dimon94-brainstorming-only"
  );
  assert.equal(
    slugFromRemoteUrl("git@github.com:Dimon94/brainstorming-only.git"),
    "Dimon94-brainstorming-only"
  );
});

test("uses a local brainstorming slug cache before recomputing", () => {
  const baseDir = makeTempBase();
  const cwd = path.join(baseDir, "repo");
  fs.mkdirSync(cwd, { recursive: true });
  const cacheDir = path.join(baseDir, "slug-cache");
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(path.join(cacheDir, cwd.replace(/[\\/]/g, "_")), "cached-project");

  assert.equal(
    resolveProjectSlug(cwd, {}, baseDir),
    "cached-project"
  );
});

test("starts a project-scoped session journal and maintains active/latest pointers", () => {
  const baseDir = makeTempBase();

  const session = startSession({
    baseDir,
    branch: "codex/brainstorming-session-journal",
    cwd: "/repo/brainstorming-only",
    now: fixedDate(),
    projectSlug: "brainstorming-only",
    topic: "Context window recovery",
  });

  assert.match(
    session.dir,
    /projects\/brainstorming-only\/sessions\/20260521-153012-context-window-recovery$/
  );
  assert.equal(session.meta.project_slug, "brainstorming-only");
  assert.equal(session.meta.topic_slug, "context-window-recovery");
  assert.equal(session.meta.status, "active");
  assert.equal(session.meta.checkpoint_count, 0);
  assert.equal(session.meta.qa_since_checkpoint, 0);

  const projectDir = path.join(baseDir, "projects", "brainstorming-only");
  assert.equal(fs.readlinkSync(path.join(projectDir, "active")), session.dir);
  assert.equal(fs.readlinkSync(path.join(projectDir, "latest")), session.dir);

  const markdown = fs.readFileSync(session.markdownPath, "utf8");
  assert.match(markdown, /^# Brainstorming: Context window recovery/m);
  assert.match(markdown, /- Project slug: `brainstorming-only`/);
});

test("records question-answer progress and checkpoints after the tenth pair", () => {
  const baseDir = makeTempBase();
  const session = startSession({
    baseDir,
    now: fixedDate(),
    projectSlug: "brainstorming-only",
    topic: "Context window recovery",
  });

  for (let index = 0; index < 9; index += 1) {
    const progress = recordQuestionAnswer({
      now: fixedDate(13 + index),
      sessionDir: session.dir,
    });
    assert.equal(progress.checkpoint_due, false);
  }

  const due = recordQuestionAnswer({
    now: fixedDate(30),
    sessionDir: session.dir,
  });

  assert.equal(due.qa_since_checkpoint, 10);
  assert.equal(due.checkpoint_due, true);

  const checkpoint = writeCheckpoint({
    context: ["Future planning needs a first-hand record after compression."],
    decisions: ["Checkpoint after every ten effective question-answer pairs."],
    now: fixedDate(31),
    openQuestions: ["Which facts should be quoted verbatim?"],
    quotes: ["每十个提问，就把提问的内容记录下来"],
    reason: "qa-threshold",
    sessionDir: session.dir,
  });

  assert.equal(checkpoint.meta.checkpoint_count, 1);
  assert.equal(checkpoint.meta.decision_count, 1);
  assert.equal(checkpoint.meta.qa_since_checkpoint, 0);
  assert.equal(checkpoint.meta.latest_summary, "Checkpoint after every ten effective question-answer pairs.");

  const markdown = fs.readFileSync(session.markdownPath, "utf8");
  assert.match(markdown, /## Checkpoint 1/);
  assert.match(markdown, /Reason: `qa-threshold`/);
  assert.match(markdown, /> 每十个提问，就把提问的内容记录下来/);
});

test("writes key-decision checkpoints immediately and resets the pending count", () => {
  const baseDir = makeTempBase();
  const session = startSession({
    baseDir,
    now: fixedDate(),
    projectSlug: "brainstorming-only",
    topic: "Context window recovery",
  });

  for (let index = 0; index < 3; index += 1) {
    recordQuestionAnswer({ now: fixedDate(13 + index), sessionDir: session.dir });
  }

  const checkpoint = writeCheckpoint({
    decisions: ["Use active and latest pointers with separate semantics."],
    now: fixedDate(20),
    quotes: ["保留 latest，active 指向当前正在进行的 session"],
    reason: "key-decision",
    rejectedOptions: ["Do not overload latest to mean only active sessions."],
    sessionDir: session.dir,
  });

  assert.equal(checkpoint.meta.checkpoint_count, 1);
  assert.equal(checkpoint.meta.qa_since_checkpoint, 0);

  const markdown = fs.readFileSync(session.markdownPath, "utf8");
  assert.match(markdown, /Reason: `key-decision`/);
  assert.match(markdown, /Do not overload latest/);
});

test("closes a session, removes active, and keeps latest for recovery", () => {
  const baseDir = makeTempBase();
  const session = startSession({
    baseDir,
    now: fixedDate(),
    projectSlug: "brainstorming-only",
    topic: "Context window recovery",
  });
  const projectDir = path.join(baseDir, "projects", "brainstorming-only");

  const closed = closeSession({
    finalSummary: "Session journal rules are ready for implementation.",
    now: fixedDate(59),
    sessionDir: session.dir,
  });

  assert.equal(closed.meta.status, "closed");
  assert.equal(closed.meta.final_summary, "Session journal rules are ready for implementation.");
  assert.equal(fs.existsSync(path.join(projectDir, "active")), false);
  assert.equal(fs.readlinkSync(path.join(projectDir, "latest")), session.dir);
  assert.equal(readMeta(session.dir).closed_at, "2026-05-21T15:30:59+08:00");
});
