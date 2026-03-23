import { useState } from 'react'

export default function DebugOverlay() {
  const [debugMode, setDebugMode] = useState(false)

  return (
    <>
      <button 
        className="debug-toggle"
        onClick={() => setDebugMode(!debugMode)}
        style={{ 
          zIndex: 99999,
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: debugMode ? 'green' : 'red',
          color: 'white',
          padding: '10px 15px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        {debugMode ? 'DEBUG OFF' : 'DEBUG ON'}
      </button>
      
      {debugMode && (
        <style>{`
          body * { 
            outline: 1px solid rgba(255, 0, 0, 0.3) !important; 
          }
          .debug-highlight {
            outline: 2px solid orange !important;
            background: rgba(255, 165, 0, 0.2) !important;
          }

          button, input, textarea, [class*="leaflet"], a { 
            outline: 3px solid orange !important;
            background: rgba(255, 165, 0, 0.4) !important;
          }
          .leaflet-container { 
            outline: 5px solid red !important;
            background: rgba(255, 0, 0, 0.3) !important;
          }
          [style*="overflow"], [class*="overflow"] {
            outline: 3px dashed blue !important;
            background: rgba(0, 0, 255, 0.2) !important;
          }
          nav { outline: 4px solid purple !important; }
        `}</style>
      )}
    </>
  )
}
