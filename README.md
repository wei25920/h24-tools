# H24 工具箱 🛠️

免费在线实用工具合集，纯前端实现，数据不上传服务器。

## 当前工具

| 工具 | 说明 |
|------|------|
| 📱 二维码生成器 | 文本/链接转二维码，下载 PNG |
| 🔑 密码生成器 | 高强度随机密码，可配置字符类型 |
| 📋 JSON 格式化 | 格式化/压缩/校验 JSON |
| 🔐 Base64 编解码 | 文本/文件与 Base64 互转 |
| 🔗 URL 编解码 | URL 百分号编码解码 |
| ⏰ 时间戳转换 | Unix 时间戳与日期互转 |
| 📝 字数统计 | 中英文字数实时统计 |
| 🎨 颜色转换器 | HEX/RGB/HSL 格式互转 |
| 🧪 正则测试器 | 正则表达式实时匹配测试 |
| 📊 文本对比工具 | 逐行差异对比高亮 |

## 部署到 GitHub Pages

```bash
# 1. 在 GitHub 创建仓库（如 h24-tools）
# 2. 在本地初始化并推送
cd D:\gw\mygw\h24-tools
git init
git add .
git commit -m "v1.0: H24 工具箱上线"
git remote add origin https://github.com/你的用户名/h24-tools.git
git push -u origin main

# 3. 去 GitHub 仓库 → Settings → Pages
#    Branch: main, 目录: / (root) → Save
# 4. 等待 1-2 分钟，访问:
#    https://你的用户名.github.io/h24-tools/
```

## 绑定自定义域名（可选）

1. 在 Pages 设置页填写你的域名
2. 在 DNS 添加 CNAME 记录指向 `你的用户名.github.io`
3. 在仓库根目录创建 `CNAME` 文件写入你的域名

## 盈利路线

| 阶段 | 动作 | 预期收益 |
|------|------|----------|
| ① 当前 | 免费工具上线，积累流量 | - |
| ② 流量达标 | 申请 Google AdSense，放置广告 | 广告收入 |
| ③ 有稳定流量 | 推出 AI 高级工具（付费 API） | 订阅收入 |
| ④ 品牌建立 | 数字产品商店（模板/素材/电子书） | 直售收入 |

**AdSense 申请条件**：网站需要有足够原创内容，通常建议 20+ 页面。

## 技术栈

- 纯 HTML + CSS + JavaScript
- 零外部依赖（除 QRCode.js 库）
- 无后端，无数据库
- GitHub Pages 免费托管

## 本地启动

直接用浏览器打开 `index.html` 即可，或用任意 HTTP 服务器：

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

## LICENSE

MIT
