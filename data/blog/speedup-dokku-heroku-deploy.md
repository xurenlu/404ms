---
title: 国内网络下优化nodejs项目在dokku下的部署速度
date: 2023-02-23 11:06
tags: ["dokku","nodejs"]
---

dokku 是一个类似heroku的paas平台，但是是个单机版，更适合个人或是小团队用。部署web项目超级方便。但是国内这个网络环境大家懂的，这是我摸索出来的一些踩坑经验。

1. 使用 阿里云的源：创建.npmrc 文件，内容增加这么一行:

```
 registry=https://registry.npmmirror.com
```

2. 在部分项目中，因为涉及到从 s3 或者 github 上下载文件，不用梯子的话超级慢，可以在本地搭一个梯子客户端，然后在环境变量里设置。记住，dokku 是在 docker 里运行的打包，所以不要用 127.0.0.1 这个 ip，要确保 设置的 ip 在 docker容器里能连（listen 或是 bind 在 0.0.0.0 ）,假设本地梯子客户端是 以 socks5 协议运行在 1080 端口，内网 IP 是 172.17.33.99,则像下面这样设置代理
```
dokku config:set --global https_proxy= http://172.17.33.99:1080
```

3. 如果设置了代理 ，记得针对 npmmirror 域名关掉代理 
```
dokku config:set --global NO_PROXY=registry.npmmirror.com
```
