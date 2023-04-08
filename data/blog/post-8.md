---
  title: 语雀文档导出脚本
  date: 2023-03-09 06:34:10
  summary: 查看全文>>
  tags: []
---

---

title: 2023-03-09
date: 2023-03-09 14:26

---

语雀导出脚本

因为语雀的收费政策老变，所以我打算迁走。迁移的原因如下:

> 2020 年迁进语雀，当时首年只要 299；后来续费的时候忽然就把团队功能给升级成空间了，价格是 2999 了，涨就涨吧，也就走个报销。再后来要续的时候发现这个空间又有免费版了，免费版能满足需求了。再过了几个月，又偷偷摸摸把什么\*\*\*的个人团队赛进来挤占名额了，所以我又得续费了，这次得按团队有多少人收费，199 一个人。
> 以前我是走个财务报销流程，现在我得走一个预算审批。

导出前，需要先去语雀[申请一个 API token](https://www.yuque.com/settings/tokens) 没有付费的不能调用空间相关的 API,所以理论上得先付个分手费才行。
申请时，需要把所有只读权限都选上:
![https://cdn.jsdelivr.net/gh/xurenlu/bed/resource/5c/5ce612efcf8c7efd38182737516c9f2a.png](https://cdn.jsdelivr.net/gh/xurenlu/bed/resource/5c/5ce612efcf8c7efd38182737516c9f2a.png)

脚本如下,是用 ruby 写的，需要先安装 faraday 这个扩展：

```bash
gem install faraday
```

脚本内容在这里。

```ruby
require 'net/http'
require 'faraday'
require 'json'
base = "https://{这里改成你的空间前缀}.yuque.com/api/v2"

TOKEN="{这里改成你刚申请的TOKEN}"

def fetch(url)
    options = {
        headers: {
            'Content-Type' => 'application/json',
            'Accept'=>'application/json',
            'X-Auth-Token'=>TOKEN,
            'User-Agent'=>'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'}
      }
    conn = Faraday.new options do |f|
        #f.response :follow_redirects
        f.options.timeout = 5
        f.adapter Faraday.default_adapter
        #f.request :logger # logs request and responses
    end
    fetched = conn.get(url)
    puts fetched.status
    if fetched.status!=200
        puts "fetch #{url} failed #{fetched}"
        nil
    else
        to_json fetched.body
    end
end

def to_json(data)
    JSON.load(data)
end



userInfo = fetch "#{base}/user"
login =  userInfo["data"]["login"]
#login = to_json

groups = fetch "#{base}/users/#{login}/groups"
puts "空间的login和名称对应关系:"
group_logins = []
groups["data"].each do |item|
    puts "#{item['login']}=>#{item['name']}"
    group_logins << item["login"]
end


Dir.mkdir("./markdown/") unless File.exists?("./markdown/")
Dir.mkdir("./json/") unless File.exists?("./json")

group_logins.each do |group_login|
    group_repos = fetch "#{base}/groups/#{group_login}/repos"
    group_repos["data"].each do |repo|
        repo["name"].gsub! "/","%2F"
        Dir.mkdir("./markdown/#{repo['name']}") unless File.exists? "./markdown/#{repo['name']}"
        Dir.mkdir("./json/#{repo['name']}") unless File.exists? "./json/#{repo['name']}"

        puts "new repo for #{login}, name:#{repo['name']},namespace:#{repo['namespace']},id:#{repo['id']}"
        repo_docs = fetch "#{base}/repos/#{repo['id']}/docs"
        repo_docs['data'].each do |doc|
            puts "\t title:#{doc['title']},slug:#{doc['slug']}"
            doc_resp = fetch "#{base}/repos/#{repo['namespace']}/docs/#{doc['slug']}"
            doc = doc_resp["data"]
            doc["title"].gsub! "/","%2F"
            File.open "./markdown/#{repo['name']}/#{doc['title']}.md","w" do |file|
                file.puts doc["body"]
            end
            File.open "./json/#{repo['name']}/#{doc["slug"]}.json","w" do |file|
                file.puts JSON.dump(doc)
            end
        end
    end
end

```

---

欢迎前往原文讨论：[https://github.com/xurenlu/404ms/issues/8](https://github.com/xurenlu/404ms/issues/8)
