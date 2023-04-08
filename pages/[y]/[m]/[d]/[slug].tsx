/* eslint-disable */
import { GetStaticPaths, GetStaticProps } from 'next'
import { useMDXComponent } from 'next-contentlayer/hooks' // eslint-disable-line
import Head from 'next/head'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

// Components
import Page from 'components/page'
import PageHeader from 'components/pageheader'
import CustomImage from 'components/image'
import Warning from 'components/warning'
import HitCounter from 'components/hitcounter'
import LikeButton from 'components/likebutton'
// import { NowPlayingIcon } from 'components/nowplaying'
// import Subscribe from 'components/subscribe'
import BlogImage from 'components/blogimage'
import SegmentedControl from 'components/segmentedcontrol'
import Messages, { TailBreakdown } from 'components/messages'
import AnimatedMessages from 'components/animatedmessages'
import Parallax from 'components/parallax'
import Tags from 'components/tags'
import PostList from 'components/postlist'
import Button from 'components/button'
import { RatingPlayground } from 'components/blog/rating'

// Utils
import { pick } from '@contentlayer/client'
import { allPosts } from '.contentlayer/data'
import type { Post as PostType } from '.contentlayer/types'

import styles from '../../../blog/post.module.scss'
import {useEffect} from "react";


const ParallaxCover = dynamic(() => import('components/blog/parallaxcover'))

