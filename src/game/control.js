import { KICK, PITCH } from './constants.js'
import { dist } from './players.js'

// Wer den Ball hat, trägt ihn ein Stück vor sich her. Ein Spieler übernimmt
// den Ball, sobald er nahe genug ist und nicht gerade selbst geschossen hat.
export function updatePossession(state, dt) {
  const { ball, players } = state
  if (state.kickCooldown > 0) state.kickCooldown -= dt

  let owner = state.owner
  if (owner >= 0 && dist(players[owner], ball) > KICK.controlRadius * 1.6) owner = -1

  if (owner < 0) {
    let best = -1
    let bestDist = KICK.controlRadius
    players.forEach((p, i) => {
      if (i === state.lastKicker && state.kickCooldown > 0) return
      const d = dist(p, ball)
      if (d < bestDist) (best = i), (bestDist = d)
    })
    owner = best
  }
  state.owner = owner

  if (owner >= 0) {
    const p = players[owner]
    ball.x = p.x + p.dirX * KICK.carry
    ball.y = p.y + p.dirY * KICK.carry
    ball.vx = ball.vy = 0
  }
}

// Schickt den Ball in Blickrichtung des Spielers los.
export function kick(state, playerIndex, speed, spread = 0) {
  const p = state.players[playerIndex]
  const angle = Math.atan2(p.dirY, p.dirX) + (Math.random() * 2 - 1) * spread
  state.ball.vx = Math.cos(angle) * speed
  state.ball.vy = Math.sin(angle) * speed
  state.owner = -1
  state.lastKicker = playerIndex
  state.kickCooldown = KICK.cooldown
}

// Richtung zum gegnerischen Tor, für Befreiungsschläge der ungesteuerten Spieler.
export function faceOpponentGoal(p) {
  const gx = p.team === 0 ? PITCH.x + PITCH.w : PITCH.x
  const gy = PITCH.y + PITCH.h / 2
  const len = Math.hypot(gx - p.x, gy - p.y) || 1
  p.dirX = (gx - p.x) / len
  p.dirY = (gy - p.y) / len
}
