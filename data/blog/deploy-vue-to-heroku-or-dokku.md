---
title: heroku上部署vue项目
date: 2023-02-14 15:05
tags: ['nodejs', 'express']
---

公司有一个前端项目，近期折腾了一下，改成从 heroku 的一个替代产品 dokku 部署了，记录一下过程。
不熟悉 dokku 的可以看[这里](https://dokku.com/),是一个 heroku 的个人级替代产品，用法基本差不多。

dokku 和 heroku 一样，只支持有后端的项目，所以对于 vue 项目，我们需要用 express 来提供服务。

方案如下，先安装 express 和@suntower/serve-static2

```bash
yarn add express @suntower/serve-static2
```

在 package.json 里添加一行 start 命令:

```json
"scripts": {
...
"start": "node root.js"
}
```

然后，root.js 的内容如下:

```javascript
const express = require('express')
const serveStatic = require('@suntower/serve-static2')
const path = require('path')
app = express()
app.use(serveStatic(path.join(__dirname, 'dist'), { tryFile: '/index.html' }))
const port = process.env.PORT || 5000
app.listen(port)
```

网上有一些教程让在 packge.json 里添加一个 postinstall 命令，其实是没有必要的，nodejs 类项目，在 package.json 里有 build 和 start 命令就行 了。verel 也是这样一个要求。

有一些项目的路由使用了 HTML5 模式，需要 nginx 的 try_files 支持，所以其他一些教程里的 serve-static 包，并不满足需求，我 fork 了这个包，命名为@suntower/serve-static2 发布在了 npm.org 上。主要实现的功能是，当文件找不到时，自动使用 /index.html （这样也永远不会 404 了）。如果不需要这个特性，将 tryFile 选项留空即可。
