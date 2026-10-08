import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import 'maplibre-gl/dist/maplibre-gl.css'
import './FancyFlagMap.css'
import { motion, AnimatePresence } from 'framer-motion'
import { normalizeCountryName } from '../utils/countryCodes.js'
import { getCountryColor } from '../utils/countryColors.js'
import API_BASE_URL from '../utils/api.js'

const COUNTRIES_URL = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'
maplibregl.setWorkerUrl(maplibreWorkerUrl)
const DEFAULT_ORIGIN = {
  lat: 26.8467,
  lng: 80.9462,
  name: 'Lucknow 🐟',
  country: 'India',
  flagUrl: 'https://flagcdn.com/w320/in.png',
  color: '#FF6B6B'
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character])
}

function prepareLocations(data) {
  if (!Array.isArray(data)) return []

  return data.map(location => ({
    ...location,
    flagUrl: location.flagUrl || location.flag || `https://flagcdn.com/w80/${(location.actualCountry || 'un').toLowerCase()}.png`,
    name: location.actualCity || location.name || 'Location',
    country: location.actualCountry || location.country || 'Unknown',
    countryCode: normalizeCountryName(location.actualCountry || location.country),
    color: location.color || '#4A90E2'
  })).filter(location => Number.isFinite(Number(location.lat)) &&
    Number.isFinite(Number(location.lng)) &&
    location.lat !== '' && location.lng !== '')
    .map(location => ({ ...location, lat: Number(location.lat), lng: Number(location.lng) }))
}

