import { MATCH } from './constants.js'

// Spielphasen:
//   ready     vor dem Anpfiff, wartet auf Start
//   play      Ball läuft
//   goal      Jubel nach einem Tor, alles steht
//   halftime  Pause zwischen den Halbzeiten
//   fulltime  Abpfiff, Endstand steht
export function createMatch() {
  return { phase: 'ready', half: 1, clock: 0, timer: 0 }
}

export function startMatch(state) {
  state.score = [0, 0]
  state.match = createMatch()
  state.match.phase = 'play'
  state.attack = [1, -1]
  state.resetKickoff(state, 0)
  state.events.push({ type: 'kickoff' })
}

// Zählt Uhr und Phasentimer hoch und schaltet Phasen um.
// Liefert true, wenn sich Spieler und Ball bewegen dürfen.
export function updateMatch(state, dt) {
  const m = state.match
  switch (m.phase) {
    case 'ready':
    case 'fulltime':
      if (state.inputs.some((i) => i.startPressed)) startMatch(state)
      return false

    case 'play':
      tickClock(state, dt)
      return m.phase === 'play'

    case 'goal':
      if (MATCH.clockRunsDuringCelebration) tickClock(state, dt)
      m.timer -= dt
      if (m.timer <= 0 && m.phase === 'goal') {
        m.phase = 'play'
        state.resetKickoff(state, m.kickoffTeam)
        state.events.push({ type: 'kickoff' })
      }
      return false

    case 'halftime':
      m.timer -= dt
      if (m.timer <= 0) {
        m.phase = 'play'
        m.half = 2
        m.clock = 0
        state.attack = [-1, 1]
        state.resetKickoff(state, 1)
        state.events.push({ type: 'kickoff' })
      }
      return false

    default:
      return false
  }
}

function tickClock(state, dt) {
  const m = state.match
  m.clock = Math.min(m.clock + dt, MATCH.halfLength)
  if (m.clock < MATCH.halfLength) return
  if (m.half === 1) {
    m.phase = 'halftime'
    m.timer = MATCH.halftimeBreak
    state.events.push({ type: 'halftime' })
  } else {
    m.phase = 'fulltime'
    state.events.push({ type: 'fulltime' })
  }
}

export function goalScored(state, team) {
  const m = state.match
  state.score[team] += 1
  state.events.push({ type: 'goal', team })
  state.lastGoal = { team, time: state.time }
  m.phase = 'goal'
  m.timer = MATCH.celebration
  m.kickoffTeam = 1 - team
}

// Gesamtspielzeit in Sekunden, zweite Halbzeit zählt ab 3:00 weiter.
export function matchSeconds(m) {
  return (m.half - 1) * MATCH.halfLength + m.clock
}

export function formatClock(seconds) {
  const s = Math.floor(seconds)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
