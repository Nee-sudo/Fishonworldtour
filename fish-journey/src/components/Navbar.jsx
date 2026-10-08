import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const menuItems = [
  { id: 'home', label: 'Home' },
  { id: 'journey', label: 'Journey' },
  { id: 'map', label: 'Map' },
  { id: 'spotted', label: 'Fish spotted?' },
  { id: 'goals', label: 'Goals' },
  { id: 'dream', label: 'Dream' },
  { id: 'about', label: 'About' }
]

function ThemeToggle({ isLightTheme, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${isLightTheme ? 'dark' : 'light'} theme`}
      aria-pressed={isLightTheme}
      title={`Switch to ${isLightTheme ? 'dark' : 'light'} theme`}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-soft-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent-orange"
    >
      {isLightTheme ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      )}
    </button>
  )
}

export default function Navbar({ activeSection }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLightTheme, setIsLightTheme] = useState(() => (
    document.documentElement.classList.contains('theme-light')
  ))

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('theme-light', isLightTheme)
    root.classList.toggle('dark', !isLightTheme)

    try {
      localStorage.setItem('fishJourneyTheme', isLightTheme ? 'light' : 'dark')
    } catch (error) {
      console.warn('Theme preference could not be saved.', error)
    }
  }, [isLightTheme])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 shadow-lg ${scrolled ? 'glass backdrop-blur-md shadow-xl/50' : 'glass shadow-md/50'}`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div 
          className="text-2xl font-bold flex items-center gap-2 text-soft-white"
          whileHover={{ scale: 1.05 }}
        >
          🐟 <span>The Fish's Journey</span>
        </motion.div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a 
                href={`#${item.id}`}
                className={`relative text-soft-white/80 hover:text-accent-orange font-medium transition-colors duration-300 pb-1 ${
                  activeSection === item.id ? 'text-accent-orange !opacity-100' : ''
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-orange to-cyan-blue rounded-full" />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle
            isLightTheme={isLightTheme}
            onToggle={() => setIsLightTheme(theme => !theme)}
          />

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-soft-white hover:text-accent-orange rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-orange"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scaleY: 0.95 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.95 }}
            className="md:hidden fixed inset-x-0 top-[72px] bottom-0 z-40 flex flex-col bg-glass/95 backdrop-blur-2xl pt-20"
          >
            {/* Backdrop overlay */}
            <div 
              className="absolute inset-0 -z-10"
              onClick={() => setIsOpen(false)}
            />
            <ul className="flex-1 flex flex-col items-center justify-center space-y-4 px-6 py-8 text-lg">
              {menuItems.map((item, index) => (
                <motion.li 
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a 
                    href={`#${item.id}`}
                    className={`block py-3 px-6 text-soft-white/90 hover:text-accent-orange hover:bg-white/10 font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 ${
                      activeSection === item.id ? 'text-accent-orange bg-gradient-to-r from-accent-orange/20 font-bold shadow-orange-500/25' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
