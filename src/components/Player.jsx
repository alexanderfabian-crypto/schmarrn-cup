const SIZE = 34

export default function Player({ player, controlled }) {
  return (
    <div
      className={`player team-${player.team}${controlled ? ' controlled' : ''}`}
      style={{
        width: SIZE,
        height: SIZE,
        transform: `translate(${player.x - SIZE / 2}px, ${player.y - SIZE / 2}px)`,
      }}
    >
      <span className="number">{player.number}</span>
      <span
        className="facing"
        style={{ transform: `translate(${player.dirX * 11}px, ${player.dirY * 11}px)` }}
      />
    </div>
  )
}
