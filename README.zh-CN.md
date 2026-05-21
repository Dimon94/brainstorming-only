# Brainstorming-Only

[English README](README.md)

`Brainstorming-Only` 是一个独立的 AI agent skill，用来做纯讨论型头脑风暴：澄清目标、比较选项、分析取舍、收敛决策，但不会进入规格文档、实施计划、脚手架、代码修改、提交或 PR。

这个项目是单 SKILL 开源包。它致敬原始的 `$brainstorming` skill：保留协作式澄清、方案生成和取舍分析的核心精神，同时刻意切断后续执行链路，让它只服务于“想清楚”，不自动滑向“开始做”。

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
- 只在必要时提出关键澄清问题
- 给出 2-3 个方向并说明利弊
- 压力测试假设、失败模式和隐藏复杂度
- 收敛成简短的 brainstorming outcome

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
- `brainstorming-only/agents/openai.yaml` - 兼容 skill 列表可读取的可选 UI 元数据
- `scripts/install.js` - npm 安装脚本，会复制 skill 到 `CODEX_HOME`
  和 `CLAUDE_HOME`

## 与 `$brainstorming` 的关系

`Brainstorming-Only` 是对 `$brainstorming` 的致敬，不是替代品。

`$brainstorming` 适合从想法一路走到规格文档和实施计划；`$brainstorming-only` 适合只想先讨论清楚，不希望本轮自动进入执行、计划、提交或 PR 的场景。

## License

MIT
