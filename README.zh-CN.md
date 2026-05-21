# Brainstorming-Only

[English README](README.md)

`Brainstorming-Only` 是一个独立的 AI agent skill，用来做纯讨论型头脑风暴：澄清目标、比较选项、分析取舍、收敛决策，但不会进入规格文档、实施计划、脚手架、代码修改、提交或 PR。

这个项目是单 SKILL 开源包。它致敬原始的 `$brainstorming` skill：保留协作式澄清、方案生成和取舍分析的核心精神，同时刻意切断后续执行链路，让它只服务于“想清楚”，不自动滑向“开始做”。它也吸收了 `office-hours` 风格的产品诊断能力，但不依赖 gstack 的运行时、遥测、设计文档、提交或 PR 流程。

## 安装

```bash
npm install -g brainstorming-only
```

默认安装时，同一份 skill 会复制到 Codex 和 Claude 两个生态：

```bash
${CODEX_HOME:-~/.codex}/skills/brainstorming-only
${CLAUDE_HOME:-~/.claude}/skills/brainstorming-only
```

也可以直接运行安装器：

```bash
npx brainstorming-only
```

也可以只安装其中一个生态：

```bash
npx brainstorming-only --codex
npx brainstorming-only --claude
npx brainstorming-only --both
```

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
- 收敛成简短的 brainstorming outcome

## 模式

- **通用头脑风暴**：澄清模糊想法，比较方向，收敛决策。
- **产品诊断**：压力测试需求证据、现有替代方案、具体用户、最小 wedge、真实观察和未来适配。
- **Builder Mode**：用于 side project、开源、学习、研究、demo、hackathon，帮助找到最有趣、最快可展示的版本。

## 结构化选项

当宿主支持原生选择 UI 时，这个 skill 会优先使用原生选择，而不是普通 prose。对 Codex 来说，就是在可用时使用 `request_user_input`；对 Claude Code 来说，就是在可用时使用 MCP elicitation 或其它真实结构化输入工具；对 gstack 风格宿主来说，就是在可用时使用真实的 `AskUserQuestion` 工具。详细宿主映射放在 `brainstorming-only/references/user-choice-output-protocol.md`。普通 A/B/C 文本只作为 fallback。

它不会：

- 写规格文档
- 写实施计划
- 创建项目脚手架
- 修改代码或文件
- 提交 git commit
- 创建或更新 PR
- 自动切换到其他工作流

如果头脑风暴结束后你想继续做计划或实现，请把那当作一个新的请求，而不是这个 skill 的自动下一步。

## 包含内容

- `brainstorming-only/SKILL.md` - skill 主说明
- `brainstorming-only/references/user-choice-output-protocol.md` - 宿主结构化选项协议
- `brainstorming-only/agents/openai.yaml` - 兼容 skill 列表可读取的可选 UI 元数据
- `scripts/install.js` - npm 安装脚本，会复制 skill 到 `CODEX_HOME`
  和 `CLAUDE_HOME`

## 与 `$brainstorming` 的关系

`Brainstorming-Only` 是对 `$brainstorming` 的致敬，不是替代品。

`$brainstorming` 适合从想法一路走到规格文档和实施计划；`$brainstorming-only` 适合只想先讨论清楚，不希望本轮自动进入执行、计划、提交或 PR 的场景。

## License

MIT
