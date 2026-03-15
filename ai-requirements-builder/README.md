# AI Requirements Builder 🦞

> AI 驱动的需求说明书生成工具 - 让需求分析师轻松搞定文档编写

## 🎯 产品定位

为非技术背景的需求分析师打造，通过 AI 多轮问答自动收集信息并生成完整的需求规格说明书。

### 核心特性

- ✅ **密码保护后台** - 安全访问系统配置
- ✅ **智能问卷引导** - AI 动态生成下一批问题
- ✅ **需求文档自动生成** - Markdown + 导出格式支持
- ✅ **云端 API 集成** - 支持主流大模型服务商
- ✅ **桌面应用交付** - Windows .exe 一键运行

---

## 🚀 快速开始

### 1. 下载应用

从 [Releases](https://github.com/mangranyan/ai-requirements-builder/releases) 下载最新 `.exe` 安装包

### 2. 首次启动

1. 双击 `AI Requirements Builder.exe`
2. 输入管理员密码（默认：`admin123`）
3. 进入系统设置页面配置 API Key

### 3. 使用流程

```
登录 → 填写基础信息 → AI 生成后续问题 → 逐步完善需求 → 导出文档
```

---

## 💻 开发环境搭建

### 前置要求

- Node.js 18+
- npm 9+

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/mangranyan/ai-requirements-builder.git
cd ai-requirements-builder

# 安装依赖
npm install

# 启动开发服务器
npm run electron:dev
```

---

## 📂 项目结构

```
ai-requirements-builder/
├── electron/                # Electron 主进程
│   └── main.js             # 窗口管理 + IPC 通信
├── src/                    # React 前端代码
│   ├── pages/              # 页面组件
│   │   ├── Login.tsx       # 登录页
│   │   ├── Workbench.tsx   # 需求收集工作区
│   │   ├── Docs.tsx        # 文档查看页
│   │   └── Settings.tsx    # 系统设置页
│   ├── App.tsx            # 路由配置
│   └── main.tsx           # 入口文件
├── public/                 # 静态资源
├── package.json           # 项目配置
└── README.md              # 本文档
```

---

## 🔧 技术栈

| 类别 | 技术选型 |
|------|---------|
| **框架** | Electron + React 18 |
| **构建工具** | Vite |
| **UI 库** | Ant Design 5.x |
| **语言** | TypeScript 5.x |
| **状态管理** | localStorage (简单版) / Context API |
| **打包工具** | electron-builder |
| **API 集成** | Axios HTTP 客户端 |

---

## 🤖 AI 模型支持

| 服务商 | 支持的模型 | 备注 |
|--------|-----------|------|
| OpenAI | gpt-4o, gpt-4-turbo, gpt-3.5-turbo | 推荐 |
| Azure OpenAI | gpt-4o, gpt-4-turbo | 企业级部署 |
| 通义千问 | qwen-plus, qwen-max | 阿里云 |
| 智谱 AI | glm-4, glm-3-turbo | 国内可用 |
| LocalOllama | llama3, mistral | 本地离线模式 (待扩展) |

---

## 📝 配置文件说明

### System Settings (`Settings.tsx`)

在"系统设置"页面可配置以下参数：

- **Provider**: AI 服务商选择
- **API Key**: 对应服务商的密钥
- **Base URL**: 自定义代理地址（可选）
- **Model**: 使用的具体模型版本
- **Temperature**: 生成创意度（0-2，推荐 0.7）

### Data Storage (`localStorage`)

| Key | 说明 | 存储内容 |
|-----|------|---------|
| `isLoggedIn` | 登录状态 | `'true'/'false'` |
| `requirementsSession` | 当前会话数据 | JSON 格式的问答记录 |
| `aiConfig` | AI 配置 | JSON 格式的 API 参数 |

---

## 🛠️ 自定义与扩展

### 添加新的问题模板

编辑 `src/pages/Workbench.tsx`:

```typescript
const CUSTOM_QUESTIONS = [
  {
    id: 'q_custom',
    field: 'customField',
    label: '自定义问题',
    type: 'textarea',
    placeholder: '提示文本',
    maxLength: 500,
    required: true,
  }
]
```

### 修改文档模板

编辑 `src/pages/Docs.tsx`:

```typescript
const generateFullDocument = (answers: any) => {
  // 自定义 Markdown 模板逻辑
}
```

---

## 🐛 常见问题

### Q1: 为什么登录后没有任何反应？

检查浏览器控制台是否有错误，确保没有网络拦截插件阻止了 Electron 通信。

### Q2: API 连接测试失败

确认 API Key 正确且网络连接正常。如果使用代理，请配置正确的 Base URL。

### Q3: 如何打包为 .exe？

```bash
npm run electron:build
# 输出位于 dist-electron/
```

---

## 📄 License

MIT License © 2026 mangranyan

---

## 👨‍💻 维护者

- **开发者**: OpenClaw Agent (mangranyan)
- **联系方式**: GitHub Issues

---

*最后更新时间：2026-03-15*
