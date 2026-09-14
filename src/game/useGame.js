import { useEffect, useRef, useState } from 'react'
import { createState, step } from './state.js'
import { STEP } from './constants.js'

// Führt die Simulation mit festem Zeitschritt in requestAnimationFrame aus.
// Der Spielzustand lebt außerhalb von React; React zeichnet ihn nur.
export function useGame() {
  const stateRef = useRef(null)
  if (stateRef.current === null) {
    stateRef.current = createState()
    window.__game = stateRef.current // zum Prüfen in der Browserkonsole
  }
  const [, setFrame] = useState(0)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let acc = 0
    const tick = (now) => {
      acc += Math.min((now - last) / 1000, 0.1)
      last = now
      while (acc >= STEP) {
        step(stateRef.current, STEP)
        acc -= STEP
      }
      setFrame((f) => f + 1)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return stateRef.current
}
