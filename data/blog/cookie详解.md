---
title: cookie与cors详解
date: 2022-02-16 23:57:18
tags:
---


# Cookie基础

由于HTTP协议是无状态的，而服务器端的业务必须是要有状态的。Cookie诞生的最初目的是为了存储web中的状态信息，以方便服务器端使用。比如判断用户是否是第一次访问网站。目前最新的规范是RFC 6265，它是一个由浏览器服务器共同协作实现的规范。
服务器端像客户端发送Cookie是通过HTTP响应报文实现的，在Set-Cookie中设置需要像客户端发送的cookie，cookie格式如下：
```
Set-Cookie: "name=value;domain=.domain.com;path=/;expires=Sat, 11 Jun 2016 11:29:42 GMT;HttpOnly;secure"
```

其中<kbd>name=value</kbd>是必选项，其它都是可选项。Cookie的主要构成如下：
- <kbd>name</kbd>:一个唯一确定的cookie名称。通常来讲cookie的名称是不区分大小写的。
- <kbd>value</kbd>:存储在cookie中的字符串值。最好为cookie的name和value进行url编码
- <kbd>domain</kbd>:cookie对于哪个域是有效的。所有向该域发送的请求中都会包含这个cookie信息。这个值可以包含子域(如：
yq.aliyun.com)，也可以不包含它(如：.aliyun.com，则对于aliyun.com的所有子域都有效).
- <kbd>path</kbd>: 表示这个cookie影响到的路径，浏览器跟会根据这项配置，像指定域中匹配的路径发送cookie。
- <kbd>expires</kbd>:失效时间，表示cookie何时应该被删除的时间戳(也就是，何时应该停止向服务器发送这个cookie)。如果不设置这个时间戳，浏览器会在页面关闭时即将删除所有cookie；不过也可以自己设置删除时间。这个值是GMT时间格式，如果客户端和服务器端时间不一致，使用expires就会存在偏差。
- <kbd>max-age</kbd>: 与expires作用相同，用来告诉浏览器此cookie多久过期（单位是秒），而不是一个固定的时间点。正常情况下，max-age的优先级高于expires。
- <kbd>HttpOnly</kbd>: 告知浏览器不允许通过脚本document.cookie去更改这个值，同样这个值在document.cookie中也不可见。但在http请求张仍然会携带这个cookie。注意这个值虽然在脚本中不可获取，但仍然在浏览器安装目录中以文件形式存在。这项设置通常在服务器端设置。
- <kbd>secure</kbd>: 安全标志，指定后，只有在使用SSL链接时候才能发送到服务器，如果是http链接则不会传递该信息。就算设置了secure 属性也并不代表他人不能看到你机器本地保存的 cookie 信息，所以不要把重要信息放cookie就对了服务器端设置

## 服务器端解析cookie
cookie可以设置不同的域与路径，所以对于同一个name value，在不同域不同路径下是可以重复的，浏览器会按照与当前请求url或页面地址最佳匹配的顺序来排定先后顺序
## 客户端的存取
浏览器将后台传递过来的cookie进行管理，并且允许开发者在JavaScript中使用document.cookie来存取cookie。但是这个接口使用起来非常蹩脚。它会因为使用它的方式不同而表现出不同的行为。
设置document.cookie并不会覆盖cookie，除非设置的name value domain path都与一个已存在cookie重复。
由于cookie的读写非常不方便，我们可以自己封装一些函数来处理cookie，主要是针对cookie的添加、修改、删除。
## 服务端发送 cookie
通过设置 HTTP 的 Set-Cookie 消息头，Web 服务器可以指定存储一个 cookie。Set-Cookie 消息的格式如下面所示，括号中的部分都是可选的：
```
Set-Cookie:value [ ;expires=date][ ;domain=domain][ ;path=path][ ;secure]
```
消息头的第一部分，value 部分，通常是一个 name=value 格式的字符串。服务端向客户端发送的 HTTP 响应中设置 HTTP 的 Set-Cookie 消息头，一个具体的例子如下：
```
Connection:keep-alive 
Content-Type:text/plain Date:Fri, 14 Jul 2017 10:49:23 GMT 
Set-Cookie:user=ZhangSan Transfer-Encoding:chunked
```