const CustomLink = (props: { href: string }) => {
  const { href } = props

  /* eslint-disable */
  if (href?.startsWith('/')) {
    return (
      /* eslint-disable */
      <Link href={href} passHref>
        <a {...props} />
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
  /* eslint-enable */
}

const components = {
  Head,
  a: CustomLink,
  Image: CustomImage,
  Warning,
  Link: CustomLink,
  // NowPlayingIcon,
  SegmentedControl,
  Messages,
  AnimatedMessages,
  TailBreakdown,
  Parallax,
  Rating: RatingPlayground,
}

type PostProps = {
  post: PostType
  related: PostType[]
}

const Post = ({ post, related }: PostProps): JSX.Element => {
  const Component = useMDXComponent(post.body.code)

    const styleRed = "width: 18;\n" +
        "    height: var(--sizes-5);\n" +
        "    display: inline-block;\n" +
        "    line-height: 1em;\n" +
        "    -webkit-flex-shrink: 0;\n" +
        "    -ms-flex-negative: 0;\n" +
        "    flex-shrink: 0;\n" +
        "    color: rgb(237,106,93);\n" +
        "    vertical-align: middle;\n" +
        "}";
    const styleYellow = "width: 18;" +
        "    height: var(--sizes-5);" +
        "    display: inline-block;" +
        "    line-height: 1em;" +
        "    -webkit-flex-shrink: 0;" +
        "    -ms-flex-negative: 0;" +
        "    flex-shrink: 0;" +
        "    color: rgb(244,191,79);" +
        "    vertical-align: middle;";
    const styleGreen = "    width: 18;\n" +
        "    height: var(--sizes-5);\n" +
        "    display: inline-block;\n" +
        "    line-height: 1em;\n" +
        "    -webkit-flex-shrink: 0;\n" +
        "    -ms-flex-negative: 0;\n" +
        "    flex-shrink: 0;\n" +
        "    color: rgb(97,197,84);\n" +
        "    vertical-align: middle;"
    const createNewMacNode = function () {
        //let node = document.createElement("")
        let newNode = document.createElement("div");
        newNode.classList.add("mac-top-bar", "pl-4", "text-left", "pt-1");
        newNode.innerHTML = '<svg viewBox="0 0 200 200" focusable="false" class="chakra-icon " style="' + styleRed + '"><path fill="currentColor" d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"></path>'
            + '</svg><svg viewBox="0 0 200 200" focusable="false" class="chakra-icon " style="' + styleYellow + '"><path fill="currentColor" d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"></path></svg>'
            + '<svg viewBox="0 0 200 200" focusable="false" class="chakra-icon" style="' + styleGreen + '"><path fill="currentColor" d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"></path></svg>';
        return newNode;
    }
    const { setTheme, theme } = useTheme()
    const insertMacBar = function () {
        console.log(theme)
        //@ts-ignore

        setTimeout(()=>{
            try {
                if ( theme != "light") {
                    const nodes = document.getElementsByTagName("pre")
                    for(let item of nodes){
                        if (!item.classList.contains("language-mermaid")) {
                            if(item.classList.value&& (item.classList.value.indexOf("language-")>-1) ) {
                                item.parentNode.insertBefore(createNewMacNode(), item);
                            }
                        }
                    }

                }
            }catch(e){
                console.log(e)
            }
        },300)
    }

  const formattedPublishDate = new Date(post.date).toLocaleString('zh-CN', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
  const formattedUpdatedDate = post.updatedAt
    ? new Date(post.updatedAt).toLocaleString('zh-CN', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
    : null

  const seoTitle = `${post.title} | renlu.xu`
  const seoDesc = `${post.summary}`
  const url = `https://404.ms/${post.y}/${post.m}/${post.d}/${post.slug}`

  useEffect(() => {
    insertMacBar();
  }, [])
  return (
    <Page>
      <NextSeo
        title={seoTitle}
        description={seoDesc}
        canonical={url}
        openGraph={{
          title: seoTitle,
          url,
          description: seoDesc,
          images: [
            {
              url: post.og
                ? `https://404.ms${post.og}`
                : `https://og-image.giscafer.vercel.app/${encodeURIComponent(post.title)}?desc=${encodeURIComponent(
                    seoDesc,
                  )}&theme=dark.png`,
              alt: post.title,
            },
          ],
          site_name: 'renlu.xu ',
          type: 'article',
          article: {
            publishedTime: post.date,
            modifiedTime: post.updatedAt,
            authors: ['https://404.ms'],
          },
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />

      {post.slug === 'post-22' ? (
        <ParallaxCover />
      ) : (
        <>{post.image && <BlogImage src={post.image} alt={post.title} className={styles.image} />}</>
      )}
      <PageHeader title={post.title} compact>
        <p className={styles.meta}>
          发布于 <time dateTime={post.date}>{formattedPublishDate}</time>
          {post.updatedAt ? ` (Updated ${formattedUpdatedDate})` : ''} <span>&middot;</span> 预估阅读{' '}
          {Math.ceil(post.readingTime?.minutes * 1.5)} 分钟
          <HitCounter slug={post.slug} />
        </p>
      </PageHeader>
      <article className={styles.article}>
        <Component components={components} />
      </article>
      <div className={styles.buttons}>
        <LikeButton slug={post.slug} />
      </div>
      <Tags tags={post.tags} />
      {/* <Subscribe className={styles.subscribe} /> */}
      {related.length > 0 && (
        <>
          <h2 className={styles.relatedHeading}>相关文章</h2>
          <PostList posts={related} hideImage />
        </>
      )}
      <div className={styles.buttons}>
        <Button href="/blog">返回博客列表</Button>
      </div>
    </Page>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = allPosts.map(p => ({ params: { slug: p.slug || '404', y: '' + p.y || '2022', m: p.m + '' || '01', d: p.d + '' || '01' } }))
  return {
    paths: paths,
    //allPosts.map(p => ({ params: { slug: p.slug || '404', y: p.y || '2022', m: p.m || '1', d: p.d || '1' } })),
    //paths: allPosts.map(p => ({params: {slug: p.slug || '404', y: p.y || '2022', m: p.m || '01', d: p.d || '01'}})),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = allPosts.find(p => p.slug === params?.slug)
  const related = allPosts
    /* remove current post */
    .filter(p => p.slug !== params?.slug)
    /* Find other posts where tags are matching */
    .filter(p => p.tags?.some(tag => post.tags?.includes(tag)))
    /* return the first three */
    .filter((_, i) => i < 3)
    /* only return what's needed to render the list */
    .map(p => pick(p, ['slug', 'title', 'summary', 'date', 'image', 'readingTime']))

  return {
    props: {
      post,
      related,
    },
  }
}

export default Post
