import teams from '../../content/teams.json'

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
  if (m.phase === 'fulltime') (text = 'Abpfiff'), (sub = 'Neues Spiel mit Start')
  if (!text) return null
  return (
    <div className={`banner phase-${m.phase}`} key={m.phase}>
      <div className="banner-text">{text}</div>
      <div className="banner-sub">{sub}</div>
    </div>
  )
}