在这个例子中，服务端向客户端发送的 Http 消息头中，设置了 <kbd>'Set-Cookie:user=ZhangSan'</kbd>，客户端浏览器将接受到字符串 <kbd>'user=ZhangSan'</kbd> 作为 cookie。
## 客户端发送 cookie
当一个 cookie 存在，并且条件允许的话，该 cookie 会在接下来的每个请求中被发送至服务器。cookie 的值被存储在名为 Cookie 的 HTTP 消息头中，并且只包含了 cookie 的值，其它的选项全部被去除。
客户端向服务端发送的 HTTP 请求中设置 Cookie 消息头，一个具体的例子如下：
```
Connection:keep-alive
Cookie:user=ZhangSan 
Host:localhost:8080
User-Agent:Mozilla/5.0 AppleWebKit/537.36 Chrome Safari
```
在这个例子中，客户端向服务端发送的 Http 消息头中，设置了 <kbd>'Cookie:user=ZhangSan'</kbd>，服务端接受到字符串 <kbd>'user=ZhangSan'</kbd> 作为 cookie，从而确认此次请求对应的用户。
### 什么是HttpOnly?

如果cookie中设置了HttpOnly属性，那么通过js脚本将无法读取到cookie信息，这样能有效的防止XSS攻击，窃取cookie内容，这样就增加了cookie的安全性，即便是这样，也不要将重要信息存入cookie。XSS全称Cross SiteScript，跨站脚本攻击，是Web程序中常见的漏洞，XSS属于被动式且用于客户端的攻击方式，所以容易被忽略其危害性。其原理是攻击者向有XSS漏洞的网站中输入(传入)恶意的HTML代码，当其它用户浏览该网站时，这段HTML代码会自动执行，从而达到攻击的目的。如，盗取用户Cookie、破坏页面结构、重定向到其它网站等。
利用HttpResponse的addHeader方法，设置Set-Cookie的值，
cookie字符串的格式：<kbd>key=value; Expires=date; Path=path; Domain=domain; Secure; HttpOnly</kbd>


```
//设置cookie
response.addHeader("Set-Cookie", "uid=112; Path=/; HttpOnly");
//设置多个cookie
response.addHeader("Set-Cookie", "uid=112; Path=/; HttpOnly");
response.addHeader("Set-Cookie", "timeout=30; Path=/test; HttpOnly");
//设置https的cookie
response.addHeader("Set-Cookie", "uid=112; Path=/; Secure; HttpOnly");
```

在实际使用中，我们可以使FireCookie查看我们设置的Cookie 是否是HttpOnly。

# CORS 基础

在 Web 页面中可以随意地载入跨域的图片、视频、样式等资源， 但 AJAX 请求通常会被浏览器应用同源安全策略，禁止获取跨域数据，以及限制发送跨域请求。
在 2014 年 W3C 发布了 CORS Recommendation 来允许更方便的跨域资源共享。 默认情况下浏览器对跨域请求不会携带 Cookie，但鉴于 Cookie 在身份验证等方面的重要性， CORS 推荐使用额外的响应头字段来允许跨域发送 Cookie。

## withCredentials

在open XMLHttpRequest后，设置withCredentials为true即可让该跨域请求携带 Cookie。 注意携带的是目标页面所在域的 Cookie。

## Access-Control-Allow-Credentials

只设置客户端当然是没用的，还需要目标服务器接受你跨域发送的 Cookie。 否则会被浏览器的同源策略挡住。服务器同时设置Access-Control-Allow-Credentials响应头为"true"， 即可允许跨域请求携带 Cookie。
## Access-Control-Allow-Origin
除了Access-Control-Allow-Credentials之外，跨域发送 Cookie 还要求 Access-Control-Allow-Origin不允许使用通配符。 事实上不仅不允许通配符，而且只能指定单一域名：

