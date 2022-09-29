import {ComputedFields, defineDocumentType, makeSource} from 'contentlayer/source-files' // eslint-disable-line
import readingTime from 'reading-time'
import rehypePrism from 'rehype-prism-plus'
import codeTitle from 'remark-code-titles'

const imgReg = new RegExp(/https:\/\/(.*)\.(png|jpeg|gif|svg|jpg)/)

const getCoverImg = doc => {
  const { raw } = doc.body

  const match = raw.match(imgReg)
  if (match) {
    return match[0]
  }
  return '/blog/default/image.png'
}

const getSlug = doc => {
  return doc._raw.sourceFileName.replace(/\.md$/, '')
}

const getY = doc => `${new Date(doc.date).getFullYear()}`
const getM = doc => new Date(doc.date).getMonth() + 1
const getD = doc => new Date(doc.date).getDate()
const computedFields: ComputedFields = {
  y: {
    type: 'string',
    resolve: doc => getY(doc),
  },
  m: {
    type: 'string',
    resolve: doc => {
      const m = getM(doc)
      if (m <10) {
        return '0' + m
      }else{
        return `${m}`
      }
    }
  },
  d: {
    type: 'string',
    resolve: doc => {
      const d = getD(doc)
      if (d < 10){
        return '0'+d
      }else{
        return `${d}`
      }
    },
  },
  summary: {
    type: 'string',
    resolve: doc =>  "请阅读全文..." //.substring(0,30)+"..."
  },
  slug: {
    type: 'string',
    resolve: doc => getSlug(doc),
  },
  image: {
    type: 'string',
    resolve: doc => getCoverImg(doc),
    // resolve: doc => `/blog/${getSlug(doc)}/image.png`,
  },
  og: {
    type: 'string',
    resolve: doc => `/blog/${getSlug(doc)}/og.png`,
  },
  readingTime: { type: 'json', resolve: doc => readingTime(doc.body.raw) },
}

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.md`,
  bodyType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    desc: { type: 'string', required: false },
    date: { type: 'string', required: true },
    updatedAt: { type: 'string', required: false },
    tags: { type: 'json', required: false },
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: 'data/blog',
  documentTypes: [Post],
  mdx: {
    rehypePlugins: [rehypePrism],
    remarkPlugins: [codeTitle],
  },
})
