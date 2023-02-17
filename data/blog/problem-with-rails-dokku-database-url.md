---
title: rails在dokku下部署的一个mysql2的小坑
date: 2023-02-17 18:37
tags: ["mysql","rails","dokku"]
---

今天在部署 rails 到 dokku 上时，一直报错，说没有 mysql 这个模块，但是我检查了我的 Gemfile，也没有用到 MySQL 啊。
最后想起来，在开发环境中，config/database.yml 中我是指定了 username 和 password,但是在生产环境中我是 用了 DATABASE_URL 这个环境变量，这个环境变量问题就大了:
```yml
default: &default
  adapter: mysql2
  encoding: utf8mb4
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: root
  password:
  socket: /tmp/mysql.sock

development:
  <<: *default
  database: downcenter_development

production:
  <<: *default
  adapter: mysql2
  url: <%= ENV["DATABASE_URL"]  %>
```

这个变量是用 mysql://开头的，所以 rails 尝试加载 acitverecord 的 mysql 模块。但是，现在早就是在用 mysql2 模块了。于是对 production 段稍作修改就行了:

```yml
production:
  <<: *default
  adapter: mysql2
  url: <%= ENV["DATABASE_URL"].sub "mysql:/","mysql2:/"  %>
```