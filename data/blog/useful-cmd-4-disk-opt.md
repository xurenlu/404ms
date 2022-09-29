---
title: 程序员清理硬盘最有效的命令
date: 2022-08-04 13:48:38
tags: []
---

虽然我只是偶尔冒充一下前端工程师，这条命令依然是我清理电脑最有效的命令:

```bash
find . -atime +7  -name "node_modules" -maxdepth 3|xargs rm -rf
```

一条命令清理出来15个G.
