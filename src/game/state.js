import teams from '../../content/teams.json'
import { PITCH, KICK } from './constants.js'
import { FORMATION, KICKOFF, KICKOFF_WAIT } from './formation.js'
import { createBall, moveBall } from './ball.js'
import { readInputs } from './input.js'
import { movePlayer, pickControlled } from './players.js'
import { updatePossession, kick } from './control.js'
import { updateOthers } from './others.js'
import { checkGoal } from './goal.js'
import { createMatch, updateMatch, goalScored } from './match.js'

export function createState() {
  const players = teams.teams.flatMap((team, t) =>
    team.players.map((p) => ({
      team: t,
      number: p.number,
      name: p.nickname,
      x: 0,
      y: 0,
      dirX: 1,
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
    match: createMatch(),
    // Spielrichtung je Mannschaft entlang x: 1 nach rechts, -1 nach links.
    // Gelb beginnt von links nach rechts, nach der Halbzeit wird getauscht.
    attack: [1, -1],
    controlled: [-1, -1], // Index des gesteuerten Spielers je Mannschaft
    owner: -1, // Spieler, der den Ball führt
    lastKicker: -1,
    kickCooldown: 0,
    lastGoal: null,
    inputs: [],
    resetKickoff,
  }
  resetKickoff(state, 0)
  return state
}

// Rechnet einen Feldanteil vom eigenen Tor aus in eine Bühnenkoordinate um.
export function pitchX(fx, attackDir) {
  return PITCH.x + (attackDir === 1 ? fx : 1 - fx) * PITCH.w
}

export function pitchY(fy) {
  return PITCH.y + fy * PITCH.h
}

// Stellt alle Spieler auf Grundposition, die anstoßende Mannschaft an den Ball.
export function resetKickoff(state, kickoffTeam) {
  const kickIndex = [0, 0]
  state.players.forEach((p, idx) => {
    const i = idx % 11
    const dir = state.attack[p.team]
    let [fx, fy] = FORMATION[i]
    if (i >= 9) {
      const spots = p.team === kickoffTeam ? KICKOFF : KICKOFF_WAIT
      ;[fx, fy] = spots[kickIndex[p.team]++]
    }
    p.x = pitchX(fx, dir)
    p.y = pitchY(fy)
    // Grundposition im Spiel ist die normale Formation, nicht der Anstoßplatz.
    const [hx, hy] = FORMATION[i]
    p.homeX = pitchX(hx, dir)
    p.homeY = pitchY(hy)
    p.hold = 0
    p.dirX = dir
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

  if (!updateMatch(state, dt)) return

  // Jede Mannschaft hat einen gesteuerten Spieler, Pad 1 gelb, Pad 2 blau.
  for (const team of [0, 1]) {
    pickControlled(state, team)
    const input = state.inputs[team]
    const me = state.players[state.controlled[team]]
    movePlayer(me, input.dx, input.dy, input.sprint, dt)
  }

  updateOthers(state, dt)
  updatePossession(state, dt)

  for (const team of [0, 1]) {
    const input = state.inputs[team]
    const meIndex = state.controlled[team]
    if (state.owner !== meIndex) continue
    if (input.shootPressed) kick(state, meIndex, KICK.shot, KICK.shotSpread)
    else if (input.passPressed) kick(state, meIndex, KICK.pass)
  }

  moveBall(state.ball, dt)

  // Ball im rechten Tor zählt für die Mannschaft, die nach rechts spielt.
  const side = checkGoal(state.ball)
  if (side !== 0) goalScored(state, state.attack[0] === side ? 0 : 1)
}
