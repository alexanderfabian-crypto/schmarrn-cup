import { PITCH, GOAL, BALL } from './constants.js'

// Tor, wenn der Ball vollständig hinter der Torlinie und zwischen den Pfosten
// liegt. Liefert die Mannschaft, die getroffen hat, sonst -1.
export function checkGoal(ball) {
  const goalTop = PITCH.y + PITCH.h / 2 - GOAL.width / 2
  const goalBottom = goalTop + GOAL.width
  if (ball.y < goalTop || ball.y > goalBottom) return -1
  if (ball.x + BALL.radius < PITCH.x) return 1 // linkes Tor, Treffer für blau
  if (ball.x - BALL.radius > PITCH.x + PITCH.w) return 0 // rechtes Tor, Treffer für gelb
  return -1
}
