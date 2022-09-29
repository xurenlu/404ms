import Image from 'next/image'
import Page from 'components/page'
import Button from 'components/button'
import { NextSeo } from 'next-seo'
import me from 'public/2702.png'
import styles from './about.module.scss'

const About = (): JSX.Element => {
  const linkProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
  }
  const seoTitle = 'About Nickbing Lao'
  return (
    <Page>
      <NextSeo
        title={seoTitle}
        openGraph={{
          title: seoTitle,
          url: `https://404.ms/about/`,
          site_name: '404.ms',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <Image src={me} alt="Picture of me (Nickbing Lao)" placeholder="blur" className={styles.image} priority />
      <div className={styles.text}>
        <p>Hey I’m alex , a fullstack developer currently living in 🇨🇳 Shanghai, China.</p>

        <p>
            网页相关的开发工程师，后端熟悉java、php、golang、c、python、ruby，前端熟悉typescript编程，vue/react熟练工。
            曾就职于CCTV、Yahoo!、Alibaba等企业，曾在Saas领域自主创业两次。
            创业赔掉了百多万，负债中。
            目前就职于上海某金融企业，往返杭州、上海两地。
        </p>
        <p>
          对我感兴趣 (可查看{' '}

          ).
        </p>
        <p>
          <ul>
            <li>
              <a href="https://github.com/xurenlu" {...linkProps}>
                Github
              </a>
            </li>
            <li>
              <a href="https://twitter.com/162cm/" {...linkProps}>
                Twitter
              </a>
            </li>
          </ul>
        </p>
      </div>
      <Button href="mailto:next.blog@404.ms">联系我</Button>
    </Page>
  )
}

export default About
