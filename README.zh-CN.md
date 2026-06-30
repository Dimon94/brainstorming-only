# Brainstorming-Only

[English README](README.md)

[![npm version](https://img.shields.io/npm/v/brainstorming-only.svg)](https://www.npmjs.com/package/brainstorming-only)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js >=16](https://img.shields.io/badge/node-%3E%3D16-339933.svg)](package.json)
[![GitHub stars](https://img.shields.io/github/stars/Dimon94/brainstorming-only?style=social)](https://github.com/Dimon94/brainstorming-only/stargazers)

`Brainstorming-Only` 是一个独立的 AI agent skill，用来做纯讨论型头脑风暴：澄清目标、比较选项、分析取舍、收敛决策，但不会进入规格文档、实施计划、脚手架、代码修改、提交或 PR。

这个项目是单 SKILL 开源包。它致敬 [Superpowers](https://github.com/obra/superpowers) 中原始的 [`$brainstorming` skill](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md)：保留协作式澄清、方案生成和取舍分析的核心精神，同时刻意切断后续执行链路，让它只服务于“想清楚”，不自动滑向“开始做”。它也吸收了 [gstack](https://github.com/garrytan/gstack) 中 [`office-hours`](https://github.com/garrytan/gstack/blob/main/office-hours/SKILL.md) 风格的产品诊断能力，但不依赖 gstack 运行时、遥测、设计文档、提交或 PR 流程。

当头脑风暴绑定到本地项目时，持久化只通过项目上下文文档完成：`CONTEXT.md` 只记录术语和边界，`docs/adr/` 只记录少量难以回退的取舍决策。它不再维护单独的 session journal、隐藏本地缓存或恢复目录。

## 快速安装

一句话安装到 Codex 和 Claude 两个 skill 目录：

```bash
npx --yes brainstorming-only --both
```

只安装 Codex：

```bash
npx --yes brainstorming-only --codex
```

只安装 Claude：

```bash
npx --yes brainstorming-only --claude
```

安装器会写入：

```bash
${CODEX_HOME:-~/.codex}/skills/brainstorming-only
${CLAUDE_HOME:-~/.claude}/skills/brainstorming-only
```

也可以全局安装：

```bash
npm install -g brainstorming-only
brainstorming-only --codex
```

环境要求：

- Node.js 16 或更新版本。
- 宿主支持本地 skill 目录。
- 当前用户可以写入 `~/.codex/skills` 或 `~/.claude/skills`。

## 使用

在支持 skills 的 AI agent 中这样调用：

```text
Use $brainstorming-only to compare these product directions and help me choose one.
```

这个 skill 的边界很明确：它只做讨论、选项、决策总结。它可以帮助你：

- 重新框定问题和目标
- 选择合适的头脑风暴姿态：通用讨论、产品诊断、Builder Mode
- 只在必要时提出关键澄清问题
- 给出 2-3 个方向并说明利弊
- 压力测试假设、失败模式和隐藏复杂度
- 收敛成统一的 A/B/C 选项输出，并说明推荐项和推荐理由

它不会：

- 写规格文档
- 写实施计划
- 创建项目脚手架
- 修改项目代码或项目文件
- 提交 git commit
- 创建或更新 PR
- 自动切换到其他工作流

## 新增能力

- 讨论优先的头脑风暴，明确停在 specs、plans、scaffolds、commits、PRs 之前。
- 三种姿态：通用讨论、产品诊断、Builder Mode。
- 冷水式清晰度：先指出弱假设、缺证据和失败模式，而不是廉价附和。
- 结构化决策暂停：宿主支持时使用原生选择 UI。
- 统一选项输出：阻塞选择和最终收敛都使用 A/B/C，必须有推荐项和推荐理由。
- 项目上下文文档作为唯一持久化面：确认后的术语写入 glossary-only `CONTEXT.md`，难以回退且有真实取舍的决策才进入 ADR。

## 结构化选项

这个 skill 使用同一种可见选项格式处理“阻塞选择暂停”和“最终收敛”。如果下一步推理必须等用户选一个方向，才使用宿主原生选择 UI；如果推荐方向已经清楚，最终回复仍然使用 A/B/C 选项，标出一个推荐项，并说明推荐理由。

choice protocol 只做宿主渲染 adapter。上游 brainstorming flow 先决定推荐项、reliability note，以及这是阻塞选择还是最终收敛，然后 protocol 才负责渲染。

对 Codex 的阻塞选择来说，就是在当前 turn 的工具列表里有 `request_user_input` 时使用它；Codex Default mode 可以通过 `~/.codex/config.toml` 开启这个工具：

```toml
[features]
default_mode_request_user_input = true
```

没有配置时，这个 skill 会退回固定 Markdown A/B/C 选项块，并等待用户回复 `A`、`B` 或 `C`。这个 Markdown 选项块只是 fallback，不是 Codex 原生弹窗。对 Claude Code 来说，原生选择是 MCP elicitation，除非官方宿主协议发生变化；对 gstack 风格宿主来说，就是在可用时使用真实的 `AskUserQuestion` 工具。

想让 Codex 直接开启这个设置，可以把这句发给 Codex：

```text
请帮我在 ~/.codex/config.toml 里开启 Codex Default-mode 选项弹窗：添加 [features] default_mode_request_user_input = true，并保留现有配置。
```

详细选项渲染 contract 和宿主映射放在 `brainstorming-only/references/user-choice-output-protocol.md`。

## 项目上下文文档

如果讨论解析出稳定的项目术语、边界或上下文关系，skill 会立即更新对应的
`CONTEXT.md`，而不是把候选内容攒到 session 末尾。`CONTEXT.md` 只作为术语表，
不写实现细节、计划、临时笔记或规格文档。

ADR 只在三个条件同时满足时才提出：决策难以回退、没有上下文会显得奇怪、并且
确实是在多个方案之间做了真实取舍。否则不创建 ADR。

## 隐私和本地数据

这个包不再创建本地恢复 journal 或隐藏 cache 目录。对于本地项目讨论，只有确认后的耐久知识会写入项目自己的上下文文档：`CONTEXT.md`、已有的 `CONTEXT-MAP.md`，或 `docs/adr/` 下的少量 ADR。

这个包不需要 gstack telemetry、analytics 或 runtime 命令。

## 前人工作与致谢

`brainstorming-only` 能成立，是因为已有开源项目先把这些工作流模式做成了可学习、可检验的形状。这里明确引用并表达敬意：

本项目独立维护，与下列项目及其维护者没有从属、赞助或官方背书关系。被引用项目仍归各自维护者维护，并遵循各自许可证。

- [Superpowers](https://github.com/obra/superpowers)，尤其是其中的 [`$brainstorming` skill](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md)：本项目致敬它的协作式澄清、方案生成、取舍分析，以及在实现前先收敛设计边界的精神；`brainstorming-only` 只是把这条链路收窄成纯讨论版本。
- [gstack](https://github.com/garrytan/gstack)，尤其是其中的 [`office-hours`](https://github.com/garrytan/gstack/blob/main/office-hours/SKILL.md)：本项目借鉴它更锋利的产品诊断姿态；同时保持对 gstack runtime、遥测和后续工作流的独立。

## 推荐的 SKILL 套件

如果你正在选择 agent skill 工作流，`brainstorming-only` 是刻意做小的选项：它适合只想先想清楚，但不希望自动进入计划或实现循环的场景。如果你需要更完整的工作流，我们推荐下面三个相关套件：

| SKILL 套件 | 适合的人 | 适合的工作情节 |
| --- | --- | --- |
| [Superpowers](https://github.com/obra/superpowers) | 想给 coding agent 装上一整套通用软件工程方法论的开发者和团队。 | 适合从想法澄清、计划、测试驱动实现、调试、评审到发布都希望 agent 按纪律执行，而不是靠临时 prompt 推进的场景。 |
| [gstack](https://github.com/garrytan/gstack) | 创业者、产品负责人、独立开发者，以及希望 agent 在产品判断、设计评审、工程评审、QA、发布和复盘上更有压迫感的团队。 | 适合问题不只是“怎么做”，而是“值不值得做、怎样做更有品味、怎样把产品意图变成更强计划并一路推进到交付”的场景。 |
| [cc-devflow](https://github.com/Dimon94/cc-devflow)（同作者项目） | 想要小而明确、证据优先、可复用 repo 工作流的维护者和 agent-assisted 工程团队。 | 适合需要从一个 roadmap 入口出发，区分新需求闭环和 Bug 调查闭环，完成计划或调查、实现、验证、创建 PR、review-first landing，并把 durable artifacts 留在 `devflow/` 下的项目执行场景。 |

## 关注数趋势

当前公开仓库信号，统计时间：2026-05-22。

- GitHub 仓库：[Dimon94/brainstorming-only](https://github.com/Dimon94/brainstorming-only)
- Stars：0
- Watchers：0
- npm 包：[brainstorming-only](https://www.npmjs.com/package/brainstorming-only)

[![Star History Chart](https://api.star-history.com/svg?repos=Dimon94/brainstorming-only&type=Date)](https://star-history.com/#Dimon94/brainstorming-only&Date)

## 本地验证

```bash
npm test
npm run pack:check
node scripts/install.js --codex
```

如果头脑风暴结束后你想继续做计划或实现，请把那当作一个新的请求，而不是这个 skill 的自动下一步。

## 包含内容

- `brainstorming-only/SKILL.md` - skill 主说明
- `brainstorming-only/references/brainstorming-method.md` - 详细头脑风暴流程、姿态、压力测试和输出格式
- `brainstorming-only/references/project-context-docs.md` - `CONTEXT.md` 和 ADR 持久化规则
- `brainstorming-only/references/recommendation-reliability.md` - second-sample 和 roundtable 推荐可靠性检查
- `brainstorming-only/references/user-choice-output-protocol.md` - 宿主结构化选项协议
- `brainstorming-only/agents/openai.yaml` - 兼容 skill 列表可读取的可选 UI 元数据
- `scripts/install.js` - npm 安装脚本，会复制 skill 到 `CODEX_HOME` 和 `CLAUDE_HOME`

## 文档

- [Architecture](ARCHITECTURE.md)
- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## 与 `$brainstorming` 的关系

`Brainstorming-Only` 是对 `$brainstorming` 的致敬，不是替代品。

`$brainstorming` 适合从想法一路走到规格文档和实施计划；`$brainstorming-only` 适合只想先讨论清楚，不希望本轮自动进入执行、计划、提交或 PR 的场景。

## License

MIT
