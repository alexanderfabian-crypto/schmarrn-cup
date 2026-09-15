import { AI, KICK, PITCH, GOAL, PLAYER } from './constants.js'
import { dist, movePlayer } from './players.js'
import { kick } from './control.js'

const CENTER = { x: PITCH.x + PITCH.w / 2, y: PITCH.y + PITCH.h / 2 }
const PENALTY = { w: 267, h: 569 }

function goalOf(team, attack, own) {
  const dir = own ? -attack[team] : attack[team]
  return { x: dir === 1 ? PITCH.x + PITCH.w : PITCH.x, y: CENTER.y }
}

function face(p, x, y) {
  const len = Math.hypot(x - p.x, y - p.y) || 1
  p.dirX = (x - p.x) / len
  p.dirY = (y - p.y) / len
}

function moveTo(p, x, y, dt, maxSpeed) {
  const dx = x - p.x
  const dy = y - p.y
  const len = Math.hypot(dx, dy)
  if (len < 3) {
    p.moving = false
    return
  }
  // Nicht über das Ziel hinauslaufen.
  movePlayer(p, dx, dy, false, dt, Math.min(maxSpeed, len / dt))
}

// Abstand eines Punkts zur Strecke a–b, für die Prüfung der Passbahn.
function distToSegment(o, a, b) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len2 = dx * dx + dy * dy || 1
  const t = Math.min(Math.max(((o.x - a.x) * dx + (o.y - a.y) * dy) / len2, 0), 1)
  return Math.hypot(o.x - (a.x + t * dx), o.y - (a.y + t * dy))
}

function inOwnPenaltyArea(p, attack) {
  const ownGoal = goalOf(p.team, attack, true)
  const dx = Math.abs(p.x - ownGoal.x)
  return dx < PENALTY.w && Math.abs(p.y - CENTER.y) < PENALTY.h / 2
}

// Steuert alle Spieler, die nicht am Pad hängen.
export function updateAI(state, dt) {
  const { players, ball, attack } = state
  const ownerTeam = state.owner >= 0 ? players[state.owner].team : -1

  for (const team of [0, 1]) {
    const controlled = state.humanActive[team] ? state.controlled[team] : -1
    const ballFree = ownerTeam !== team

    // Ein Jäger je Mannschaft: der ballnächste freie Feldspieler, der nicht
    // am Pad hängt. Der gesteuerte Spieler ist ohnehin meist der nächste.
    // Ein zweiter Spieler presst nach, wenn der Gegner den Ball führt.
    let chaser = -1
    let presser = -1
    if (ballFree) {
      const candidates = players
        .map((p, i) => ({ i, d: dist(p, ball) }))
        .filter(({ i }) => players[i].team === team && i !== controlled && i % 11 !== 0)
        .sort((a, b) => a.d - b.d)
      chaser = candidates[0]?.i ?? -1
      if (ownerTeam >= 0) presser = candidates[1]?.i ?? -1
    }

    players.forEach((p, i) => {
      if (p.team !== team || i === controlled) return

      if (state.owner === i) {
        withBall(state, p, i, dt)
        return
      }
      p.hold = 0
      p.dribbleTarget = null

      if (i % 11 === 0) {
        keeper(state, p, dt, ballFree)
        return
      }

      if (i === chaser) {
        // Etwas vor den Ball laufen, wenn er rollt.
        const tx = ball.x + ball.vx * 0.25
        const ty = ball.y + ball.vy * 0.25
        moveTo(p, tx, ty, dt, dist(p, ball) > 200 ? PLAYER.sprint * 0.9 : PLAYER.speed)
        return
      }

      if (i === presser) {
        // Zwischen Ball und eigenem Tor Stellung nehmen, nah am Ball.
        const own = goalOf(team, attack, true)
        const len = dist(ball, own) || 1
        const tx = ball.x + ((own.x - ball.x) / len) * AI.pressDistance
        const ty = ball.y + ((own.y - ball.y) / len) * AI.pressDistance
        moveTo(p, tx, ty, dt, PLAYER.speed)
        return
      }

      // Grundposition, die mit dem Ball mitwandert. Mit Ball rückt die
      // Mannschaft vor, ohne Ball fällt sie zurück.
      const shift = ownerTeam === team ? 90 : ownerTeam === -1 ? 0 : -90
      const tx = p.homeX + (ball.x - CENTER.x) * AI.drift + attack[team] * shift
      const ty = p.homeY + (ball.y - CENTER.y) * (AI.drift * 0.8)
      moveTo(
        p,
        Math.min(Math.max(tx, PITCH.x + 20), PITCH.x + PITCH.w - 20),
        Math.min(Math.max(ty, PITCH.y + 20), PITCH.y + PITCH.h - 20),
        dt,
        PLAYER.speed * 0.8,
      )
    })
  }
}

