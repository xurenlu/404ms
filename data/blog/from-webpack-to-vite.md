---
title: 从webpack迁移到vite
date: 2022-09-25 21:09:00
tags: []
---

上周计划将一个旧项目从webpack迁移到vite,遇到了一点点问题，特地记录下解决方法。
> vite是一个比webpack更快捷的打包工具，配置文件vite.config.js非常简单，可以手写。

## 问题一 默认是vue3的支持

vite对vue的支持，默认是支持vue3,如果要切换到vue2,则需要安装插件:<kbd>vite-plugin-vue2</kbd>:

```bash
yarn add vite-plugin-vue2
yarn add vue-template-compiler
```

## 问题二 不支持require 
vite默认不再支持require,则需要安装<kbd>vite-plugin-require-transform</kbd>
```bash
yarn add vite-plugin-require-transform

```
再在vite.config.js里配置:
```javascript
//vite.config.js
import { defineConfig } from 'vite'
//解决@问题
const path = require('path');
//解决require问题
import requireTransform from 'vite-plugin-require-transform';
 
export default defineConfig({
  plugins: [
  vue(),
  //.........此处省略
    requireTransform({
      fileRegex: /.js$|.vue$/
    }),
  ],
});

```