```
If the credentials flag is true and the response includes zero or more than one Access-Control-Allow-Credentials header values return fail and terminate this algorithm. –W3C Cross-Origin Resource Sharing
```
否则，浏览器还是会挡住跨域请求：

## 计算 Access-Control-Allow-Origin
既然Access-Control-Allow-Origin只允许单一域名， 服务器可能需要维护一个接受 Cookie 的 Origin 列表， 验证 Origin 请求头字段后直接将其设置为Access-Control-Allow-Origin的值。 （这一实践来自 Stackoverflow） 值得注意的是在 CORS 请求被重定向后 Origin 头字段会被置为 null。 此时可以选择从Referer头字段计算得到Origin。
在正确配置的情况下，在 Chrome Network 就可以看到 Cookie 请求头被跨域发送了 （注意 Host 和Referer不同域，但仍然带了Cookie）：
```
Accept:*/*
Accept-Encoding:gzip, deflate, sdch, br
Accept-Language:zh-CN,zh;q=0.8,en;q=0.6,nl;q=0.4,zh-TW;q=0.2,fr;q=0.2,de;q=0.2,ja;q=0.2
Connection:keep-alive
Cookie:auhtor:harttle; _gat=1; _ga=GA1.1.221305049.1482947002
Host:dest.com:4001
Origin:http://index.com:4001
Referer:http://index.com:4001/
User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36
```

### 服务器端设定
```javascript

const express = require('express');
var app = express();
app.get('/specific-allow-origin-with-credentials', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': 'http://index.com:4001',
        'Access-Control-Allow-Credentials': true
    });
    res.status(200).end('I got your cookie: ' + req.headers.cookie);
});
app.listen(4001, () => console.log('listening to 4001'));
```

## Preflight
我们知道借助Access-Control-Allow-Origin响应头字段可以允许跨域 AJAX， 对于非简单请求，CORS 机制跨域会首先进行 preflight（一个 OPTIONS 请求）， 该请求成功后才会发送真正的请求。 这一设计旨在确保服务器对 CORS 标准知情，以保护不支持 CORS 的旧服务器。

