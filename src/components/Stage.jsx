import { useEffect, useState } from 'react'
import { STAGE } from '../game/constants.js'

// Feste Bühne 1920×1080, zentriert und per transform auf das Fenster skaliert.
export default function Stage({ children }) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () =>
      setScale(Math.min(window.innerWidth / STAGE.w, window.innerHeight / STAGE.h))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="viewport">
      <div
        className="stage"
        style={{
          width: STAGE.w,
          height: STAGE.h,
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  )
}
