import { PLAYER, PITCH } from './constants.js'

// Bewegt einen Spieler in Richtung (dx, dy) und merkt sich die Blickrichtung.
export function movePlayer(p, dx, dy, sprint, dt, maxSpeed) {
  if (dx === 0 && dy === 0) {
    p.moving = false
    return
  }
  const len = Math.hypot(dx, dy)
  const nx = dx / len
  const ny = dy / len
  let speed = sprint ? PLAYER.sprint : PLAYER.speed
  if (maxSpeed) speed = Math.min(speed, maxSpeed)
  p.x += nx * speed * dt
  p.y += ny * speed * dt
  p.dirX = nx
  p.dirY = ny
  p.moving = true

  // Spieler bleiben knapp innerhalb des Feldes.
  const m = 12
  p.x = Math.min(Math.max(p.x, PITCH.x - m), PITCH.x + PITCH.w + m)
  p.y = Math.min(Math.max(p.y, PITCH.y - m), PITCH.y + PITCH.h + m)
}

export function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

// Der gesteuerte Spieler ist der ballnächste der Mannschaft. Gewechselt wird
// nur, wenn ein anderer deutlich näher ist, damit die Auswahl nicht flackert.
export function pickControlled(state, team) {
  const current = state.controlled[team]
  let best = current
  let bestDist = current >= 0 ? dist(state.players[current], state.ball) - 60 : Infinity
  state.players.forEach((p, i) => {
    if (p.team !== team) return
    const d = dist(p, state.ball)
    if (d < bestDist) {
      best = i
      bestDist = d
    }
  })
  state.controlled[team] = best
}
