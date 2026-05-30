# Knowledge Juicer

把视频、文章、社交媒体内容榨成低认知负荷学习笔记的个人 Skill。

默认不是生成一份完整教材，而是先帮你快速学懂：一句话结论、3 个关键点、一个直觉例子、少量核心概念和 3 个自测问题。

如果你明确要求深度分析，它也可以展开为完整学习笔记：概念图、详细分解、应用场景、自我评估和延伸阅读。

> Obsidian 和 IMA 只是额外的保存功能：你可以把分析结果存到自己的 Obsidian Vault 或 IMA 知识库里。不配置它们也能正常使用，Knowledge Juicer 的核心功能就是分析内容并生成学习笔记。

## 效果示例

输入一个 YouTube 视频链接 → 默认输出：

```
一句话结论
你只需要先抓住这 3 点
直觉钩子
最小解释（1-3 个核心概念）
立刻能做
自测 3 问
存疑或需要核实
```

## 支持平台

| 平台 | 处理方式 |
|------|---------|
| YouTube | 自动获取字幕/逐字稿，按章节结构整理 |
| X (Twitter) | 抓取推文串，整合回复脉络 |
| Reddit | 主帖 + 前 10 条高赞评论整合 |
| 博客/文章 | 提取正文，保留逻辑结构 |
| 直接文本 | 任意粘贴内容直接分析 |

## 安装

这是一个兼容 Codex Skills 目录结构的 Skill。面向普通用户，推荐直接用安装器；熟悉 Git 的用户也可以手动安装。

### 方式一：一键安装（推荐）

```bash
npx github:fxyadela/knowledge-juicer
```

安装器会自动完成：

1. 安装 Skill 到 `~/.codex/skills/knowledge-juicer`
2. 可选引导你选择自己的 Obsidian Vault
3. 可选配置自己的 IMA Client ID / API Key
4. 生成本机配置文件 `config.local.json`

安装完成后，重启 Codex 或开启一个新会话，让 Skill 被重新加载。

如果你只想安装，不想现在配置 Obsidian / IMA：

```bash
npx github:fxyadela/knowledge-juicer -- --skip-config
```

如果你已经安装过，想覆盖更新：

```bash
npx github:fxyadela/knowledge-juicer -- --force
```

> 说明：`config.local.json` 只保存在你的电脑里，不会上传到 GitHub。每个用户都需要配置自己的 Obsidian 和 IMA 信息。

### 方式二：通过 Git 手动安装

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/fxyadela/knowledge-juicer.git ~/.codex/skills/knowledge-juicer
```

后续更新：

```bash
cd ~/.codex/skills/knowledge-juicer
git pull
```

### 方式三：下载 ZIP 手动安装

1. 在 GitHub 页面点击 **Code → Download ZIP**
2. 解压后将文件夹重命名为 `knowledge-juicer`
3. 移动到 `~/.codex/skills/knowledge-juicer`

最终目录应类似：

```text
~/.codex/skills/knowledge-juicer/
├── SKILL.md
├── README.md
├── assets/
├── references/
└── scripts/
```

### 可选：本地校验

如果你的 Codex 环境里有系统自带的 skill 校验脚本，可以运行：

```bash
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py ~/.codex/skills/knowledge-juicer
```

看到 `Skill is valid!` 即表示基础结构可被识别。

## 使用方式

安装后，向 Codex 发送以下类型的指令即可触发：

- 「分析这个」+ 链接
- 「提取教学内容」+ 链接或文本
- 「生成学习笔记」+ 主题
- 直接粘贴 YouTube / X / Reddit 链接

## 输出模式

### 速学模式（默认）

适合 ADHD 友好的快速理解场景。结构详见 `assets/output-template.md`：

1. 一句话结论
2. 你只需要先抓住这 3 点
3. 直觉钩子
4. 最小解释
5. 立刻能做
6. 自测 3 问
7. 存疑或需要核实

### 深挖模式（按需）

当你明确说「深度分析」「完整学习笔记」「生成教材」「要概念图」「做成知识库笔记」时启用。深挖模式可包含：

- 内容概述
- 学习目标
- 关键概念
- 概念图
- 详细分解
- 应用场景
- 自我评估
- 进一步学习

### 归档模式（按需）

当你明确说「保存到 Obsidian」「同步到 IMA」「放进知识库」时启用。保存失败不会阻塞笔记生成。

## 文件结构

```
knowledge-juicer/
├── SKILL.md              # 技能主文件（触发词、工作流程）
├── references/
│   ├── pedagogy.md       # 教学法框架（布鲁姆分类学、认知负荷理论等）
│   ├── quality-handling.md  # 不同质量内容的处理策略
│   └── api_reference.md  # 参考文档占位符
├── assets/
│   └── output-template.md # 默认速学笔记模板
└── scripts/
    └── example.py        # 扩展脚本占位符
```

## 教学法框架

本技能参考以下教育学理论，但默认不会把这些理论名词展示给用户：

- **布鲁姆分类学** — 制定可测量的学习目标
- **认知负荷理论** — 控制单份笔记概念数量（7±2）
- **建构主义** — 新概念锚定已有知识框架
- **间隔重复原则** — 嵌入复习机制

详见 `references/pedagogy.md`。

## 敏感信息处理

原版技能包含作者个人 Obsidian 路径和 IMA 知识库凭证，**本开源版本已将所有敏感信息清除**，改为自动探测路径和配置提示，可直接安全使用。

## 许可证

MIT License — 详见 [LICENSE](LICENSE)

## 贡献

欢迎提交 Issue 和 Pull Request！特别是：

- 新平台支持（Bilibili、微信公众号等）
- 教学法框架改进
- 输出模板优化

---

**作者**：Cora（捏捏番茄）| **技能类型**：Codex 学习内容榨汁 Skill
