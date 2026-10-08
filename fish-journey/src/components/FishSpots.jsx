import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import API_BASE_URL from '../utils/api.js'
const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const MAX_SOURCE_BYTES = 12 * 1024 * 1024

function resizePhoto(file) {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = async () => {
      URL.revokeObjectURL(objectUrl)
      try {
        let scale = Math.min(1, 1440 / Math.max(image.naturalWidth, image.naturalHeight))
        let quality = 0.82
        let blob

        for (let attempt = 0; attempt < 6; attempt += 1) {
          const canvas = document.createElement('canvas')
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
          blob = await new Promise((resolveBlob, rejectBlob) => {
            canvas.toBlob(
              result => result ? resolveBlob(result) : rejectBlob(new Error('Could not resize this photo.')),
              'image/jpeg',
              quality
            )
          })

          if (blob.size <= MAX_IMAGE_BYTES) break
          if (quality > 0.58) quality -= 0.12
          else scale *= 0.8
        }

        if (!blob || blob.size > MAX_IMAGE_BYTES) {
          reject(new Error('This photo is too large to upload. Please choose a smaller image.'))
          return
        }

        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => reject(new Error('Could not read this photo. Please try another one.'))
        reader.readAsDataURL(blob)
      } catch (error) {
        reject(error)
      }
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Could not open this photo. Please choose a JPEG, PNG, or WebP image.'))
    }
    image.src = objectUrl
  })
}

