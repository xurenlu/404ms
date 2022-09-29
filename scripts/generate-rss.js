/* eslint-disable */
const { promises: fs } = require('fs')
const path = require('path')
const RSS = require('rss')
const matter = require('gray-matter')

async function generate() {
  const feed = new RSS({
    title: '404.ms blog of alex.X',
    site_url: 'https://404.ms',
    feed_url: 'https://404.ms/feed.xml',
  })

  const posts = await fs.readdir(path.join(__dirname, '..', 'data', 'blog'))

  await Promise.all(
    posts.map(async name => {
      const content = await fs.readFile(path.join(__dirname, '..', 'data', 'blog', name))
      const frontmatter = matter(content)
        const doc = frontmatter.data
        const y = `${new Date(doc.date).getFullYear()}`;
        const m =  `${new Date(doc.date).getMonth() + 1}`;
        const d =  `${new Date(doc.date).getDate()}`;
      feed.item({
        title: frontmatter.data.title,
        url: 'https://404.ms/' + y +'/' + m + '/' + d + '/' + name.replace(/\.md?/, ''),
        date: frontmatter.data.date,
        description: frontmatter.data.summary,
      })
    }),
  )

  await fs.writeFile('./public/feed.xml', feed.xml({ indent: true }))
}

generate()
