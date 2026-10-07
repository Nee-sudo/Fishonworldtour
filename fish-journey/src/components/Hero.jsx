import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Hero({ id }) {
  const [shareMessage, setShareMessage] = useState('')

  const copyPageLink = async (url) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url)
      return
    }

    const input = document.createElement('textarea')
    input.value = url
    input.style.position = 'fixed'
    input.style.opacity = '0'
    document.body.appendChild(input)
    input.select()
    const copied = document.execCommand('copy')
    input.remove()

    if (!copied) {
      throw new Error('Clipboard copy was not available.')
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    const shareData = {
      title: "This little fish wants to see the world 🐟",
      text: "Please share this little fish's journey with your friends. It dreams of seeing the world and needs kind hearts cheering it on. 🌍🐟",
      url
    }

    setShareMessage('')
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        setShareMessage('Thank you for helping this little fish’s dream travel!')
        return
      } catch (error) {
        if (error.name === 'AbortError') return
      }
    }

    try {
      await copyPageLink(url)
      setShareMessage('Link copied! Please share this little fish’s dream with your friends. 🐟')
    } catch (error) {
      console.error('Could not share or copy the fish journey link.', error)
      setShareMessage(`Please copy and share this little fish’s journey: ${url}`)
    }
  }

  return (
    <section id={id} className="min-h-screen flex items-center justify-center text-center px-6 pt-20 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-4xl mx-auto"
      >
        <motion.img 
          src="/images/fish.png"
          alt="Cute fish with hat"
          className="w-64 md:w-80 mx-auto mb-8 animate-float drop-shadow-2xl"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 bg-gradient-to-r from-soft-white to-muted-gray bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          I Want to See
          <br />
          <span className="inline-block">
            <span className="bg-gradient-to-r from-accent-orange to-yellow-400 bg-clip-text text-transparent">the World</span>
            <span className="text-soft-white ml-1">🥺</span>
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-muted-gray mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Follow the journey of a little fish with big dreams—swimming against the tide, chasing stars, 
          and proving that no ocean is too vast.
        </motion.p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.a
            href="#timer"
            className="btn-orange inline-block text-lg md:text-xl shadow-2xl"
            whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(249, 115, 22, 0.5)" }}
            whileTap={{ scale: 0.98 }}
          >
            Start the Journey ↓
          </motion.a>
          <motion.button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-lg font-bold text-soft-white shadow-lg backdrop-blur transition-colors hover:border-cyan-blue hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-blue"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="m8.6 10.5 6.8-4m-6.8 9 6.8 4" />
            </svg>
            Share this fish
          </motion.button>
        </div>
        <p className="mt-5 min-h-6 text-sm text-cyan-100" role="status" aria-live="polite">
          {shareMessage}
        </p>
      </motion.div>
    </section>
  )
}
