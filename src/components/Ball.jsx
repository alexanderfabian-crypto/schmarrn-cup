import { BALL, KICK } from '../game/constants.js'

// Schnelle Bälle wirken höher: Der Ball wird etwas größer, sein Schatten
// wandert weiter weg. Ein echter Flugbogen bleibt aus, das Spiel ist flach.
export default function Ball({ ball }) {
  const d = BALL.radius * 2
  const speed = Math.hypot(ball.vx, ball.vy)
  const lift = Math.min(speed / KICK.shot, 1)
  const scale = 1 + lift * 0.45
  const shadow = 3 + lift * 9

  return (
    <>
      <div
        className="ball-shadow"
        style={{
          width: d,
          height: d,
          transform: `translate(${ball.x - BALL.radius + shadow}px, ${ball.y - BALL.radius + shadow}px)`,
        }}
      />
      <div
        className="ball"
        style={{
          width: d,
          height: d,
          transform: `translate(${ball.x - BALL.radius}px, ${ball.y - BALL.radius}px) scale(${scale})`,
        }}
      />
    </>
  )
}
