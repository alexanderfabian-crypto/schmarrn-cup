// Alle Klänge werden mit der Web Audio API erzeugt, keine Dateien, keine Libraries.
// Der Kontext startet erst nach der ersten Eingabe, das verlangen Browser so.

let ctx = null
let master = null
let muted = false

function ensure() {
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  }
  const Ctor = window.AudioContext || window.webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  master = ctx.createGain()
  master.gain.value = muted ? 0 : 0.5
  master.connect(ctx.destination)
  return ctx
}

export function unlockAudio() {
  ensure()
}

export function isMuted() {
  return muted
}

// Zustand des Audiokontexts, zum Prüfen in der Browserkonsole.
export function audioState() {
  return { context: ctx ? ctx.state : 'none', muted }
}

export function toggleMute() {
  muted = !muted
  if (master) master.gain.setTargetAtTime(muted ? 0 : 0.5, ctx.currentTime, 0.01)
  return muted
}

// Kurzer Rauschpuffer, Grundlage für Pfiff und Torschrei.
let noiseBuffer = null
function noise() {
  if (!noiseBuffer) {
    const len = ctx.sampleRate * 2
    noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  }
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer
  src.loop = true
  return src
}

function env(node, t0, attack, hold, release, peak) {
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + attack)
  g.gain.setValueAtTime(peak, t0 + attack + hold)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + hold + release)
  node.connect(g)
  g.connect(master)
  return g
}

// Schiedsrichterpfiff: Sinuston bei 2,3 kHz mit Triller, dazu gefiltertes
// Rauschen für die Luft. Der Ton trägt, das Rauschen macht ihn echt.
function whistle(t0, duration, trill = true) {
  const tone = ctx.createOscillator()
  tone.type = 'sine'
  tone.frequency.setValueAtTime(2300, t0)
  if (trill) {
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 24
    lfoGain.gain.value = 130
    lfo.connect(lfoGain)
    lfoGain.connect(tone.frequency)
    lfo.start(t0)
    lfo.stop(t0 + duration + 0.1)
  }
  env(tone, t0, 0.012, duration, 0.05, 0.34)
  tone.start(t0)
  tone.stop(t0 + duration + 0.1)

  const src = noise()
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.setValueAtTime(2400, t0)
  band.Q.value = 6
  src.connect(band)
  env(band, t0, 0.012, duration, 0.05, 0.28)
  src.start(t0)
  src.stop(t0 + duration + 0.2)
}

// Ballkontakt: kurzer tiefer Impuls mit Klick.
function thud(t0, strength) {
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(220 + strength * 120, t0)
  osc.frequency.exponentialRampToValueAtTime(70, t0 + 0.09)
  env(osc, t0, 0.004, 0.005, 0.09, 0.22 + strength * 0.25)
  osc.start(t0)
  osc.stop(t0 + 0.2)

  const src = noise()
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 1400
  src.connect(hp)
  env(hp, t0, 0.002, 0.004, 0.05, 0.12 + strength * 0.12)
  src.start(t0)
  src.stop(t0 + 0.1)
}

// Torschrei: anschwellendes Rauschen mit steigender Filterfrequenz.
function roar(t0) {
  const src = noise()
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.Q.value = 1.2
  band.frequency.setValueAtTime(320, t0)
  band.frequency.linearRampToValueAtTime(900, t0 + 0.7)
  band.frequency.linearRampToValueAtTime(600, t0 + 2.4)
  src.connect(band)

  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.linearRampToValueAtTime(1.5, t0 + 0.5)
  g.gain.setValueAtTime(1.5, t0 + 1.4)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.8)
  band.connect(g)
  g.connect(master)
  src.start(t0)
  src.stop(t0 + 3)
}

// Spielt einen benannten Klang. Unbekannte Namen werden still ignoriert.
export function playSound(name, strength = 0.5) {
  if (!ensure() || muted) return
  const t = ctx.currentTime + 0.01
  switch (name) {
    case 'kickoff':
      whistle(t, 0.35)
      break
    case 'halftime':
      whistle(t, 0.3)
      whistle(t + 0.42, 0.45)
      break
    case 'fulltime':
      whistle(t, 0.28)
      whistle(t + 0.36, 0.28)
      whistle(t + 0.72, 0.6)
      break
    case 'touch':
      thud(t, Math.min(Math.max(strength, 0), 1))
      break
    case 'goal':
      whistle(t, 0.2, false)
      roar(t + 0.1)
      break
    default:
      break
  }
}
