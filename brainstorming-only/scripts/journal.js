#!/usr/bin/env node

const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const JOURNAL_VERSION = 1;
const QA_CHECKPOINT_THRESHOLD = 10;

function defaultBaseDir() {
  return path.join(os.homedir(), ".brainstorming");
}

function pad(number) {
  return String(number).padStart(2, "0");
}

function formatTimestamp(date = new Date()) {
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("") + "-" + [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join("");
}

function formatLocalIso(date = new Date()) {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const offset = `${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${offset}`;
}

function slugify(value, fallback = "untitled") {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['"`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
  return slug || fallback;
}

function sanitizeProjectSlug(value) {
  return String(value || "").replace(/[^a-zA-Z0-9._-]/g, "");
}

function run(command, args, options = {}) {
  try {
    return childProcess.execFileSync(command, args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      ...options,
    }).trim();
  } catch (_error) {
    return "";
  }
}

function detectBranch(cwd = process.cwd()) {
  return run("git", ["branch", "--show-current"], { cwd }) || "unknown";
}

function slugFromRemoteUrl(remoteUrl) {
  const normalized = String(remoteUrl || "").trim().replace(/\.git$/, "");
  const match = normalized.match(/[:/]([^/:/]+\/[^/]+)$/);
  if (!match) return "";
  return sanitizeProjectSlug(match[1].replace("/", "-"));
}

function slugCachePath(cwd, baseDir) {
  const absoluteCwd = path.resolve(cwd || process.cwd());
  const cacheKey = absoluteCwd.replace(/[\\/]/g, "_");
  return path.join(baseDir, "slug-cache", cacheKey);
}

function readCachedSlug(cwd, baseDir) {
  const cachePath = slugCachePath(cwd, baseDir);
  if (!fs.existsSync(cachePath)) return "";
  return sanitizeProjectSlug(fs.readFileSync(cachePath, "utf8").trim());
}

function writeCachedSlug(cwd, baseDir, slug) {
  if (!slug) return;
  const cachePath = slugCachePath(cwd, baseDir);
  ensureDir(path.dirname(cachePath));
  fs.writeFileSync(cachePath, slug);
}

function resolveProjectSlug(cwd = process.cwd(), env = process.env, baseDir = defaultBaseDir()) {
  const override = sanitizeProjectSlug(env.BRAINSTORMING_PROJECT_SLUG || env.SLUG);
  if (override) return override;

  const cached = readCachedSlug(cwd, baseDir);
  if (cached) return cached;

  const remoteSlug = slugFromRemoteUrl(run("git", ["remote", "get-url", "origin"], { cwd }));
  const fallbackSlug = sanitizeProjectSlug(path.basename(path.resolve(cwd)));
  const slug = remoteSlug || fallbackSlug || "unknown";
  writeCachedSlug(cwd, baseDir, slug);
  return slug;
}

function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.writeFileSync(`${filePath}.tmp`, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(`${filePath}.tmp`, filePath);
}

function safeUnlink(linkPath) {
  try {
    fs.rmSync(linkPath, { force: true, recursive: false });
  } catch (_error) {
    // Ignore missing or platform-specific symlink cleanup failures.
  }
}

function pointLink(linkPath, targetPath) {
  safeUnlink(linkPath);
  fs.symlinkSync(targetPath, linkPath, process.platform === "win32" ? "junction" : "dir");
}

function projectDir(baseDir, projectSlug) {
  return path.join(baseDir, "projects", projectSlug);
}

function sessionPaths(sessionDir) {
  return {
    dir: sessionDir,
    markdownPath: path.join(sessionDir, "brainstorming.md"),
    metaPath: path.join(sessionDir, "meta.json"),
  };
}

function readMeta(sessionDir) {
  return readJson(path.join(sessionDir, "meta.json"));
}

function writeMeta(sessionDir, meta) {
  writeJson(path.join(sessionDir, "meta.json"), meta);
}

function uniqueSessionDir(sessionsDir, baseName) {
  let candidate = path.join(sessionsDir, baseName);
  let suffix = 2;
  while (fs.existsSync(candidate)) {
    candidate = path.join(sessionsDir, `${baseName}-${suffix}`);
    suffix += 1;
  }
  return candidate;
}

function initialMarkdown({ branch, createdAt, cwd, projectSlug, title, topicSlug }) {
  return `# Brainstorming: ${title}

## Session Context
- Project slug: \`${projectSlug}\`
- Topic slug: \`${topicSlug}\`
- Created: ${createdAt}
- CWD: \`${cwd || "unknown"}\`
- Branch: \`${branch || "unknown"}\`

## Recovery Notes
- Read \`meta.json\` first to confirm status, checkpoint counts, and pending question-answer pairs.
- Read the latest checkpoint before continuing after context compression.
- Checkpoint after 10 effective question-answer pairs, and immediately after key decisions.
`;
}

function startSession(options = {}) {
  const now = options.now || new Date();
  const cwd = options.cwd || process.cwd();
  const baseDir = options.baseDir || defaultBaseDir();
  const projectSlug = sanitizeProjectSlug(options.projectSlug) || resolveProjectSlug(cwd, process.env, baseDir);
  const title = options.topic || "Untitled brainstorming";
  const topicSlug = slugify(title);
  const branch = options.branch || detectBranch(cwd);
  const createdAt = formatLocalIso(now);
  const projectPath = projectDir(baseDir, projectSlug);
  const sessionsDir = path.join(projectPath, "sessions");
  const sessionDir = uniqueSessionDir(
    sessionsDir,
    `${formatTimestamp(now)}-${topicSlug}`
  );
  const paths = sessionPaths(sessionDir);

  ensureDir(sessionDir);

  const meta = {
    version: JOURNAL_VERSION,
    project_slug: projectSlug,
    topic: title,
    topic_slug: topicSlug,
    created_at: createdAt,
    updated_at: createdAt,
    last_checkpoint_at: null,
    checkpoint_count: 0,
    qa_since_checkpoint: 0,
    decision_count: 0,
    latest_summary: "",
    cwd,
    branch,
    status: "active",
  };

  fs.writeFileSync(
    paths.markdownPath,
    initialMarkdown({ branch, createdAt, cwd, projectSlug, title, topicSlug })
  );
  writeJson(paths.metaPath, meta);
  ensureDir(projectPath);
  pointLink(path.join(projectPath, "active"), sessionDir);
  pointLink(path.join(projectPath, "latest"), sessionDir);

  return { ...paths, meta, projectDir: projectPath };
}

function assertActive(meta) {
  if (meta.status === "closed") {
    throw new Error("Cannot update a closed brainstorming session.");
  }
}

function recordQuestionAnswer(options = {}) {
  const now = options.now || new Date();
  const sessionDir = options.sessionDir;
  if (!sessionDir) throw new Error("sessionDir is required.");

  const meta = readMeta(sessionDir);
  assertActive(meta);
  meta.qa_since_checkpoint += 1;
  meta.updated_at = formatLocalIso(now);
  writeMeta(sessionDir, meta);

  return {
    meta,
    checkpoint_due: meta.qa_since_checkpoint >= QA_CHECKPOINT_THRESHOLD,
    qa_since_checkpoint: meta.qa_since_checkpoint,
  };
}

function normalizeList(value) {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
}

function appendBullets(lines, title, values) {
  if (values.length === 0) return;
  lines.push(`### ${title}`);
  for (const value of values) {
    lines.push(`- ${value}`);
  }
  lines.push("");
}

function appendQuotes(lines, quotes) {
  if (quotes.length === 0) return;
  lines.push("### Evidence Quotes");
  for (const quote of quotes) {
    lines.push(`> ${quote}`);
  }
  lines.push("");
}

function latestSummary({ context, decisions, summary }) {
  if (summary) return summary;
  if (decisions.length > 0) return decisions[decisions.length - 1];
  if (context.length > 0) return context[context.length - 1];
  return "";
}

function writeCheckpoint(options = {}) {
  const now = options.now || new Date();
  const sessionDir = options.sessionDir;
  if (!sessionDir) throw new Error("sessionDir is required.");

  const meta = readMeta(sessionDir);
  assertActive(meta);

  const context = normalizeList(options.context);
  const decisions = normalizeList(options.decisions);
  const openQuestions = normalizeList(options.openQuestions);
  const quotes = normalizeList(options.quotes);
  const rejectedOptions = normalizeList(options.rejectedOptions);
  const summary = options.summary || "";
  const timestamp = formatLocalIso(now);
  const checkpointNumber = meta.checkpoint_count + 1;

  const lines = [
    "",
    `## Checkpoint ${checkpointNumber}`,
    `- Time: ${timestamp}`,
    `- Reason: \`${options.reason || "manual"}\``,
    "",
  ];

  appendQuotes(lines, quotes);
  appendBullets(lines, "Decisions", decisions);
  appendBullets(lines, "Rejected Options", rejectedOptions);
  appendBullets(lines, "Open Questions", openQuestions);
  appendBullets(lines, "Context For Future Planning", context);
  if (summary) {
    lines.push("### Summary", summary, "");
  }

  fs.appendFileSync(path.join(sessionDir, "brainstorming.md"), `${lines.join("\n")}\n`);

  meta.updated_at = timestamp;
  meta.last_checkpoint_at = timestamp;
  meta.checkpoint_count = checkpointNumber;
  meta.qa_since_checkpoint = 0;
  meta.decision_count += decisions.length;
  meta.latest_summary = latestSummary({ context, decisions, summary });
  writeMeta(sessionDir, meta);

  return { ...sessionPaths(sessionDir), meta };
}

function activeLinkPointsTo(projectPath, sessionDir) {
  const activePath = path.join(projectPath, "active");
  if (!fs.existsSync(activePath)) return false;
  try {
    return fs.readlinkSync(activePath) === sessionDir;
  } catch (_error) {
    return false;
  }
}

function closeSession(options = {}) {
  const now = options.now || new Date();
  const sessionDir = options.sessionDir;
  if (!sessionDir) throw new Error("sessionDir is required.");

  const meta = readMeta(sessionDir);
  const timestamp = formatLocalIso(now);
  meta.status = "closed";
  meta.closed_at = timestamp;
  meta.updated_at = timestamp;
  meta.final_summary = options.finalSummary || "";
  writeMeta(sessionDir, meta);

  fs.appendFileSync(
    path.join(sessionDir, "brainstorming.md"),
    `\n## Session Closed\n- Time: ${timestamp}\n- Final summary: ${meta.final_summary || "n/a"}\n`
  );

  const projectPath = projectDir(
    path.join(sessionDir.split(`${path.sep}projects${path.sep}`)[0]),
    meta.project_slug
  );
  if (activeLinkPointsTo(projectPath, sessionDir)) {
    safeUnlink(path.join(projectPath, "active"));
  }

  return { ...sessionPaths(sessionDir), meta };
}

function stateForProject(options = {}) {
  const baseDir = options.baseDir || defaultBaseDir();
  const projectSlug = sanitizeProjectSlug(options.projectSlug) || resolveProjectSlug(options.cwd, process.env, baseDir);
  const dir = projectDir(baseDir, projectSlug);
  const readLink = (name) => {
    const link = path.join(dir, name);
    if (!fs.existsSync(link)) return null;
    try {
      return fs.readlinkSync(link);
    } catch (_error) {
      return null;
    }
  };
  return {
    project_dir: dir,
    active: readLink("active"),
    latest: readLink("latest"),
  };
}

function parseArgs(argv) {
  const parsed = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      parsed._.push(arg);
      continue;
    }
    const key = arg.slice(2).replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
    const next = argv[index + 1];
    const value = next && !next.startsWith("--") ? next : true;
    if (value !== true) index += 1;
    if (parsed[key] === undefined) {
      parsed[key] = value;
    } else if (Array.isArray(parsed[key])) {
      parsed[key].push(value);
    } else {
      parsed[key] = [parsed[key], value];
    }
  }
  return parsed;
}

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function main(argv = process.argv.slice(2)) {
  const [command] = argv;
  const args = parseArgs(argv.slice(1));

  if (command === "start") {
    printJson(startSession({
      baseDir: args.baseDir,
      branch: args.branch,
      cwd: args.cwd,
      projectSlug: args.projectSlug,
      topic: args.topic,
    }));
    return;
  }

  if (command === "record-qa") {
    printJson(recordQuestionAnswer({ sessionDir: args.session }));
    return;
  }

  if (command === "checkpoint") {
    printJson(writeCheckpoint({
      context: args.context,
      decisions: args.decision,
      openQuestions: args.openQuestion,
      quotes: args.quote,
      reason: args.reason,
      rejectedOptions: args.rejected,
      sessionDir: args.session,
      summary: args.summary,
    }));
    return;
  }

  if (command === "close") {
    printJson(closeSession({
      finalSummary: args.summary,
      sessionDir: args.session,
    }));
    return;
  }

  if (command === "state") {
    printJson(stateForProject({
      baseDir: args.baseDir,
      cwd: args.cwd,
      projectSlug: args.projectSlug,
    }));
    return;
  }

  throw new Error("Usage: journal.js <start|record-qa|checkpoint|close|state> [options]");
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exit(1);
  }
}

module.exports = {
  closeSession,
  defaultBaseDir,
  formatLocalIso,
  formatTimestamp,
  readMeta,
  recordQuestionAnswer,
  resolveProjectSlug,
  sanitizeProjectSlug,
  slugify,
  slugFromRemoteUrl,
  startSession,
  stateForProject,
  writeCheckpoint,
};
