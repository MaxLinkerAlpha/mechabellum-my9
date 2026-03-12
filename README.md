# 我最心爱的9个钢指单位

> 钢铁指挥官 (Mechabellum) 玩家单位选择分享工具

一个受 [my9](https://github.com/SomiaWhiteRing/my9) 启发的网页应用，让钢铁指挥官玩家可以选择并分享自己最心爱的9个单位。

## 在线体验

[点击访问](https://maxlinkeralpha.github.io/mechabellum-my9)

## 功能特性

- **单位选择**：从34个钢铁指挥官单位中选择最多9个，支持重复选择整活
- **图标展示**：平铺展示所有单位图标，直观选择
- **添加备注**：为每个单位添加个性化评价（最多50字），字号自适应撑满格子
- **导出图片**：一键生成带二维码的分享图片，支持复制到剪贴板直接粘贴
- **分享链接**：生成可分享的链接，他人可查看你的选择
- **社区入口**：中文用户（Steam/QQ群/QQ频道）和英文用户（Discord/Reddit/Steam）
- **响应式设计**：适配桌面端和移动端，手机端自动跳转优化

## 技术栈

- **核心框架**：React 19 + TypeScript + Vite 7
- **样式工具**：Tailwind CSS + tailwindcss-animate
- **UI组件**：Radix UI (Dialog) + shadcn/ui
- **功能库**：
  - html2canvas - 图片导出
  - sonner - Toast通知
  - lucide-react - 图标
  - class-variance-authority + clsx + tailwind-merge - 样式工具

## 项目结构

```
src/
├── App.tsx           # 主应用组件
├── components/ui/    # UI组件 (button, dialog)
├── data/
│   └── units.ts      # 单位数据
└── lib/
    └── utils.ts      # 工具函数

public/
├── unit_icon/        # 单位图标
└── qr_codes/         # 二维码图片
```

## 添加新单位

1. 将单位图标放入 `public/unit_icon/` 目录
2. 编辑 `src/data/units.ts`，按格式添加单位数据：

```typescript
{
  id: '32',
  cn: '新单位中文名',
  en: 'New Unit Name', 
  s: '缩', //存疑，我记得让AI删除过
  icon: './unit_icon/xxx.png'
}
```

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/MaxLinkerAlpha/mechabellum-my9.git
cd mechabellum-my9

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## GitHub Pages 部署

本项目使用 GitHub Actions 自动部署：

1. 推送代码到 `main` 分支
2. Actions 自动构建并部署到 GitHub Pages
3. 部署配置见 `.github/workflows/deploy.yaml`

## 分享功能说明

- 点击"分享"按钮生成分享链接
- 链接格式：`https://your-domain/?s=BASE64_ENCODED_DATA`
- 他人访问链接时会自动加载分享的单位数据

## 社区链接

**中文社区：**
- **Steam商店**: https://store.steampowered.com/app/669330/
- **QQ交流群**: 226025841
- **QQ频道**: https://pd.qq.com/g/pd90070872

**国际社区：**
- **Discord**: https://discord.gg/mechabellum
- **Reddit**: https://www.reddit.com/r/Mechabellum/
- **Steam Discussions**: https://steamcommunity.com/app/669330/discussions/

## 致谢

- 灵感来源：[SomiaWhiteRing/my9](https://github.com/SomiaWhiteRing/my9)
- 数据来源：[MaxLinkerAlpha/mechabellum](https://github.com/MaxLinkerAlpha/mechabellum)
- 游戏：[钢铁指挥官 / Mechabellum](https://store.steampowered.com/app/669330/Mechabellum/)

## License

MIT License - 详见 [LICENSE](LICENSE) 文件