// Torwart: bleibt vor dem Tor auf Ballhöhe, geht im Strafraum zum freien Ball.
function keeper(state, p, dt, ballFree) {
  const { ball, attack } = state
  const ownGoal = goalOf(p.team, attack, true)
  const inArea = Math.abs(ball.x - ownGoal.x) < PENALTY.w && Math.abs(ball.y - CENTER.y) < PENALTY.h / 2
  if (ballFree && inArea && inOwnPenaltyArea(p, attack)) {
    moveTo(p, ball.x, ball.y, dt, PLAYER.speed)
    return
  }
  const lineX = ownGoal.x + attack[p.team] * 48
  // Rollt der Ball aufs Tor, dorthin gehen, wo er die Linie des Torwarts kreuzt.
  let aimY = ball.y
  const towards = ball.vx * (lineX - ball.x) > 0
  if (towards && Math.abs(ball.vx) > 50) {
    const t = (lineX - ball.x) / ball.vx
    aimY = ball.y + ball.vy * t
  }
  const y = Math.min(Math.max(aimY, CENTER.y - GOAL.width / 2 + 10), CENTER.y + GOAL.width / 2 - 10)
  moveTo(p, lineX, y, dt, PLAYER.speed)
}

// KI-Spieler am Ball: kurz halten, dann schießen, passen oder dribbeln.
function withBall(state, p, i, dt) {
  const { players, attack } = state
  p.hold += dt

  // Torhüter schlagen den Ball sofort weit nach vorn, leicht zur Seite.
  if (i % 11 === 0) {
    if (p.hold < 0.15) return
    const goal = goalOf(p.team, attack, false)
    const side = p.y < CENTER.y ? -1 : 1
    face(p, goal.x, CENTER.y + side * PITCH.h * 0.3)
    kick(state, i, KICK.shot * 0.85, 0.12)
    p.hold = 0
    return
  }

  // Zwischen zwei Entscheidungen läuft ein begonnenes Dribbling weiter.
  if (p.hold < AI.holdTime) {
    if (p.dribbleTarget) dribble(state, p, p.dribbleTarget.x, p.dribbleTarget.y, dt)
    return
  }

  const goal = goalOf(p.team, attack, false)
  const toGoal = dist(p, goal)
  const depth = Math.abs(goal.x - p.x) // Abstand zur Torlinie

  // Zu nah an der Torlinie: kein Winkel. Zurück Richtung Elfmeterpunkt.
  if (depth < AI.minShotDepth && toGoal > GOAL.width) {
    p.dribbleTarget = { x: goal.x - attack[p.team] * 200, y: CENTER.y }
    dribble(state, p, p.dribbleTarget.x, p.dribbleTarget.y, dt)
    p.hold = AI.holdTime * 0.5
    return
  }

  if (toGoal < AI.shootDistance) {
    face(p, goal.x, goal.y + (Math.random() * 2 - 1) * GOAL.width * 0.45)
    kick(state, i, KICK.shot, AI.shotSpread)
    p.hold = 0
    return
  }

  // Bester Passempfänger: weit vorn, nicht zu nah, kein Gegner in der Nähe.
  let best = -1
  let bestScore = -Infinity
  players.forEach((m, j) => {
    if (m.team !== p.team || j === i) return
    const d = dist(p, m)
    if (d < AI.passMin || d > AI.passMax) return
    const progress = (m.x - p.x) * attack[p.team]
    let score = progress - Math.abs(m.y - p.y) * 0.4
    players.forEach((o) => {
      if (o.team === p.team) return
      if (dist(o, m) < 70) score -= 200
      // Gegner in der Passbahn fangen den Ball ab.
      if (distToSegment(o, p, m) < AI.laneWidth) score -= 400
    })
    if (score > bestScore) (bestScore = score), (best = j)
  })

  if (best >= 0 && bestScore > -150) {
    const m = players[best]
    face(p, m.x, m.y)
    const d = dist(p, m)
    kick(state, i, Math.min(Math.max(d * 1.6, 450), 900))
    p.hold = 0
    return
  }

  // Sonst dribbeln: Richtung Elfmeterpunkt, dabei vom nächsten Gegner wegziehen.
  p.dribbleTarget = { x: goal.x - attack[p.team] * 180, y: goal.y }
  dribble(state, p, p.dribbleTarget.x, p.dribbleTarget.y, dt)
  p.hold = AI.holdTime * 0.5
}

function dribble(state, p, tx, ty, dt) {
  let dx = tx - p.x
  let dy = ty - p.y
  const len = Math.hypot(dx, dy) || 1
  dx /= len
  dy /= len
  let nearest = null
  let nd = Infinity
  state.players.forEach((o) => {
    if (o.team === p.team) return
    const d = dist(o, p)
    if (d < nd) (nd = d), (nearest = o)
  })
  if (nearest && nd < 90) {
    // Ausweichen: quer zur Verbindungslinie, auf der freieren Seite.
    const ax = (p.x - nearest.x) / nd
    const ay = (p.y - nearest.y) / nd
    dx += ax * 1.2
    dy += ay * 1.2
  }
  movePlayer(p, dx, dy, nd < 120, dt, PLAYER.sprint * 0.95)
}
