import { PITCH, GOAL, BALL } from './constants.js'

// Tor, wenn der Ball vollständig hinter der Torlinie und zwischen den Pfosten
// liegt. Liefert -1 für das linke Tor, 1 für das rechte, sonst 0.
export function checkGoal(ball) {
  const goalTop = PITCH.y + PITCH.h / 2 - GOAL.width / 2
  const goalBottom = goalTop + GOAL.width
  if (ball.y < goalTop || ball.y > goalBottom) return 0
  if (ball.x + BALL.radius < PITCH.x) return -1
  if (ball.x - BALL.radius > PITCH.x + PITCH.w) return 1
  return 0
}
