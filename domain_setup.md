# 🌐 蓝巨人力官网 — Cloudflare DNS + GitHub Pages 子域名配置指南

> **状态**：📋 本文档为操作指引，等待 GitHub 仓库建好后再实际修改 DNS
> **母域名**：`bzcrl.dpdns.org`（老大 Cloudflare 免费域名）
> **子域名**：`lanju.bzcrl.dpdns.org`（暂定，后续可改）
> **目标指向**：`lanjuhr.github.io`（暂定，以实际 GitHub Pages 地址为准）
> **更新日期**：2026-07-02

---

## 📋 目录

1. [前置准备](#1-前置准备)
2. [Cloudflare 登录方式](#2-cloudflare-登录方式)
3. [检查现有 DNS 记录](#3-检查现有-dns-记录)
4. [添加 CNAME 记录](#4-添加-cname-记录)
5. [GitHub 仓库设置](#5-github-仓库设置)
6. [SSL/TLS 配置（重要！）](#6-ssltls-配置重要)
7. [验证配置](#7-验证配置)
8. [常见问题](#8-常见问题)
9. [后续钜诚/志晨网站的子域名规划](#9-后续钜诚志晨网站的子域名规划)

---

## 1. 前置准备

### 需要准备的信息

| 项目 | 值（当前） | 说明 |
|------|-----------|------|
| Cloudflare 登录邮箱 | 老大邮箱（已注册） | 老大已有 Cloudflare 账号 |
| Cloudflare 密码 | 老大密码 | |
| 母域名 | `bzcrl.dpdns.org` | 已在 Cloudflare 中管理 |
| 蓝巨人子域名 | `lanju.bzcrl.dpdns.org` | **暂定**，上线前确认 |
| GitHub Pages 地址 | `lanjuhr.github.io` | **暂定**，以实际仓库名为准 |
| GitHub 仓库名 | 待定 | 需先在 GitHub 创建 |

### 检查域名状态

```bash
# 检查母域名的 NS 服务器（确认在 Cloudflare 托管）
dig bzcrl.dpdns.org NS +short
# 预期输出：
# fred.ns.cloudflare.com.
# magali.ns.cloudflare.com.

# 检查母域名 A 记录（当前应该为空，因为我们还没配置）
dig bzcrl.dpdns.org A +short
```

---

## 2. Cloudflare 登录方式

### 2.1 网页登录

1. 打开浏览器，访问 https://dash.cloudflare.com
2. 输入老大邮箱和密码登录
3. 登录后进入 Dashboard

### 2.2 Dashboard 概览

登录后可以看到账号下托管的域名列表，找到 `bzcrl.dpdns.org` 点击进入管理页面。

### 2.3 推荐：安装 Cloudflare WARP（可选）

WARP 可以提升某些国际服务的访问速度，但不是 DNS 配置必需的。

---

## 3. 检查现有 DNS 记录

### 3.1 网页查看

1. 进入 `bzcrl.dpdns.org` 域名管理页面
2. 左侧菜单点击 **DNS** → **Records**
3. 查看当前所有 DNS 记录列表

### 3.2 当前状态

截至目前（2026-07-02），`bzcrl.dpdns.org` 仅有 Cloudflare 默认的 NS 记录：
- `fred.ns.cloudflare.com`
- `magali.ns.cloudflare.com`

没有其他 A、CNAME 或任何记录。

### 3.3 命令行检查

```bash
# 检查所有常见记录类型
dig bzcrl.dpdns.org A +short          # IPv4 记录
dig bzcrl.dpdns.org AAAA +short       # IPv6 记录
dig bzcrl.dpdns.org CNAME +short      # CNAME 别名
dig bzcrl.dpdns.org MX +short         # 邮件记录
dig bzcrl.dpdns.org TXT +short        # TXT 记录

# 检查子域名（看有没有旧的记录残留）
dig lanju.bzcrl.dpdns.org CNAME +short
dig www.bzcrl.dpdns.org CNAME +short
```

---

## 4. 添加 CNAME 记录

### 4.1 操作步骤

> ⚠️ **重要顺序**：先配置 GitHub Pages 侧（见第5节），再回来配置 DNS，否则可能被他人劫持域名。

1. 在 Cloudflare Dashboard 中进入 `bzcrl.dpdns.org`
2. 左侧菜单点击 **DNS** → **Records**
3. 点击 **Add record** 按钮
4. 填写以下信息：

| 字段 | 值 | 说明 |
|------|-----|------|
| **Type** | `CNAME` | 别名记录 |
| **Name** | `lanju` | 不要填完整域名，只填子域名前缀 |
| **Target** | `lanjuhr.github.io` | 替换为实际 GitHub Pages 地址 |
| **Proxy status** | ⚪ 灰色（DNS only） | **建议关闭代理**（见下方说明） |
| **TTL** | `Auto` | 自动 |

### 4.2 代理（Proxy）开关说明

Cloudflare 的 DNS 记录有橙色云朵（Proxied）和灰色云朵（DNS only）两种模式：

| 模式 | 图标 | 说明 | GitHub Pages 建议 |
|------|------|------|------------------|
| **Proxied** | ☁️ 橙色 | 流量经过 Cloudflare CDN，隐藏源 IP | ❌ 不建议 |
| **DNS only** | ⚪ 灰色 | 直接解析到目标地址 | ✅ **推荐** |

**为什么 GitHub Pages 建议用 DNS only？**

- GitHub Pages 原生支持 HTTPS（Let's Encrypt 自动签发）
- GitHub Pages 本身有 CDN 和 DDoS 保护
- 如果开启 Cloudflare Proxy（橙色云朵），Cloudflare 会用自己的 IP 回源到 GitHub Pages，而 GitHub 看到的 IP 不是真实访客 IP，可能触发某些限制
- **如果要加速国内访问**：可以开启 Proxy 并配置 Cloudflare 的中国网络（需要付费套餐）
- **建议先用 DNS only 跑通**，后续有需要再改

### 4.3 最终 DNS 记录示例

添加完成后，DNS 记录列表应如下：

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| CNAME | `lanju` | `lanjuhr.github.io` | ⚪ DNS only | Auto |

### 4.4 验证 DNS 传播

```bash
# 添加后检查是否生效（可能需要几分钟到几小时）
dig lanju.bzcrl.dpdns.org CNAME +short
# 预期输出：
# lanjuhr.github.io.

# 检查解析到的 IP 地址
dig lanju.bzcrl.dpdns.org +short
# 应该返回 GitHub Pages 的 IP 地址：
# 185.199.108.153
# 185.199.109.153
# 185.199.110.153
# 185.199.111.153
```

---

## 5. GitHub 仓库设置

### 5.1 在 GitHub Pages 中配置自定义域名

这一步必须在 DNS 配置**之前**完成，安全原因：

1. 在 GitHub 上打开蓝巨官网的仓库
2. 进入 **Settings** → **Pages**
3. 在 **Custom domain** 输入框中填入：`lanju.bzcrl.dpdns.org`
4. 点击 **Save**
5. GitHub 会自动尝试验证域名所有权（会检查 DNS 中的 CNAME 记录）

### 5.2 创建 CNAME 文件（推荐）

在仓库根目录创建一个 `CNAME` 文件（无扩展名），内容为：

```
lanju.bzcrl.dpdns.org
```

将这个文件提交到仓库中，GitHub Pages 会自动读取并配置自定义域名。

### 5.3 启用 HTTPS

1. 在 **Settings** → **Pages** 页面
2. 勾选 **Enforce HTTPS**
3. 等待 GitHub 自动签发 Let's Encrypt 证书（通常需要几分钟）

### 5.4 验证 GitHub 配置

```bash
# 确认 GitHub Pages 已绑定自定义域名
curl -sI https://lanju.bzcrl.dpdns.org | grep -i "server\|x-github"
```

---

## 6. SSL/TLS 配置（重要！）

### 6.1 建议方案

由于 GitHub Pages 原生支持 HTTPS（Let's Encrypt 自动签发证书），SSL/TLS 配置方案如下：

#### 方案一：DNS Only（推荐初始方案）

如果 Cloudflare DNS 设置为 DNS only（灰色云朵）：

- 浏览器 → Cloudflare（DNS 解析）→ GitHub Pages（HTTPS）
- GitHub Pages 直接提供 Let's Encrypt 证书
- **Cloudflare SSL/TLS 设置不影响此模式**
- 此模式最简单，建议先用此方案跑通

#### 方案二：Proxied（橙色云朵，需要加速国内访问时用）

如果后续开启 Cloudflare Proxy：

- **Cloudflare SSL/TLS 模式**：设置为 **Full（严格）**
- 因为 Cloudflare 到 GitHub Pages 之间走 HTTPS
- GitHub Pages 的 Let's Encrypt 证书对 Cloudflare 有效
- 设置步骤见下方 6.2

### 6.2 SSL/TLS 设置步骤（用于 Proxied 模式）

如果决定开启 Proxy 模式，按以下步骤配置 SSL/TLS：

1. 进入 `bzcrl.dpdns.org` 域名管理页面
2. 左侧菜单点击 **SSL/TLS**
3. 在 **Overview** 页面找到 **SSL/TLS encryption mode**
4. 选择 **Full（strict）** 模式

**各模式对比**：

| 模式 | 浏览器→Cloudflare | Cloudflare→GitHub Pages | 适合 |
|------|------------------|----------------------|------|
| Off | HTTP | HTTP | ❌ 不安全 |
| Flexible | HTTPS | HTTP | ❌ 不建议 |
| Full | HTTPS | HTTPS（不验证证书） | 可接受 |
| **Full（strict）** | HTTPS | HTTPS（验证证书） | ✅ **推荐** |

### 6.3 额外安全设置（推荐）

在 **SSL/TLS** → **Edge Certificates** 页面：

| 设置 | 推荐值 | 说明 |
|------|--------|------|
| Always Use HTTPS | ✅ 开启 | HTTP 自动跳转 HTTPS |
| Automatic HTTPS Rewrites | ✅ 开启 | 自动修复页面中的 HTTP 链接 |
| HTTP Strict Transport Security (HSTS) | 可选开启 | 高级安全，建议 HTTPS 稳定后再开 |

---

## 7. 验证配置

### 7.1 DNS 验证

```bash
# 检查 CNAME 记录
dig lanju.bzcrl.dpdns.org CNAME +short

# 检查最终解析 IP（确认指向 GitHub Pages）
dig lanju.bzcrl.dpdns.org +short

# 使用 dig 跟踪解析链路
dig lanju.bzcrl.dpdns.org +trace
```

### 7.2 HTTPS 验证

```bash
# 检查 HTTPS 证书
curl -vI https://lanju.bzcrl.dpdns.org 2>&1 | grep -E "SSL|HTTP|server"

# 检查响应头（确认有 GitHub Pages 标志）
curl -sI https://lanju.bzcrl.dpdns.org

# 浏览器访问验证
# 打开浏览器，访问 https://lanju.bzcrl.dpdns.org
# 确认：
# 1. 页面正常加载
# 2. 地址栏有小锁图标（HTTPS 有效）
```

### 7.3 全球 DNS 传播检查

使用在线工具检查全球 DNS 传播情况：
- https://dnschecker.org/
- 输入 `lanju.bzcrl.dpdns.org`，选择 CNAME 类型

### 7.4 配置确认清单

- [ ] CNAME 记录已添加：`lanju.bzcrl.dpdns.org → lanjuhr.github.io`
- [ ] DNS 记录 Proxy 状态已确认（推荐 DNS only）
- [ ] GitHub 仓库 Settings → Pages 中已填入自定义域名
- [ ] GitHub 仓库根目录有 `CNAME` 文件
- [ ] GitHub Pages 已勾选 Enforce HTTPS
- [ ] （如果开启 Proxy）Cloudflare SSL/TLS 已设为 Full（strict）
- [ ] （如果开启 Proxy）Always Use HTTPS 已开启
- [ ] 浏览器访问正常，HTTPS 有小锁图标

---

## 8. 常见问题

### 8.1 DNS 更改后多久生效？

- **Cloudflare DNS**：通常 1-5 分钟内生效
- **全球传播**：最长可能需要 24-48 小时
- **验证方法**：使用 `dig` 命令或在线 DNS 检查工具

### 8.2 域名解析到 GitHub Pages 后 404

可能原因：
1. GitHub 仓库中尚未创建 `CNAME` 文件
2. GitHub Pages 尚未启用（Settings → Pages 未配置）
3. 仓库中没有 `index.html` 文件
4. DNS 缓存尚未刷新

**解决**：确认上述四点，等待几分钟后重试

### 8.3 SSL 证书问题

- **情况**：访问时显示"您的连接不是私密连接"
- **原因**：Let's Encrypt 证书尚未签发完成
- **解决**：等待几分钟后刷新；确认 GitHub Pages 的 Enforce HTTPS 已勾选

### 8.4 想换个子域名（如从 `lanju` 改为 `lanjuhr`）

1. 删除旧的 CNAME 记录：删除 `lanju` 的 CNAME
2. 添加新记录：`lanjuhr` → `lanjuhr.github.io`
3. 更新 GitHub 仓库 Settings → Pages → Custom domain
4. 更新仓库中的 `CNAME` 文件

### 8.5 想切换到 Cloudflare Pages 而不是 GitHub Pages

如果后续决定直接用 Cloudflare Pages 托管：

1. 在 Cloudflare Dashboard 进入 **Workers & Pages**
2. 创建 Pages 项目（连接 GitHub 仓库自动部署）
3. 在 Pages 项目设置中添加自定义域名 `lanju.bzcrl.dpdns.org`
4. Cloudflare 会自动创建/更新 DNS 记录
5. 无需手动配置 SSL（Cloudflare Pages 原生支持 HTTPS）

---

## 9. 后续钜诚/志晨网站的子域名规划

### 子域名方案（建议）

| 公司 | 建议子域名 | 说明 |
|------|-----------|------|
| 海南蓝巨人力资源服务有限公司 | `lanju.bzcrl.dpdns.org` | ✅ 当前配置 |
| 文昌市钜诚职业技能培训学校有限公司 | `jucheng.bzcrl.dpdns.org` | 待建 |
| 海南志晨职业培训学校有限公司 | `zhichen.bzcrl.dpdns.org` | 待建 |

### 后续配置流程

每个新站只需重复本指南的第4-7步：
1. 在 Cloudflare 添加新的 CNAME 记录
2. 在对应 GitHub 仓库配置自定义域名
3. 配置 SSL/TLS（与当前相同）

---

## 📝 操作日志

| 日期 | 操作 | 操作人 |
|------|------|--------|
| 2026-07-02 | 创建本文档 | 虾扯蛋 |
| 待定 | 实际添加 DNS CNAME 记录 | |
| 待定 | 配置 GitHub Pages 自定义域名 | |
| 待定 | 验证 HTTPS 生效 | |

---

*文档维护：虾扯蛋 🦐 | 最后更新：2026-07-02*
