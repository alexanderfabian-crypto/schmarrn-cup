import teams from '../../content/teams.json'

// Endstand in Worten, für die Einblendung nach dem Abpfiff.
function winnerLine([a, b]) {
  if (a === b) return `Unentschieden ${a}:${b}`
  const winner = a > b ? 0 : 1
  return `${teams.teams[winner].name} gewinnt ${Math.max(a, b)}:${Math.min(a, b)}`
}

// Große Einblendung in der Feldmitte für Phasen ohne laufendes Spiel.
export default function Banner({ game }) {
  const m = game.match
  const goal = game.lastGoal

  if (m.phase === 'goal') {
    const scorer = goal?.scorer
    return (
      <div className={`banner goal-banner team-${goal?.team ?? 0}`} key="goal">
        <div className="banner-text">Tor!</div>
        <div className="banner-sub">
          {teams.teams[goal?.team ?? 0].name}
          {scorer ? ` · ${scorer.number} ${scorer.name}` : ''}
          {goal?.ownGoal ? ' (Eigentor)' : ''}
        </div>
      </div>
    )
  }

  let text = null
  let sub = ''
  if (m.phase === 'ready') (text = 'Start drücken'), (sub = 'Enter oder Start-Taste')
  if (m.phase === 'halftime') (text = `Halbzeit · ${Math.ceil(m.timer)}`), (sub = 'Seitenwechsel')
  if (m.phase === 'fulltime') (text = 'Abpfiff'), (sub = winnerLine(game.score))
  if (!text) return null
  return (
    <div className={`banner phase-${m.phase}`} key={m.phase}>
      <div className="banner-text">{text}</div>
      <div className="banner-sub">{sub}</div>
    </div>
  )
}
