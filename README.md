# Knowledge Juicer

把视频、文章、社交媒体内容榨成结构化学习笔记的个人 Skill。

支持 YouTube、X (Twitter)、Reddit、博客等多平台内容输入，基于布鲁姆分类学等教学法框架，自动生成包含概念图、自我评估、应用场景的完整学习材料。

## 效果示例

输入一个 YouTube 视频链接 → 输出：

```
📋 内容概述
🏰 故事版（寓言/小说）
🎯 学习目标
🔑 关键概念（定义+示例+类比）
🗺️ 概念图（ASCII 可视化）
📖 详细分解（基础→高级）
✅ 总结
🚀 应用（行动建议+场景表格）
🧪 自我评估（回忆+应用+反思）
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

这是一个兼容 Codex Skills 目录结构的 Skill，不是 Python 包或 npm 包。通用安装方式是：把整个仓库放到你所使用客户端的 skills 目录下。以下以 Codex 的默认目录 `~/.codex/skills` 为例。

### 方式一：通过 Git 安装（推荐）

```bash
mkdir -p ~/.codex/skills
git clone https://github.com/fxyadela/knowledge-juicer.git ~/.codex/skills/knowledge-juicer
```

后续更新：

```bash
cd ~/.codex/skills/knowledge-juicer
git pull
```

### 方式二：手动下载安装

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

安装后，重启 Codex 或开启一个新会话，让 Skill 被重新加载。

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

## 输出结构

每份笔记包含 9 个固定板块（详见 `assets/output-template.md`）：

1. 内容概述 — 3-5 句平实概括
2. 故事版 — 300-600 字通俗故事/寓言
3. 学习目标 — 布鲁姆分类学动词，可测量
4. 关键概念 — 定义 + 解释 + 示例 + 类比
5. 概念图 — ASCII 树状图/流程图
6. 详细分解 — 基础→高级分层
7. 总结 — 核心要点 + 一句话总结
8. 应用 — 行动建议 + 场景表格 + 延伸阅读
9. 自我评估 — 回忆性问题 + 应用性问题 + 反思提示

## 文件结构

```
knowledge-juicer/
├── SKILL.md              # 技能主文件（触发词、工作流程）
├── references/
│   ├── pedagogy.md       # 教学法框架（布鲁姆分类学、认知负荷理论等）
│   ├── quality-handling.md  # 不同质量内容的处理策略
│   └── api_reference.md  # 参考文档占位符
├── assets/
│   └── output-template.md # 输出笔记完整模板
└── scripts/
    └── example.py        # 扩展脚本占位符
```

## 教学法框架

本技能内置以下教育学理论：

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
