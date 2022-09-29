---
title: 快速进入Finder所在路径
date: 2022-07-30 11:31:41
tags:
---

之前经常有这个需求，我当前在Finder中打开了某个文件夹，现在需要快速在iterm或terminal中进入这个路径。
最早有一个免费的软件叫go2shell可以实现，后来在最新的Mac OS系统中不可用了。
现在用Apple script 可以实现:
```applescript
tell application "Finder" to set myname to POSIX path of (target of window 1 as alias)tell application "iTerm"	activate	tell current session of current window		set itext to "cd '" & myname & "'"				write text itext	end tellend tell
```
