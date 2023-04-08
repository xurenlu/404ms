---
  title: 在dokku的rails容器中自动启动crono
  date: 2023-04-01 06:15:24
  summary: 查看全文>>
  tags: []
---

crono 是 rails 的一个自动化定时扩展包，有时会莫名其妙的失败。为了能够自动拉起来，可以这么做:

1. 在 rails 项目根目录下创建一个 run.sh (里面的内容根据 dokku 容器内的变量实际改一下，尤其需要注意一下 SECRET_KEY_BASE）

```bash
#!/usr/bin/env sh
cd /app
export PATH=/app/bin:/app/vendor/bundle/bin:/app/vendor/bundle/ruby/3.1.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export STACK=heroku-20
export BUNDLE_BIN=vendor/bundle/bin
export BUNDLE_PATH=vendor/bundle
export GEM_PATH=/app/vendor/bundle/ruby/3.1.0:
export HOME=/app
export RAILS_ENV=production
export SECRET_KEY_BASE=d3492b176408a3cb65303bf38512491852cf9f462fc42bba33b7fffdea45c14204012202212eefdde0cf75cf8da1559f6fad3492b176408a3cb65303bf38512491852cf9f462fc42bba33b7fffdea45c14204012202212eefdde0cf75cf8da1559f6fa
bundle install
bundle exec crono start
```

2. cron -e,添加了个定时任务，redirect.web.1 是你 docker 容器的名字，根据自己的需要修改:

```text
* * * * * docker exec -u herokuishuser redirect.web.1  /app/run.sh
```

---

欢迎前往原文讨论：[https://github.com/xurenlu/404ms/issues/10](https://github.com/xurenlu/404ms/issues/10)