function formatDate(timestamp) {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export default function FishSpots({ id }) {
  const [spots, setSpots] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [galleryError, setGalleryError] = useState('')
  const [formError, setFormError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photo, setPhoto] = useState('')
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadSpots() {
      setIsLoading(true)
      setGalleryError('')
      try {
        const response = await fetch(`${API_BASE_URL}/api/fish-spots`, { signal: controller.signal })
        if (!response.ok) throw new Error('The sightings gallery could not be loaded right now.')
        setSpots(await response.json())
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Fish sightings gallery error:', error)
          setGalleryError(error.message || 'The sightings gallery could not be loaded right now.')
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadSpots()
    return () => controller.abort()
  }, [refreshKey])

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('spot')) {
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150)
    }
  }, [id])

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0]
    setPhoto('')
    setFormError('')
    setSuccessMessage('')

    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFormError('Please choose a JPEG, PNG, or WebP photo.')
      event.target.value = ''
      return
    }
    if (file.size > MAX_SOURCE_BYTES) {
      setFormError('Please choose a photo smaller than 12 MB.')
      event.target.value = ''
      return
    }

    setIsProcessingPhoto(true)
    try {
      setPhoto(await resizePhoto(file))
    } catch (error) {
      setFormError(error.message)
      event.target.value = ''
    } finally {
      setIsProcessingPhoto(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    setFormError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    const formData = new FormData(form)
    const submission = {
      displayName: formData.get('displayName'),
      location: formData.get('location'),
      story: formData.get('story'),
      publicConsent: formData.get('publicConsent') === 'on',
      imageData: photo
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/fish-spots`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Your fish postcard could not be saved.')

      setSpots(current => [result, ...current].slice(0, 8))
      setPhoto('')
      form.reset()
      setSuccessMessage('Your fish postcard is on the map. Thanks for helping this little traveler! 🐟')
    } catch (error) {
      console.error('Fish sighting submission error:', error)
      setFormError(error.message || 'Your fish postcard could not be saved. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id={id} className="relative scroll-mt-24 px-6 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-96 max-w-5xl rounded-full bg-cyan-blue/10 blur-3xl" />
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 font-bold uppercase tracking-[0.25em] text-cyan-blue">A tiny fish, a very big world</p>
          <h2 className="mb-4 text-4xl font-black text-soft-white md:text-6xl">
            Have you <span className="bg-gradient-to-r from-accent-orange to-cyan-blue bg-clip-text text-transparent">spotted me?</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-gray md:text-xl">
            Found one of my little fish stickers out in the wild? Leave a postcard from your corner of the world
            and help my journey grow, one surprising sighting at a time.
          </p>
        </motion.div>

        <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="glass relative overflow-hidden rounded-[2rem] p-6 shadow-2xl md:p-8"
          >
            <div className="absolute -right-4 -top-5 rotate-12 text-7xl opacity-20" aria-hidden="true">🐟</div>
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-blue/15 text-2xl">📮</span>
                <div>
                  <h3 className="text-2xl font-black text-soft-white">Send a fish postcard</h3>
                  <p className="text-sm text-muted-gray">A photo, a place, a little story.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="fish-photo" className="mb-2 block text-sm font-bold text-soft-white">Your fish encounter photo <span className="text-accent-orange">*</span></label>
                  <input
                    ref={fileInputRef}
                    id="fish-photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="sr-only"
                    required={!photo}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingPhoto}
                    className="flex min-h-40 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/20 bg-white/5 text-center transition hover:border-cyan-blue/70 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-blue disabled:cursor-wait"
                  >
                    {photo ? (
                      <img src={photo} alt="Preview of your fish encounter" className="h-52 w-full object-cover" />
                    ) : (
                      <>
                        <span className="mb-2 text-3xl" aria-hidden="true">{isProcessingPhoto ? '⏳' : '📸'}</span>
                        <span className="font-bold text-soft-white">{isProcessingPhoto ? 'Making your photo postcard-ready…' : 'Tap to add your photo'}</span>
                        <span className="mt-1 text-xs text-muted-gray">JPEG, PNG or WebP · compressed before upload</span>
                      </>
                    )}
                  </button>
                  {photo && (
                    <button type="button" onClick={() => { setPhoto(''); if (fileInputRef.current) fileInputRef.current.value = '' }} className="mt-2 text-sm font-semibold text-cyan-blue hover:underline">
                      Choose a different photo
                    </button>
                  )}
                </div>

                <div>
                  <label htmlFor="fish-location" className="mb-2 block text-sm font-bold text-soft-white">Where did you find the fish? <span className="text-accent-orange">*</span></label>
                  <input
                    id="fish-location"
                    name="location"
                    type="text"
                    maxLength={100}
                    placeholder="A cafe in Kyoto, Japan"
                    required
                    className="w-full rounded-xl border border-white/15 bg-deep-navy/60 px-4 py-3 text-soft-white placeholder:text-muted-gray/70 focus:border-cyan-blue focus:outline-none focus:ring-2 focus:ring-cyan-blue/30"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="fish-name" className="mb-2 block text-sm font-bold text-soft-white">Your name <span className="font-normal text-muted-gray">(optional)</span></label>
                    <input
                      id="fish-name"
                      name="displayName"
                      type="text"
                      maxLength={40}
                      placeholder="A fish friend"
                      className="w-full rounded-xl border border-white/15 bg-deep-navy/60 px-4 py-3 text-soft-white placeholder:text-muted-gray/70 focus:border-cyan-blue focus:outline-none focus:ring-2 focus:ring-cyan-blue/30"
                    />
                  </div>
                  <div>
                    <label htmlFor="fish-story" className="mb-2 block text-sm font-bold text-soft-white">Tell the tale <span className="font-normal text-muted-gray">(optional)</span></label>
                    <input
                      id="fish-story"
                      name="story"
                      type="text"
                      maxLength={240}
                      placeholder="What was the fish up to?"
                      className="w-full rounded-xl border border-white/15 bg-deep-navy/60 px-4 py-3 text-soft-white placeholder:text-muted-gray/70 focus:border-cyan-blue focus:outline-none focus:ring-2 focus:ring-cyan-blue/30"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-gray">
                  <input type="checkbox" name="publicConsent" required className="mt-1 h-4 w-4 shrink-0 accent-cyan-500" />
                  <span>I took this photo or have permission to share it, and I’m happy for this postcard to appear in the public gallery.</span>
                </label>

                {formError && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{formError}</p>}
                {successMessage && <p role="status" className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{successMessage}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting || isProcessingPhoto || !photo}
                  className="btn-orange flex w-full items-center justify-center gap-2 !rounded-2xl !py-4 text-base disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Sending your postcard…' : 'Send this fish around the world ✨'}
                </button>
                <p className="text-center text-xs leading-relaxed text-muted-gray">
                  Your place, name and photo are public. Please avoid sharing private details or photos of anyone who hasn’t agreed.
                </p>
              </form>
            </div>
          </motion.div>

          <div>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-accent-orange">Fresh from the ocean</p>
                <h3 className="text-2xl font-black text-soft-white md:text-3xl">Recent sightings</h3>
              </div>
              {!isLoading && !galleryError && <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-muted-gray">{spots.length} postcards</span>}
            </div>

            {isLoading ? (
              <div className="glass flex min-h-72 items-center justify-center rounded-3xl p-8 text-muted-gray" role="status">Gathering postcards from around the world…</div>
            ) : galleryError ? (
              <div className="glass rounded-3xl p-8 text-center">
                <p role="alert" className="mb-4 text-muted-gray">{galleryError}</p>
                <button type="button" onClick={() => setRefreshKey(key => key + 1)} className="rounded-full border border-cyan-blue/50 px-5 py-2 font-bold text-cyan-blue hover:bg-cyan-blue/10">Try again</button>
              </div>
            ) : spots.length === 0 ? (
              <div className="glass flex min-h-72 flex-col items-center justify-center rounded-3xl p-8 text-center">
                <span className="mb-3 text-5xl" aria-hidden="true">🫧</span>
                <p className="text-xl font-bold text-soft-white">The ocean is waiting for its first postcard.</p>
                <p className="mt-2 max-w-sm text-muted-gray">Be the first to spot a fish sticker and start this little gallery!</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {spots.map((spot, index) => (
                  <motion.article
                    key={spot._id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: Math.min(index * 0.05, 0.25) }}
                    className="glass group overflow-hidden rounded-3xl border border-white/10 shadow-xl transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-blue/40"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                      <img
                        src={spot.imageData}
                        alt={`Fish sighting shared from ${spot.location}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-deep-navy/80 px-3 py-1 text-xs font-bold text-soft-white backdrop-blur">🐟 spotted!</span>
                    </div>
                    <div className="p-4">
                      <p className="truncate text-lg font-black text-soft-white">📍 {spot.location}</p>
                      {spot.story && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-gray">“{spot.story}”</p>}
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-muted-gray">
                        <span className="truncate">Postcard by {spot.displayName}</span>
                        <time className="shrink-0" dateTime={spot.timestamp}>{formatDate(spot.timestamp)}</time>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
