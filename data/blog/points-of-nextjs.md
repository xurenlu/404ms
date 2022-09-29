---
title: Nextjs使用一瞥
date: 2022-09-13 23:52:17
tags: []
---

上个月偶尔听起有人说过nextjs不错，就小小地了解了一下。
在工作中一个小项目用了用，只用作前端，后端api还是java,感觉还可以，于是想从项目创意到完整的前后端都用nextjs来实现。
现在项目（unhtml.com）一共投入了有52个小时了，占用了不少下班后的时间，也小有感受，特地记录一下。

# next.js 小坑记录


- .env.local 在生产环境也会加载且生效了，所以不要把.env.local 提交到git。当然这纯属我个人问题，我啥都想放进.git来存档。
- npm run build时，内存一度飙升了1.5G ,把vps整挂了。这和hexo之类的工具所需要的内存差距挺大的，如果线上编译，需要一个内存稍稍大点的主机。
- setCookie时，set-cookie这个http header头,后面发送的会覆盖前面发送的，也就是仅仅最后一次生效。看了一下NextApiResponse.setHeader的声明，第二个参数是string||string[]。设置多个cookie时，应该用数组，且随时都要记得，只有最后一次调用会实际生效。
- 有一个链接被链接到了/api/logout,然后。。。页面加载的时候总是会调用一个`/_next/data/uYVCOfFIB7kbuJmy1YA4j/api/logout.json` 结果又自动登出了。
- post的数据较大时，请求直接挂起了，完全没有进入handler.看文档说这样设置可以：
```javascript
export const  config  = {
	api:{
		bodyParser:{
			sizeLimit:"5000kb"
		}
	}
}
```

但是是完全没有用的，应该是bodyParser这一块有bug了，但是我还没有细看源代码。我只是简单地设置了bodyParser为false:
```javascript
export const  config  = {
	api:{
		bodyParser:false
	}
}

```
并在api的handler中用Streamable 自己读取了request里的body。
