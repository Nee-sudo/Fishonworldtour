import { useState, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Timer from './components/Timer'

const FancyFlagMap = lazy(() => import('./components/FancyFlagMap'))
const Leaderboard = lazy(() => import('./components/Leaderboard'))
const Encouragement = lazy(() => import('./components/Encouragement'))
const Goals = lazy(() => import('./components/Goals'))
const Dream = lazy(() => import('./components/Dream'))
const About = lazy(() => import('./components/About'))

function App() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'timer', 'map', 'leaderboard', 'encourage', 'goals', 'dream', 'about']
      for (let section of sections.reverse()) {
        const el = document.getElementById(section)
        if (el && el.getBoundingClientRect().top < 100) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-[100dvh] relative overflow-x-hidden touch-scroll">
      <Navbar activeSection={activeSection} />
      
      <main>
        <Hero id="home" />
        <Timer id="timer" />
        <section id="map" className="py-24">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-6"
          >
            <Suspense fallback={<div className="flex items-center justify-center h-64 p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div><p className="mt-4 text-lg text-gray-400">Loading world map...</p></div>}>
              <FancyFlagMap />
            </Suspense>
          </motion.div>
        </section>
        <Suspense fallback={<div className="py-20 flex flex-col items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mb-4"></div><p className="text-xl text-gray-500">Loading leaderboard...</p></div>}>
          <Leaderboard id="leaderboard" />
        </Suspense>
        <Suspense fallback={<div className="py-16 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-400 mx-auto mb-3"></div><p className="text-gray-500">Loading encouragement...</p></div>}>
          <Encouragement id="encourage" />
        </Suspense>
        <Suspense fallback={<div className="py-16 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400 mx-auto mb-3"></div><p className="text-gray-500">Loading goals...</p></div>}>
          <Goals id="goals" />
        </Suspense>
        <Suspense fallback={<div className="py-16 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto mb-3"></div><p className="text-gray-500">Loading dream...</p></div>}>
          <Dream id="dream" />
        </Suspense>
        <Suspense fallback={<div className="py-16 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400 mx-auto mb-3"></div><p className="text-gray-500">Loading about...</p></div>}>
          <About id="about" />
        </Suspense>
      </main>
    </div>
  )
}

export default App

