import Link from 'next/link'
import ThemeChanger from 'components/themechanger'
import { useRouter } from 'next/router'
import Image from 'next/image'
import avatar from 'public/renlu_avatar.png'
import styles from './header.module.scss'

const links = [
  { name: 'Home', path: '/' ,target:""},
  { name: 'Posts', path: '/blog' ,target:""},
  { name: 'About', path: '/about' ,target:""},
]

const Header = (): JSX.Element => {
  const router = useRouter()
  const pathname = router.pathname.split('/[')[0] // active paths on dynamic subpages
  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link href="/">
            <a className={styles.logo}>
              <Image src={avatar} alt="alex " layout="fixed" width="45" height="45" priority placeholder="blur" />
            </a>
          </Link>
          <nav className={styles.nav}>
            <ol className={styles.links}>
              {links.map(({ name, path, target:string }) => {
                let target;
                if (target === '_blank') {
                  return (
                    <li key={path} className={pathname === path ? styles.linkActive : styles.link}>
                      <a href={path} target="_blank" rel="noopener noreferrer">
                        {name}
                      </a>
                    </li>
                  )
                }
                return (
                  <li key={path} className={pathname === path ? styles.linkActive : styles.link}>
                    <Link href={path}>
                      <a>{name}</a>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </nav>
          <ThemeChanger />
        </div>
      </header>
      <div className={styles.spacer} />
    </>
  )
}

export default Header
