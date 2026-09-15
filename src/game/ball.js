import { PITCH, GOAL, BALL } from './constants.js'

export function createBall() {
  return { x: PITCH.x + PITCH.w / 2, y: PITCH.y + PITCH.h / 2, vx: 0, vy: 0 }
}

// Rollt den Ball weiter und lässt ihn an Seiten- und Torlinie abprallen.
// Zwischen den Pfosten rollt er durch, das Tor selbst hat eine feste Rückwand.
export function moveBall(ball, dt, events) {
  ball.x += ball.vx * dt
  ball.y += ball.vy * dt
  const decay = Math.exp(-BALL.friction * dt)
  ball.vx *= decay
  ball.vy *= decay
  if (Math.abs(ball.vx) < 2 && Math.abs(ball.vy) < 2) ball.vx = ball.vy = 0

  const r = BALL.radius
  const top = PITCH.y + r
  const bottom = PITCH.y + PITCH.h - r
  const goalTop = PITCH.y + PITCH.h / 2 - GOAL.width / 2
  const goalBottom = goalTop + GOAL.width
  const inGoalMouth = ball.y > goalTop + r && ball.y < goalBottom - r

  const bounced = (v) => events && events.push({ type: 'touch', strength: Math.min(Math.abs(v) / 900, 1) * 0.6 })
  if (ball.y < top) (ball.y = top), bounced(ball.vy), (ball.vy = -ball.vy * BALL.bounce)
  if (ball.y > bottom) (ball.y = bottom), bounced(ball.vy), (ball.vy = -ball.vy * BALL.bounce)

  const left = inGoalMouth ? PITCH.x - GOAL.depth + r : PITCH.x + r
  const right = inGoalMouth ? PITCH.x + PITCH.w + GOAL.depth - r : PITCH.x + PITCH.w - r
  if (ball.x < left) (ball.x = left), bounced(ball.vx), (ball.vx = -ball.vx * BALL.bounce)
  if (ball.x > right) (ball.x = right), bounced(ball.vx), (ball.vx = -ball.vx * BALL.bounce)
}
