# 我最心爱的9个钢指单位

> 钢铁指挥官 (Mechabellum) 玩家单位选择分享工具

一个受 [my9](https://github.com/SomiaWhiteRing/my9) 启发的网页应用，让钢铁指挥官玩家可以选择并分享自己最心爱的9个单位。

## 在线体验

[点击访问](https://maxlinkeralpha.github.io/mechabellum-my9fav)

## 功能特性

- **单位选择**：从29个钢铁指挥官单位中选择最多9个
- **图标展示**：左侧平铺展示所有单位图标，直观选择
- **添加备注**：为每个单位添加个性化评价（最多50字）
- **导出图片**：一键生成带二维码的分享图片
- **分享链接**：生成可分享的链接，他人可查看你的选择
- **社区入口**：顶部集成Steam商店、QQ群、QQ频道、小黑盒链接
- **GitHub Stars**：实时显示项目Stars数量

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

编辑 `src/data/units.ts`：

```typescript
{
  id: '32',
  cn: '新单位中文名',
  en: 'New Unit Name', 
  s: '缩',
  category: 'heavy',  // light/medium/heavy
  icon: './unit_icon/xxx.png'
}
```

添加单位图标到 `public/unit_icon/` 目录。

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

- **Steam商店**: https://store.steampowered.com/app/669330/
- **QQ交流群**: 226025841
- **QQ频道**: https://pd.qq.com/g/pd90070872
- **小黑盒**: https://api.xiaoheihe.cn/s/10019c

## 致谢

- 灵感来源：[SomiaWhiteRing/my9](https://github.com/SomiaWhiteRing/my9)
- 数据来源：[MaxLinkerAlpha/mechabellum](https://github.com/MaxLinkerAlpha/mechabellum)
- 游戏：[钢铁指挥官 / Mechabellum](https://store.steampowered.com/app/669330/Mechabellum/)

## License

MIT License - 详见 [LICENSE](LICENSE) 文件
