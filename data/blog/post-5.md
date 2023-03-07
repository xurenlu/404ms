---
  title: 使用scrolling来查询/导出超过10000行纪录
  date: 2023-03-03 01:28:19
  summary: 查看全文>>
  tags: []
---

一直以来，想从 elasticsearch 中导出超过 10000 行纪录都是一个问题，因为深分页容易触发 OOM，所以 es 默认不允许导出 10000 条以上的纪录，如果你查询的时候指定的 from+size 超过 10000，会得到一条这样的报错:

```
Result window is too large, from + size must be less than or equal to:[10000] but was
```

这个可以通过设置索引 的 max_result_window 来修改，但是不推荐，且这个方法只对新的索引生效。
另一个办法是使用 scrolling：在查询的时候传入一个 scroll={time} ,time 参数 的格式像是 30m 这样,
在结果返回中会带有一个\_scroll_id 字段，记录下这个值，然后请求 /\_search/scroll 即可。

如下 ruby 代码演示了连接 elasticsearch 并按 from_id 查询导出的操作，新建对象并调用 start 方法即可。(示例中用到了 faraday 和 elasticsearch-dsl,需要 gem install elasticsearch-dsl faraday 一下)

```ruby

# frozen_string_literal: true

class EsData
    include Elasticsearch::DSL
    def initialize(name="some-user",password='some-password')
      @name = name
      @password = password
    end
    def connect
      @client = Faraday.new(url: 'http://some-elasticsearch:9200') do |conn|
        conn.request :authorization, :basic, @name,@password
      end
      self
    end
    def json_header
      { 'Accept' => 'application/json', 'Content-Type' => 'application/json' }
    end


    def start(from_id,index_name="some-index-name")
      t1 = Time.new.to_f
      es_query_body =JSON.dump( query_body_of_from_id from_id, 100)

      puts "query_body:#{es_query_body}"
      first = query_es((es_query_body), "15m", index_name)
      es_res = JSON.parse(first)
      scroll_id =  es_res["_scroll_id"]
      (puts "error:#{first} " and return ) if es_res.nil?

      es_res["hits"]["hits"].each do |item|
        puts "new item:"
        puts item
      end unless es_res["hits"].nil?

      0.upto 1000 do |i|
        es_res_body = scroll("15m",scroll_id)
        es_res_obj = JSON.parse(es_res_body)
        unless es_res_obj.has_key? "hits"
          puts "index_name #{index_name} has no hits"
          puts es_res_body
          return
        end
         if es_res_obj["hits"]["hits"].size==0
           puts "index #{index_name} cost  #{Time.new.to_f - t1} seconds"
           return
         end
        es_res_obj["hits"]["hits"].each do |item|
          save item
        end
      end
    end

    #  @author renlu
    # @param query_body 提交给es的查询体
    # @return [String,nil]
    def query_es(query_body,scroll_time,index_name)
      resp = @client.post(
        "/#{index_name}/_search?scroll=#{scroll_time}",
        query_body,
        json_header
      ).body
    end
    #@return [String,nil]
    def scroll(scroll_time,scroll_id)
      body =  JSON.dump({ "scroll":scroll_time, "scroll_id":scroll_id })
      @client.post("/_search/scroll", body,json_header).body
    end

    def query_body_of_from_id(from_id,query_size=100)
      definition = search do
        query do
          bool do
            must do
              match from_id:from_id
            end
          end
          size query_size
        end
      end
      definition.to_hash
    end


  end

```

---

欢迎前往原文讨论：[https://github.com/xurenlu/404ms/issues/5](https://github.com/xurenlu/404ms/issues/5)
