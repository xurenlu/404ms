---
  title: ruby备份邮箱的脚本
  date: 2023-03-07 04:58:38
  summary: 查看全文>>
  tags: []
---

这几天公司迁移邮箱，我就趁午休的时候撸了一个将邮件存档下来的脚本。
使用的时候请先把用户名、密码，以及要存放的路径(base 变量)改一下。

```ruby
#!/usr/bin/ruby
# encoding: utf-8
require 'net/imap'
require "mail"
require 'net/http'
require 'digest/sha1'
require "date"
require "json"


base = "/Users/renlu/mails/"
imap = Net::IMAP.new('imap.exmail.qq.com')
imap.login "username@domain.com", "password"
boxes = []
for box in imap.list("","%") do
  boxes << Net::IMAP::decode_utf7(box.name)
end
for name in boxes do
  imap.select(Net::IMAP::encode_utf7(name))
  imap.search(["ALL"]).each do |message_id|
       body = imap.fetch(message_id, 'RFC822')[0].attr['RFC822']
       mail = Mail.new(body)
       envelope = imap.fetch(message_id, ["ENVELOPE","","FLAGS"])[0].attr["ENVELOPE"]

       File.open("#{base}/#{message_id}.body", 'wb') do |file|
          file.write(body)
       end
       File.open("#{base}/#{message_id}.index", 'wb') do |file|
          info = {
            date:envelope.date,
            subject:envelope.subject,
            from:envelope.from,
            sender:envelope.from,
            reply_to:envelope.reply_to,
            to:envelope.to,
            cc:envelope.cc,
            bcc:envelope.bcc,
            in_reply_to:envelope.in_reply_to,
            message_id:envelope.message_id
          }
          file.write(JSON.dump(info))
       end
       Dir.mkdir("#{base}/attach-#{message_id}/")
       if mail.attachments.length>0
               mail.attachments.each do |attachment|
                 if !File.exists?("#{base}/attach-#{message_id}/#{attachment.filename}")
                   File.open("#{base}/attach-#{message_id}/#{attachment.filename}", 'wb') do |file|
                     file.write(attachment.body.decoded)
                     puts "#{message_id} attachment: #{attachment.filename}"
                   end
                 end

               end
              imap.store(message_id    ,"+FLAGS",[:SEEN])
        end
        puts  "mail from :#{Mail::Encodings.value_decode(envelope.from[0].name)}"
     end
end



```

---

欢迎前往原文讨论：[https://github.com/xurenlu/404ms/issues/6](https://github.com/xurenlu/404ms/issues/6)
