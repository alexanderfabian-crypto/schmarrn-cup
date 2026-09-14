import teams from '../../content/teams.json'
import { PITCH } from './constants.js'
import { FORMATION, KICKOFF, KICKOFF_WAIT } from './formation.js'
import { createBall, moveBall } from './ball.js'
import { readInputs } from './input.js'
import { movePlayer, pickControlled } from './players.js'
import { updatePossession, kick } from './control.js'
import { updateOthers } from './others.js'
import { KICK } from './constants.js'
import { checkGoal } from './goal.js'

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
      homeX: 0,
      homeY: 0,
      hold: 0,
    })),
  )
  const state = {
    time: 0,
    players,
    ball: createBall(),
    score: [0, 0],
    controlled: [-1, -1], // Index des gesteuerten Spielers je Mannschaft
    owner: -1, // Spieler, der den Ball führt
    lastKicker: -1,
    kickCooldown: 0,
    lastGoal: null,
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
    // Grundposition im Spiel ist die normale Formation, nicht der Anstoßplatz.
    let [hx, hy] = FORMATION[i]
    if (p.team === 1) hx = 1 - hx
    p.homeX = PITCH.x + hx * PITCH.w
    p.homeY = PITCH.y + hy * PITCH.h
    p.hold = 0
    p.dirX = p.team === 0 ? 1 : -1
    p.dirY = 0
    p.moving = false
  })
  Object.assign(state.ball, createBall())
  state.owner = -1
  state.lastKicker = -1
  state.kickCooldown = 0
  state.controlled = [-1, -1]
}

export function step(state, dt) {
  state.time += dt
  state.inputs = readInputs()

  // Etappe 1: nur Mannschaft 0 ist steuerbar.
  pickControlled(state, 0)
  const input = state.inputs[0]
  const meIndex = state.controlled[0]
  const me = state.players[meIndex]
  movePlayer(me, input.dx, input.dy, input.sprint, dt)

  updateOthers(state, dt)
  updatePossession(state, dt)

  if (state.owner === meIndex) {
    if (input.shootPressed) kick(state, meIndex, KICK.shot, KICK.shotSpread)
    else if (input.passPressed) kick(state, meIndex, KICK.pass)
  }

  moveBall(state.ball, dt)

  // Etappe 1: nach einem Tor sofort Wiederanstoß durch die Mannschaft, die
  // das Tor kassiert hat. Jubel und Uhr folgen in späteren Etappen.
  const scorer = checkGoal(state.ball)
  if (scorer >= 0) {
    state.score[scorer] += 1
    state.lastGoal = { team: scorer, time: state.time }
    resetKickoff(state, 1 - scorer)
  }
}
