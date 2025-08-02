# vite-rolldown-upgrade

一个用于将 Vite 项目升级到 rolldown-vite 的命令行工具。

## 功能特点

- 🔄 自动替换 vite 依赖为 rolldown-vite
- 📦 支持多种包管理器 (npm, yarn, pnpm, bun)
- 🛠️ 自动处理依赖覆盖配置
- ⚡ 无缝升级体验

## 安装

如果你不想全局安装，也可以使用 pnpm dlx 临时执行：

```bash
pnpm dlx upgrade-vite-to-rolldown-vite
```

```bash
# 使用 npm
npm install -g vite-rolldown-upgrade

# 使用 yarn
yarn global add vite-rolldown-upgrade

# 使用 pnpm
pnpm add -g vite-rolldown-upgrade

# 使用 bun
bun add -g vite-rolldown-upgrade
```

## 使用方法

在你的 Vite 项目根目录下运行：

```bash
vite-rolldown-upgrade
```

### 命令行选项

```bash
Options:
  -s, --skip-install    跳过依赖安装
  -p, --path <path>     指定项目路径 (默认：当前目录)
  -h, --help           显示帮助信息
```

### 示例

```bash
# 升级当前目录的项目
vite-rolldown-upgrade

# 升级指定路径的项目
vite-rolldown-upgrade -p /path/to/project

# 仅更新配置，不安装依赖
vite-rolldown-upgrade --skip-install
```

## 工作原理

该工具会：

1. 检测项目使用的包管理器
2. 更新 package.json 中的依赖配置
3. 根据包管理器添加正确的依赖覆盖配置
4. 重新安装项目依赖

### 支持的项目类型

- 直接使用 Vite 的项目
- 使用 Vitepress 的项目
- 其他使用 Vite 作为 peer dependency 的项目

## 配置示例

### 直接依赖

```json
{
  "dependencies": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

### npm/bun 覆盖配置

```json
{
  "overrides": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

### yarn 覆盖配置

```json
{
  "resolutions": {
    "vite": "npm:rolldown-vite@latest"
  }
}
```

### pnpm 覆盖配置

```json
{
  "pnpm": {
    "overrides": {
      "vite": "npm:rolldown-vite@latest"
    }
  }
}
```

## 注意事项

1. 在升级前请确保已提交或备份了你的代码
2. 某些 Vite 插件可能尚未完全兼容 rolldown-vite
3. 如果遇到问题，可以通过移除覆盖配置轻松回退

## 常见问题

### Q: 升级后项目无法启动？

A: 检查是否有使用不兼容的 Vite 插件，可以尝试逐个禁用插件来定位问题。

### Q: 如何回退到普通的 Vite？

A: 删除 package.json 中的覆盖配置并重新安装依赖即可。

### Q: 支持哪些 Vite 版本？

A: rolldown-vite 目前支持 Vite 7.x 版本。

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 许可证

MIT

## 相关链接

- [Vite 官方文档](https://cn.vitejs.dev/)
- [Rolldown 文档](https://rolldown.rs/)
- [问题反馈](https://github.com/vitejs/rolldown-vite/issues)
