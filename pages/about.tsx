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
  const seoTitle = 'About renlu.xu '
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
      <Image src={me} alt="Picture of me " placeholder="blur" className={styles.image} priority />
      <div className={styles.text}>
        <p>Hey I’m alex , a fullstack developer currently living in 🇨🇳 Shanghai, China.</p>

        <p>
        I have been programming as a job since 2005, worked for Yahoo and Alibaba for a couple of years，and quit the dream full-time job to start a company and build my own products.<br/>
            I program in several languages like ruby, php, python, java, golang, typescript, and am a skilled designer with vue/react.<br/>
            I joined a financial institutions at Shanghai at 2020, and enjoy my family time at weekend at Hangzhou.

        </p>
        <p>
          more information
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
            <li>
              <a href="https://unhtml.github.io/" {...linkProps}>
                a few slides I wrote
              </a>
            </li>
          </ul>
        </p>
      </div>
      <Button href="mailto:next.blog@404.ms">mail me</Button>
    </Page>
  )
}

export default About
