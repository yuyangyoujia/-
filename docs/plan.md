# ComuPage 项目计划

## 项目概述

**comupage.com** — 中国数字游民社区数据库，地图为中心，网页端（手机 + 电脑可访问）。

核心功能：
1. 在地图上发现数字游民社区
2. 浏览社区详情（类型、位置、价格、联系方式）
3. 按类型、地区、关键词筛选
4. 结构化数据通过 X402 协议付费提供

---

## 商业模式

| 用户 | 价格 | 内容 |
|---|---|---|
| 普通用户 | **免费** | 网页全部可看，无限制 |
| 机构 / 开发者 | **年费 / 按次付费** | API 批量导出、Webhook 变更推送、历史变更记录 |

支付：微信 / 支付宝（可开发票）。

---

## 当前进度

✅ 已完成（MVP）：
- Next.js 项目搭建
- MapLibre GL 地图集成（OSM tile，中国中心视角）
- 15 个种子社区数据（分布 9 省市）
- 社区类型定义（coliving / coworking / opc / hybrid）
- 侧栏列表 + 筛选（搜索 / 类型 / 省份）
- 社区详情面板（手机底部 sheet / 桌面侧栏）
- 地图标记点（不同颜色代表不同类型）

---

## V1 待做清单

按优先级排序：

### [P0] 核心体验完整
- [ ] 社区 CRUD 页面（添加 / 编辑社区 — 管理后台）
- [ ] URL 路由：`/community/[slug]` 独立详情页（可分享）
- [ ] 无服务器/边缘数据库（初期 SQLite → Turso/Neon）
- [ ] 地图点击标记弹出基本信息（Popup），而不是必须从侧栏点

### [P1] 用户 & 数据
- [ ] 用户提交社区表单（公开，经审核后入库）
- [ ] 用户登录（可选，用于提交/收藏）
- [ ] X402 API 端点 + API Key 管理
- [ ] 微信 / 支付宝支付接入
- [ ] 数据导出（JSON / CSV）

### [P2] 数据监测（核心差异竞争力）
- [ ] 小红书搜索扫描器
- [ ] 微信公众号文章监测
- [ ] 新增社区检测 + 通知
- [ ] 月度全量复检（链接 404 / 社交账号停更 → 标记关闭）
- [ ] GitHub Actions 定时任务（每日扫描 / 每月复检）

### [P3] 质量 & 增长
- [ ] SEO 优化（每个社区独立详情页，结构化数据标记）
- [ ] 社区收藏/笔记功能
- [ ] 数据贡献者排行榜
- [ ] 小程序 / 轻量版

---

## 更新节奏

```
MVP 阶段：每周手动更新（种子数据 → 更多社区）
V1 阶段：每天自动扫描新增，每周人工审核入库
V2 阶段：检测全自动化，每月复检测注销
```

---

## 数据库设计

```sql
-- 核心表
CREATE TABLE communities (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  type        TEXT NOT NULL CHECK(type IN ('coliving','coworking','opc','hybrid')),
  status      TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','closed','paused')),
  city        TEXT NOT NULL,
  province    TEXT NOT NULL,
  district    TEXT,
  address     TEXT,
  lat         REAL NOT NULL,
  lng         REAL NOT NULL,
  description TEXT NOT NULL,
  tags        TEXT NOT NULL DEFAULT '[]',   -- JSON array
  website     TEXT,
  wechat      TEXT,
  xiaohongshu TEXT,
  phone       TEXT,
  opened_at   TEXT,
  closed_at   TEXT,
  price_range TEXT,
  capacity    INTEGER,
  verified_at TEXT,
  source_url  TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 数据变更日志（面向付费用户）
CREATE TABLE change_log (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  community_id TEXT NOT NULL REFERENCES communities(id),
  field        TEXT NOT NULL,
  old_value    TEXT,
  new_value    TEXT,
  changed_at   TEXT NOT NULL DEFAULT (datetime('now')),
  detected_by  TEXT  -- 'manual' | 'crawler' | 'user_report'
);
```

---

## 部署计划

1. **域名**：comupage.com（Cloudflare DNS，国内 CDN 可选）
2. **前端**：Vercel（默认，国内访问速度可接受）
3. **数据库**：初期 SQLite（本地开发）→ Turso（边缘 SQLite，全球节点）或 Neon（PostgreSQL）
4. **定时任务**：Vercel Cron 或 GitHub Actions
5. **国内备案**：如果主要用户在国内，考虑阿里云/腾讯云 ICP 备案

---

## 数据源策略

初始数据靠手动收集 + 用户提交。后续增量：

| 来源 | 方法 | 频率 |
|---|---|---|
| 小红书 | 搜索关键词 + 笔记抓取 | 每日 |
| 微信公众号 | 搜狗微信搜索 + 文章监测 | 每日 |
| 即刻圈子 | 数字游民相关圈子 | 每周 |
| 豆瓣小组 | 数字游民/共居小组 | 每周 |
| 用户提交 | 网页表单 + 审核 | 随时 |
| 友链互查 | 已有社区网站友情链接 | 每月 |

---

## X402 协议实现思路

HTTP 402 Payment Required 是 HTTP 标准状态码，一直未被主流使用。这里用它作为 API 付费入口：

```http
GET /api/v1/communities?format=json
→ 402 Payment Required
  X-402-Reason: subscription_required
  X-402-Pricing: https://comupage.com/pricing
  X-402-Minimum: monthly
```

正常流程：
1. 用户注册 → 获取 API Key
2. 付费订阅（年/月）→ Key 激活
3. 请求带 `Authorization: Bearer <key>` → 返回数据
4. 未付费/额度用完 → 返回 402

支付：接入微信支付（JSAPI / H5）+ 支付宝当面付。发票走平台代开或自开。

---

## 竞争差异

| 维度 | ComuPage | 其他（携程/美团/豆瓣） |
|---|---|---|
| 专注 | 只收录数字游民社区 | 所有住宿/办公 |
| 地图 | 地图优先，发现驱动 | 列表优先 |
| 数据 | 结构化、版本可追溯 | 非结构化 |
| 监测 | 新增/注销自动检测 | 无 |
| API | X402 付费开放 | 一般不开放 |