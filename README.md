# ComuPage — 中国数字游民社区地图

收录中国各地数字游民社区，在地图上发现你的下一个目的地。

**comupage.com**

## 收录范围

| 类型 | 说明 |
|---|---|
| Coliving | 提供住宿的共居空间 |
| Coworking | 共享办公空间 |
| OPC | 开放创作社区 (Open Creative Community) |
| Hybrid | 综合型（住宿+办公+社区） |

面向：数字游民、远程工作者、自由职业者、艺术家、创作者、开发者。

## 当前阶段

✅ MVP — 种子数据 15 个社区，地图 + 列表 + 筛选已完成

## 本地开发

```bash
npm install
npm run dev
# → http://localhost:3000
npm run build   # 构建
```

## 技术栈

- Next.js 16 (App Router)
- MapLibre GL (OpenStreetMap tiles)
- Tailwind CSS
- TypeScript

## 项目结构

```
src/
├── app/                     # Next.js 页面
│   ├── page.tsx             # 首页（地图 + 侧栏列表）
│   └── layout.tsx           # 根布局
├── components/
│   ├── map/MapView.tsx      # 地图组件
│   └── community/           # 社区卡片、详情、筛选
├── data/communities.ts      # 种子数据
├── types/community.ts       # 类型定义
└── lib/
```

## 更新节奏

| 阶段 | 频率 | 方式 |
|---|---|---|
| MVP | 每周 | 手动收集 + 用户提交 |
| V2 | 每日 | 半自动检测（小红书/公众号） |
| V3 | 每日/每月 | 自动新增检测 + 每月全量复检 |

## X402 数据协议

网页免费浏览。结构化数据通过 X402 协议付费获取。

**面向普通用户：** 全部免费，网页可查所有社区。
**面向机构/开发者：** 通过 API 批量获取数据，支持 JSON / CSV 导出。

付费内容：
- 历史变更记录
- 批量导出
- Webhook 变更推送
- 联系方式验证状态

支付方式：微信 / 支付宝（可开发票）