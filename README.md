# AI Studio — 跨端 AI 编程工作台

一个持续迭代的 AI 编程 IDE / 编程浏览器 / Three.js 场景创作平台原型。当前版本提供可运行的 Web 工作台和 Electron 桌面打包基础：项目导航、代码工作区、Agent/Skill 面板、Three.js 实时场景以及浏览器预览占位区。

> 当前为 MVP 原型。Agent 调用、多人实时协作、云端任务集群、真实浏览器内核和移动端客户端尚未接入；界面不会伪装成已连接的 AI 服务。

## 环境要求

- Node.js 20 或更高版本
- npm

## 本地开发

```bash
npm install
npm run dev
```

打开终端显示的本地地址。3D 场景在浏览器中直接渲染。

## 构建与打包

```bash
npm run build          # TypeScript 检查并生成 Web 静态资源到 dist/
npm run desktop        # 构建 Electron 桌面应用安装包
```

Electron Builder 按当前操作系统生成安装包；Windows、macOS、Linux 建议分别在对应系统或 CI runner 上构建。构建结果输出到 `release/`。

## 版本历史与持续迭代

- Git 分支和提交记录是源码历史的权威来源。每个可发布版本应打 Git tag，例如 `v0.1.0`。
- 每次迭代使用独立提交，发布时记录变更、构建产物和校验值；大资源不直接塞进源码仓库。
- 本工作台的“保存版本”目前将当前编辑器文本保存到浏览器 `localStorage`，仅供原型体验，不替代 Git、云端版本控制或备份。
- 发布自动化、签名、更新服务器和真正的跨设备同步后续接入。

## 技术栈

- React + TypeScript + Vite：Web 工作台
- Three.js：3D 视口
- Electron + electron-builder：桌面端外壳与安装包

## 目录

```text
src/                 Web 工作台与 Three.js 视口
 electron/           Electron 主进程与受限 preload
```

## 安全说明

桌面端启用 `contextIsolation`、禁用 renderer 的 Node 集成，并通过最小化 preload API 暴露能力。Agent 执行、插件安装和终端命令在实现前必须加入权限审批、隔离运行、资源限制和审计日志。