我们知道借助Access-Control-Allow-Origin响应头字段可以允许跨域 AJAX， 对于非简单请求，CORS 机制跨域会首先进行 preflight（一个 OPTIONS 请求）， 该请求成功后才会发送真正的请求。 这一设计旨在确保服务器对 CORS 标准知情，以保护不支持 CORS 的旧服务器。
![https://404.ms/file/xurenlu/202202/40134700.svg](https://404.ms/file/xurenlu/202202/40134700.svg)


### 简单请求
简单请求具体是指请求方法是简单方法且请求头是简单头的 HTTP 请求。具体地，
- 简单方法包括GET, HEAD, POST。
- 简单头包括：Accept, Accept-Language, Content-Language，以及值为application/x-www-form-urlencoded, multipart/form-data, text/plain 其中之一的 Content-Type 头。
对于非简单请求浏览器会首先发送 OPTIONS 请求（成为 preflight）， 例如添加一个自定义头部x-foo的 HTTP 请求：
```
var xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.setRequestHeader('x-foo', 'bar');
xhr.send();
```

服务器需要成功响应（2xx）并在Access-Control-Alow-Headers中包含x-foo （因为它不是简单头部）：
```
OPTIONS /origin-redirect-with-preflight 200
Access-Control-Allow-Headers:x-foo
Access-Control-Allow-Origin:http://index.com:4001
Connection:keep-alive
Content-Length:0
```

## Access-Control-Request-Headers
Access-Control-Request-Headers 是 preflight 请求中用来标识真正请求将会包含哪些头部字段， preflight 请求本身不会发送这些头字段。 例如上述请求中Access-Control-Request-Headers字段的值应该是x-foo。 服务器应当在对应的Access-Control-Allow-Headers响应头中包含这些字段。 否则即使返回 200 preflight 也会失败：
```
XMLHttpRequest cannot load http://mid.com:4001/access-control-allow-origin-wildcard.
Request header field x-foo is not allowed by Access-Control-Allow-Headers in preflight response.
```

## DNT头
有些浏览器（如 Safari 隐身模式）会在请求中添加<kbd>DNT</kbd>头， 但浏览器不会（也不应）因此而发起 preflight。 因为这一请求头是浏览器添加的，也应当对此知情。 所以响应头中也不需要包含<kbd>Access-Control-Allow-Headers</kbd>。
## 关于preflight
服务端设定

## SameSite

### 什么是跨站攻击
用户登陆了银行网站your-bank.com，银行服务器发来了一个 Cookie:
<kbd>Set-Cookie:id=a3fWa;</kbd>
用户后来又访问了恶意网站malicious.com，上面有一个表单。
```
<form action="your-bank.com/transfer" method="POST">
  ...
</form>
```
用户一旦被诱骗发送这个表单，银行网站就会收到带有正确 Cookie 的请求。为了防止这种攻击，表单一般都带有一个随机 token，告诉服务器这是真实请求。
```
<form action="your-bank.com/transfer" method="POST">
  <input type="hidden" name="token" value="dad3weg34">
  ...
</form>
```
第三方网站引导发出的 Cookie，就称为第三方 Cookie。Cookie 的SameSite属性用来限制第三方 Cookie，从而减少安全风险。它可以设置三个值。
```
Strict
Lax
None
```
### Strict
Strict最为严格，完全禁止第三方 Cookie，跨站点时，任何情况下都不会发送 Cookie。换言之，只有当前网页的 URL 与请求目标一致，才会带上 Cookie。
```
Set-Cookie: CookieName=CookieValue; SameSite=Strict;
```
这个规则过于严格，可能造成非常不好的用户体验。比如，当前网页有一个 GitHub 链接，用户点击跳转就不会带有 GitHub 的 Cookie，跳转过去总是未登陆状态。
### Lax
Lax规则稍稍放宽，大多数情况也是不发送第三方 Cookie，但是导航到目标网址的 Get 请求除外。
```
Set-Cookie: CookieName=CookieValue; SameSite=Lax;
```

导航到目标网址的 GET 请求，只包括三种情况：链接，预加载请求，GET 表单。详见下表：

| 请求类型 | 	示例	                                | 正常情况 |	 Lax |
| --- |-------------------------------------| --- | --- | 
| 链接 | 	\<a href="...">\</a>	              | 发送 Cookie | 发送 Cookie |
| 预加载	| \<link rel="prerender" href="..."/> |	发送 Cookie | 发送 Cookie |
| GET 表单	| \<form method="GET" action="...">   |	发送 Cookie	| 发送 Cookie |
| POST 表单	| \<form method="POST" action="...">  |	发送 Cookie | 不发送 |
| iframe | 	\<iframe src="...">\</iframe>      | 发送 Cookie | 不发送 |
| AJAX	| $.get("...")                        | 发送 Cookie | 不发送 |
| Image | \<img src="...">	                   | 发送 Cookie | 不发送 |


设置了Strict或Lax以后，基本就杜绝了 CSRF 攻击。当然，前提是用户浏览器支持 SameSite 属性。

### None
Chrome 计划将Lax变为默认设置。这时，网站可以选择显式关闭SameSite属性，将其设为None。不过，前提是必须同时设置Secure属性（Cookie 只能通过 HTTPS 协议发送），否则无效。
下面的设置无效。
```
Set-Cookie: widget_session=abc123; SameSite=None
```

下面的设置有效。(只在https链接下）
```
Set-Cookie: widget_session=abc123; SameSite=None; Secure
```

参考资料

[https://harttle.land/2016/12/30/cors-redirect.html](https://harttle.land/2016/12/30/cors-redirect.html)
[https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html](https://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)
