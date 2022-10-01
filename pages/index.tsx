import Button from 'components/button'
import PageHeader from 'components/pageheader'
import Project from 'components/project'
import Page from 'components/page'

import meowImg from 'public/projects/meow.png'
import unhtmlImg from 'public/projects/unhtml.png'
import klipmonster from 'public/projects/klipmonster.png'
import kuafuImg from 'public/projects/kuafu.png'


const projects = [
    {
        title: 'unhtml ',
        description: '截图美化、代码转图片、markdown转图片工具',
        link: 'unhtml.com',
        image: unhtmlImg
    },
    {
        title: 'meow',
        description: 'meow Markdown 编辑器',
        linkText: 'meow markdown writer',
        link: 'github.com/xurenlu/meow',
        image: meowImg,
    },
    {
        title: 'kuafu gateway',
        description: '一个代码仅1000行但功能相当强大的web gateway',
        linkText: 'kuafu gateway',
        link: 'github.com/gotapi/kuafu',
        image: kuafuImg,
    },
    {
        title: 'klipMonster',
        description: '粘贴板小工具集，如树形结构查看json',
        linkText: 'klipMonster.frontend-box',
        link: 'github.com/xurenlu',
        github: 'github.com/xurenlu',
        image: klipmonster,
    },

]

export async function getStaticProps() {
    // https://github.com/vercel/next.js/discussions/12124
    return {
        props: {
            allPostsData: [],
        },
    }
}

const Home = (): JSX.Element => (
    <Page>
        <PageHeader title="Hey strangers. I am alex." description={<>I wrote articles about Vue/React,Golang,Java and some others. <br/>And daily life sometimes.</>}>
<Button href="/about">for more</Button>
    </PageHeader>
    <h2>Open source projects</h2>
{projects.map(project => (
    <Project key={project.title} {...project} />
))}
</Page>
)

export default Home
