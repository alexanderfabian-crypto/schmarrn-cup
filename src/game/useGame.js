import { useEffect, useRef, useState } from 'react'
import { createState, step } from './state.js'
import { STEP } from './constants.js'
import { playSound, unlockAudio, toggleMute, isMuted, audioState } from './sound.js'

// Spielt die Ereignisse eines Frames. Von vielen Ballkontakten in einem
// Frame bleibt nur der lauteste, sonst klingt es nach Rasseln.
function playEvents(events) {
  let loudestTouch = -1
  for (const e of events) {
    if (e.type === 'touch') loudestTouch = Math.max(loudestTouch, e.strength)
    else playSound(e.type)
  }
  if (loudestTouch >= 0) playSound('touch', loudestTouch)
  events.length = 0
}

// Führt die Simulation mit festem Zeitschritt in requestAnimationFrame aus.
// Der Spielzustand lebt außerhalb von React; React zeichnet ihn nur.
export function useGame() {
  const stateRef = useRef(null)
  if (stateRef.current === null) {
    stateRef.current = createState()
    window.__game = stateRef.current // zum Prüfen in der Browserkonsole
    window.__audio = audioState
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
      playEvents(stateRef.current.events)
      setFrame((f) => f + 1)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return stateRef.current
}

// M schaltet den Ton stumm. Der Audiokontext startet erst nach der ersten
// Eingabe, weil Browser das verlangen.
export function useMute() {
  const [muted, setMuted] = useState(isMuted())
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'KeyM') setMuted(toggleMute())
      else unlockAudio()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', unlockAudio)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', unlockAudio)
    }
  }, [])
  return muted
}
