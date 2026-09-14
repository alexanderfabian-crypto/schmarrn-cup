import { BALL } from '../game/constants.js'

export default function Ball({ ball }) {
  const d = BALL.radius * 2
  return (
    <div
      className="ball"
      style={{
        width: d,
        height: d,
        transform: `translate(${ball.x - BALL.radius}px, ${ball.y - BALL.radius}px)`,
      }}
    />
  )
}
