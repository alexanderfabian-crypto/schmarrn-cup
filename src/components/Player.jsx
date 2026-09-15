const SIZE = 34

export default function Player({ player, controlled, celebrating, index }) {
  const classes = ['player', `team-${player.team}`]
  if (controlled) classes.push('controlled')
  if (celebrating) classes.push('celebrating')
  return (
    <div
      className={classes.join(' ')}
      style={{
        width: SIZE,
        height: SIZE,
        transform: `translate(${player.x - SIZE / 2}px, ${player.y - SIZE / 2}px)`,
        // Versetzter Start, damit nicht alle im Gleichtakt hüpfen.
        animationDelay: celebrating ? `${(index % 11) * 0.07}s` : undefined,
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
