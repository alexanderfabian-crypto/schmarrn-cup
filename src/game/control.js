import { KICK, PITCH, AI } from './constants.js'
import { dist } from './players.js'

// Wer den Ball hat, trägt ihn ein Stück vor sich her. Ein Spieler übernimmt
// den Ball, sobald er nahe genug ist und nicht gerade selbst geschossen hat.
export function updatePossession(state, dt) {
  const { ball, players } = state
  if (state.kickCooldown > 0) state.kickCooldown -= dt

  if (state.protection > 0) state.protection -= dt
  if (state.launch > 0) {
    state.launch -= dt
    return
  }

  let owner = state.owner
  if (owner >= 0 && dist(players[owner], ball) > KICK.controlRadius * 1.6) owner = -1

  // Freier Ball: der nächste Spieler nimmt ihn. Geführter Ball: ein Gegner
  // nimmt ihn im Zweikampf, sobald der kurze Schutz nach Ballgewinn abgelaufen ist.
  const ownerTeam = owner >= 0 ? players[owner].team : -1
  if (owner < 0 || state.protection <= 0) {
    let best = -1
    let bestDist = KICK.controlRadius
    // Ein schneller Ball wird von Feldspielern nur mit Glück gestoppt,
    // Torhüter halten sicher.
    const speed = Math.hypot(ball.vx, ball.vy)
    const trapChance = Math.max(KICK.trapMinChance, 1 - (speed - KICK.trapSpeed) / KICK.shot)
    players.forEach((p, i) => {
      if (i === state.lastKicker && state.kickCooldown > 0) return
      if (owner >= 0 && (i === owner || p.team === ownerTeam)) return
      const keeper = i % 11 === 0
      // Zweikampf um einen geführten Ball: Versuch mit Erfolgsquote,
      // danach kurze Pause, damit der Ballführer eine Chance hat.
      if (owner >= 0 && !keeper) {
        if (p.tackleUntil > state.time) return
        if (dist(p, ball) > KICK.controlRadius) return
        if (Math.random() > KICK.tackleChance) {
          p.tackleUntil = state.time + KICK.tackleRetry
          return
        }
      }
      if (!keeper && speed > KICK.trapSpeed && Math.random() > trapChance) return
      // Torhüter greifen etwas weiter, sonst wäre kein Schuss zu halten.
      const reach = keeper ? KICK.keeperRadius : KICK.controlRadius
      // Kleines Rauschen, damit bei gleichem Abstand nicht immer derselbe gewinnt.
      const d = dist(p, ball) - reach + KICK.controlRadius + Math.random() * 12
      if (d < bestDist) (best = i), (bestDist = d)
    })
    if (best >= 0) {
      owner = best
      state.protection = AI.protection
    }
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
  state.launch = KICK.launch
}