export default function FancyFlagMap() {
  const mapContainerRef = useRef(null)
  const mapShellRef = useRef(null)
  const mapRef = useRef(null)
  const [journey, setJourney] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenFallback, setFullscreenFallback] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreen = document.fullscreenElement === mapShellRef.current
      setIsFullscreen(fullscreen || fullscreenFallback)
      if (fullscreen) setFullscreenFallback(false)
      requestAnimationFrame(() => mapRef.current?.resize())
    }
    const handleKeyDown = event => {
      if (event.key === 'Escape' && fullscreenFallback) {
        setFullscreenFallback(false)
        setIsFullscreen(false)
      }
    }
    const handleResize = () => mapRef.current?.resize()

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [fullscreenFallback])

  const toggleFullscreen = async () => {
    const shell = mapShellRef.current
    if (!shell) return

    if (document.fullscreenElement === shell) {
      try {
        await document.exitFullscreen()
      } catch (error) {
        console.error('Could not exit browser fullscreen.', error)
      }
      return
    }
    if (fullscreenFallback) {
      setFullscreenFallback(false)
      setIsFullscreen(false)
      return
    }

    if (!shell.requestFullscreen) {
      setFullscreenFallback(true)
      setIsFullscreen(true)
      return
    }

    try {
      await shell.requestFullscreen()
    } catch (error) {
      console.error('Could not enter browser fullscreen; using the in-page fullscreen view instead.', error)
      setFullscreenFallback(true)
      setIsFullscreen(true)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/locations`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const locations = prepareLocations(await response.json())
        const origin = locations.find(location => location.name.toLowerCase().includes('lucknow')) ||
          locations[0] ||
          DEFAULT_ORIGIN

        if (!cancelled) setJourney({ locations, origin })
      } catch (error) {
        console.error('Error fetching map data:', error)
        if (!cancelled) {
          setJourney({
            origin: DEFAULT_ORIGIN,
            locations: [
              { name: 'New York', country: 'USA', countryCode: 'us', lat: 40.7128, lng: -74.006, flagUrl: 'https://flagcdn.com/w320/us.png', color: '#4ECDC4' },
              { name: 'London', country: 'UK', countryCode: 'gb', lat: 51.5074, lng: -0.1278, flagUrl: 'https://flagcdn.com/w320/gb.png', color: '#45B7D1' },
              { name: 'Tokyo', country: 'Japan', countryCode: 'jp', lat: 35.6762, lng: 139.6503, flagUrl: 'https://flagcdn.com/w320/jp.png', color: '#F9CA24' }
            ]
          })
        }
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!journey || !mapContainerRef.current) return undefined

    const { locations, origin } = journey
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE_URL,
      center: [0, 20],
      zoom: 1.8,
      attributionControl: true
    })
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    const markers = []
    let disposed = false

    map.once('load', async () => {
      const countryFeatures = await fetch(COUNTRIES_URL)
        .then(response => {
          if (!response.ok) throw new Error(`Country boundary request failed: ${response.status}`)
          return response.json()
        })
        .then(data => data.features.map(feature => {
          const properties = feature.properties || {}
          const code = (properties.ISO_A2 || properties.ISO_A3?.slice(0, 2) || 'un').toLowerCase()
          return {
            ...feature,
            properties: {
              ...properties,
              mapCode: code,
              mapColor: getCountryColor(code),
              visited: locations.some(location => location.countryCode?.toLowerCase() === code)
            }
          }
        }))
        .catch(error => {
          console.error('Error loading country boundaries:', error)
          return null
        })

      if (disposed) return

      if (countryFeatures) {
        map.addSource('countries', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: countryFeatures }
        })
        map.addLayer({
          id: 'country-fill',
          type: 'fill',
          source: 'countries',
          paint: {
            'fill-color': ['get', 'mapColor'],
            'fill-opacity': ['case', ['get', 'visited'], 0.28, 0.12]
          }
        })
        map.addLayer({
          id: 'country-outline',
          type: 'line',
          source: 'countries',
          paint: {
            'line-color': 'rgba(255,255,255,0.45)',
            'line-width': 0.6
          }
        })
        map.on('click', 'country-fill', event => {
          const properties = event.features?.[0]?.properties
          if (!properties) return
          new maplibregl.Popup()
            .setLngLat(event.lngLat)
            .setHTML(`<strong>${escapeHTML(properties.NAME || properties.NAME_LONG || 'Country')}</strong><br>ISO: ${escapeHTML(properties.mapCode.toUpperCase())}`)
            .addTo(map)
        })
        map.on('mouseenter', 'country-fill', () => { map.getCanvas().style.cursor = 'pointer' })
        map.on('mouseleave', 'country-fill', () => { map.getCanvas().style.cursor = '' })
      }

      const mapLocations = locations.some(location => location === origin) ? locations : [origin, ...locations]
      const paths = mapLocations
        .filter(location => location !== origin)
        .map(location => ({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [[origin.lng, origin.lat], [location.lng, location.lat]]
          }
        }))

      map.addSource('journey-paths', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: paths }
      })
      map.addLayer({
        id: 'journey-paths',
        type: 'line',
        source: 'journey-paths',
        paint: {
          'line-color': '#4A90E2',
          'line-width': 1.5,
          'line-opacity': 0.65,
          'line-dasharray': [2, 2]
        }
      })

      mapLocations.forEach(location => {
        const element = document.createElement('div')
        element.className = 'journey-marker'
        element.style.setProperty('--marker-color', location.color)
        const image = document.createElement('img')
        image.src = location.flagUrl
        image.alt = `${location.country} flag`
        image.addEventListener('error', () => {
          image.src = '/images/fish.png'
        }, { once: true })
        element.appendChild(image)
        element.addEventListener('mouseenter', () => setHovered(location.name))
        element.addEventListener('mouseleave', () => setHovered(null))

        const popup = new maplibregl.Popup({ offset: 24 }).setHTML(
          `<div class="text-center"><strong>${escapeHTML(location.name)}</strong><br>${escapeHTML(location.country)} (${escapeHTML((location.countryCode || 'un').toUpperCase())})</div>`
        )
        const marker = new maplibregl.Marker({ element, anchor: 'center' })
          .setLngLat([location.lng, location.lat])
          .setPopup(popup)
          .addTo(map)
        markers.push(marker)
      })
    })

    return () => {
      disposed = true
      markers.forEach(marker => marker.remove())
      map.remove()
      mapRef.current = null
    }
  }, [journey])

  if (!journey) {
    return <div className="p-20 text-center text-xl font-semibold text-gray-400">Loading your journey map...</div>
  }

  return (
    <motion.div
      className="glass relative mx-auto w-full max-w-[1440px] rounded-none p-2 shadow-2xl sm:rounded-3xl sm:p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="mb-8 text-center">
        <h2 className="mb-4 bg-gradient-to-r from-soft-white to-cyan-blue bg-clip-text text-4xl font-black text-transparent md:text-5xl">
          🌍 Your Journey Around the World
        </h2>
        <p className="mx-auto max-w-2xl text-xl text-muted-gray">
          Follow the fish’s travels across countries and oceans.
        </p>
      </div>

      <div
        ref={mapShellRef}
        className={`journey-map-shell${fullscreenFallback ? ' journey-map-shell--fullscreen' : ''}`}
      >
        <div
          ref={mapContainerRef}
          className="journey-map h-[55svh] min-h-[320px] max-h-[580px] overflow-hidden rounded-2xl border border-white/20 shadow-inner sm:h-[60vh] sm:min-h-[380px] sm:rounded-3xl lg:max-h-[680px]"
          aria-label="Interactive map showing the fish's journey"
        />
        <button
          type="button"
          className="journey-map-fullscreen"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit fullscreen map' : 'View map fullscreen'}
          title={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
        >
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5m11-5v5h-5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5" />
            </svg>
          )}
          <span>{isFullscreen ? 'Exit' : 'Full view'}</span>
        </button>
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="journey-map-visited"
            >
              <span className="font-bold text-blue-600">Visiting:</span> {hovered}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
