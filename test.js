const allPosts = [
  {
    slug: 'hello',
    y: '2022',
    m: '02',
    d: '01',
  },
  {
    slug: 'hello',
    y: '2023',
    m: '02',
    d: '01',
  },
]
const paths = allPosts.map(p => ({ params: { slug: p.slug || '404', y: p.y || '2022', m: p.m || '1', d: p.d || '1' } }))
// eslint-disable-next-line no-console
console.log(paths)
