import { DefaultSeo } from 'next-seo'

const config = {
  title: 'renlu.xu  - Full-Stack Developer ',
  description:
    '自驱型全栈工程师，18年大型复杂产品开发经验，10年研发团队管理经验，熟悉主流后端编程语言如Java/PHP/Ruby/Python/Golang，熟悉 React/Vue、DevOps 等，具备全栈开发能力。',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://404.ms/',
    site_name: '404.ms ',
    images: [
      {
        url: 'https://unhtml.oss-cn-hongkong.aliyuncs.com/renlu/relu_avatar.jpg?x-oss-process=style/small',
        alt: 'renlu.xu ',
      },
    ],
  },
  twitter: {
    handle: '@162cm',
    site: '@unhtml',
    cardType: 'summary_large_image',
  },
}

const SEO = (): JSX.Element => {
  return <DefaultSeo {...config} />
}

export default SEO
