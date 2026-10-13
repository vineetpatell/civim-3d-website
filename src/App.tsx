import { useEffect } from 'react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Story } from './components/Story'
import { Purity } from './components/Purity'
import { Process } from './components/Process'
import { Footer } from './components/Footer'
import { ScrollTrigger } from './lib/gsap'
import './components/nav-hero.css'
import './components/real-bottle.css'
import './components/sections.css'

export default function App() {
  // Recalculate trigger positions once webfonts have loaded (they shift layout).
  useEffect(() => {
    if ('fonts' in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
  }, [])

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Story />
        <Purity />
        <Process />
      </main>
      <Footer />
    </>
  )
}
