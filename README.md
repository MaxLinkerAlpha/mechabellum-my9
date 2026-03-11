# 我最心爱的9个钢指单位

> 钢铁指挥官 (Mechabellum) 玩家单位选择分享工具

## 项目变更记录

### 2026-03-12 清理冗余文件
- **删除未使用的 shadcn/ui 组件**（51个）：accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button-group, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, drawer, dropdown-menu, empty, field, form, hover-card, input-group, input-otp, input, item, kbd, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toggle-group, toggle, tooltip
- **删除未使用的 hook**：use-mobile.ts
- **保留组件**：button.tsx, dialog.tsx（实际使用）

一个受 [my9](https://github.com/SomiaWhiteRing/my9) 启发的网页应用，让钢铁指挥官玩家可以选择并分享构成自己战术风格的9个单位。

## 在线体验

[点击访问](https://你的用户名.github.io/mechabellum-my9)

## 功能特性

- **单位选择**：从29个钢铁指挥官单位中选择最多9个
- **分类浏览**：按轻型/中型/重型/超重型分类查看单位
- **搜索功能**：快速搜索单位名称
- **添加备注**：为每个单位添加个性化评价（最多50字）
- **导出图片**：一键生成带社区链接的分享图片
- **分享链接**：生成可分享的链接，他人可查看你的选择
- **社区链接**：内置Steam、QQ群、QQ频道、小黑盒链接

## 视觉风格

沿用 [mechabellum](https://github.com/MaxLinkerAlpha/mechabellum) 仓库的深色科技风格：

- 主背景：`#0c0c10`
- 面板背景：`#16161d`
- 主题色：`#00e5ff` (青色)
- 红色：`#ff3d00`
- 蓝色：`#2979ff`

## 单位分类

| 类别 | 颜色 | 单位 |
|------|------|------|
| 轻型 | `#4ade80` (绿色) | 尖牙、爬虫、弧光、野马、骇客、兵蜂、猎犬 |
| 中型 | `#fbbf24` (黄色) | 长弓、钢球、铁锤、犀牛、狂蝎、狼蛛、剑齿虎、火獾 |
| 重型/超重型 | `#f87171` (红色) | 霸主、暴雨、熔点、火神、凤凰、堡垒、沙虫、雷霆、恶灵、台风、魔眼、丧钟、战争工厂 |

## 如何添加更多单位

单位数据存储在 `src/data/units.ts` 文件中。要添加新单位，请按以下格式编辑：

```typescript
export const units: Unit[] = [
  // 现有单位...
  
  // 添加新单位
  { 
    id: '31',           // 唯一ID（数字字符串）
    cn: '新单位中文名', 
    en: 'New Unit Name', 
    s: '缩',            // 缩写（显示在格子中）
    category: 'heavy'   // 类别：light/medium/heavy
  },
];
```

### 添加单位步骤

1. Fork 本仓库
2. 编辑 `src/data/units.ts`
3. 在 `units` 数组中添加新单位对象
4. 确保 `id` 唯一
5. 选择合适的 `category`（light/medium/heavy）
6. 提交更改并推送
7. GitHub Actions 会自动部署更新

## 修改社区链接

社区链接配置在 `src/App.tsx` 文件中：

```typescript
const communityLinks = [
  { name: 'Steam商店', url: 'https://store.steampowered.com/app/669330/', icon: '🎮' },
  { name: 'QQ交流群', url: 'https://qm.qq.com/q/226025841', icon: '💬' },
  { name: 'QQ频道', url: 'https://pd.qq.com/g/pd90070872', icon: '📢' },
  { name: '小黑盒', url: 'https://api.xiaoheihe.cn/s/10019c', icon: '📦' },
];
```

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/你的用户名/mechabellum-my9.git
cd mechabellum-my9

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## GitHub Pages 部署

### 方法一：使用 GitHub Actions（推荐）

1. 在仓库根目录创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. 在仓库设置中启用 GitHub Pages，选择 "GitHub Actions" 作为源
3. 推送代码到 `main` 分支即可自动部署

### 方法二：手动部署

```bash
# 构建项目
npm run build

# 将 dist 文件夹内容推送到 gh-pages 分支
npm run deploy
```

## 分享功能说明

分享功能使用 Base64 编码将用户选择的单位数据嵌入到 URL 中：

- 点击"分享"按钮生成分享链接
- 链接格式：`https://your-domain/?s=BASE64_ENCODED_DATA`
- 他人访问链接时会自动加载分享的单位数据
- 导出的图片包含社区链接信息

## 数据来源

单位数据来源于 [MaxLinkerAlpha/mechabellum](https://github.com/MaxLinkerAlpha/mechabellum) 开源项目。

## 社区链接

- **Steam商店**: https://store.steampowered.com/app/669330/
- **钢铁指挥官交流5群**: 226025841
- **钢铁指挥官QQ频道**: https://pd.qq.com/g/pd90070872
- **游戏河小黑盒官方账号**: https://api.xiaoheihe.cn/s/10019c

## 致谢

- 灵感来源：[SomiaWhiteRing/my9](https://github.com/SomiaWhiteRing/my9) - 构成我的9部作品
- 数据来源：[MaxLinkerAlpha/mechabellum](https://github.com/MaxLinkerAlpha/mechabellum) - 钢铁指挥官战术复盘工作台
- 游戏：[钢铁指挥官 / Mechabellum](https://store.steampowered.com/app/669330/Mechabellum/)

## License

MIT License - 详见 [LICENSE](LICENSE) 文件
