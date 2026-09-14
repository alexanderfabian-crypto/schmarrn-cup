import teams from '../../content/teams.json'
import { PITCH } from './constants.js'
import { FORMATION, KICKOFF, KICKOFF_WAIT } from './formation.js'
import { createBall, moveBall } from './ball.js'
import { readInputs } from './input.js'
import { movePlayer, pickControlled } from './players.js'

// Mannschaft 0 (gelb) spielt von links nach rechts, Mannschaft 1 (blau) umgekehrt.
export function createState() {
  const players = teams.teams.flatMap((team, t) =>
    team.players.map((p, i) => ({
      team: t,
      number: p.number,
      name: p.nickname,
      x: 0,
      y: 0,
      dirX: t === 0 ? 1 : -1,
      dirY: 0,
      moving: false,
    })),
  )
  const state = {
    time: 0,
    players,
    ball: createBall(),
    score: [0, 0],
    controlled: [-1, -1], // Index des gesteuerten Spielers je Mannschaft
    inputs: [],
  }
  resetKickoff(state, 0)
  return state
}

// Stellt alle Spieler auf Grundposition, die anstoßende Mannschaft an den Ball.
export function resetKickoff(state, kickoffTeam) {
  const kick = [0, 0]
  state.players.forEach((p, idx) => {
    const i = idx % 11
    let [fx, fy] = FORMATION[i]
    if (i >= 9) {
      const spots = p.team === kickoffTeam ? KICKOFF : KICKOFF_WAIT
      ;[fx, fy] = spots[kick[p.team]++]
    }
    if (p.team === 1) fx = 1 - fx
    p.x = PITCH.x + fx * PITCH.w
    p.y = PITCH.y + fy * PITCH.h
    p.dirX = p.team === 0 ? 1 : -1
    p.dirY = 0
    p.moving = false
  })
  Object.assign(state.ball, createBall())
}

export function step(state, dt) {
  state.time += dt
  state.inputs = readInputs()

  // Etappe 1: nur Mannschaft 0 ist steuerbar.
  pickControlled(state, 0)
  const input = state.inputs[0]
  const me = state.players[state.controlled[0]]
  movePlayer(me, input.dx, input.dy, input.sprint, dt)

  moveBall(state.ball, dt)
}
