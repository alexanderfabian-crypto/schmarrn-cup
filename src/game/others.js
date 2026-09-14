import { PLAYER } from './constants.js'
import { dist, movePlayer } from './players.js'
import { faceOpponentGoal, kick } from './control.js'
import { KICK } from './constants.js'

const CHASE_RADIUS = 140
const HOLD_TIME = 0.4

// Etappe 1: Ungesteuerte Spieler halten Grundposition, laufen nur zum Ball,
// wenn er nahe ist, und schlagen ihn Richtung gegnerisches Tor weg.
export function updateOthers(state, dt) {
  state.players.forEach((p, i) => {
    if (state.controlled[p.team] === i) return

    if (state.owner === i) {
      p.hold = (p.hold || 0) + dt
      if (p.hold >= HOLD_TIME) {
        faceOpponentGoal(p)
        kick(state, i, KICK.pass * 0.9, 0.25)
        p.hold = 0
      }
      return
    }
    p.hold = 0

    // Zum Ball nur, wenn er frei ist oder der Gegner ihn führt. Sonst würden
    // Mitspieler den eigenen Ballführer bedrängen und Pässe abfangen.
    const ownerTeam = state.owner >= 0 ? state.players[state.owner].team : -1
    const chase = ownerTeam !== p.team && dist(p, state.ball) < CHASE_RADIUS
    const target = chase ? state.ball : { x: p.homeX, y: p.homeY }
    const dx = target.x - p.x
    const dy = target.y - p.y
    const len = Math.hypot(dx, dy)
    // Geschwindigkeit so begrenzen, dass der Spieler nicht über das Ziel hinausläuft.
    if (len > 2) movePlayer(p, dx, dy, false, dt, Math.min(PLAYER.speed * 0.7, len / dt))
    else p.moving = false
  })
}
