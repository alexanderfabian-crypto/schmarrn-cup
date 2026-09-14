import teams from '../../content/teams.json'
import { matchSeconds, formatClock } from '../game/match.js'

// Anzeigetafel im Streifen über dem Feld: Namen, Spielstand, Halbzeit, Uhr.
export default function Scoreboard({ game }) {
  const m = game.match
  const halfLabel = m.phase === 'halftime' ? 'Halbzeit' : m.phase === 'fulltime' ? 'Ende' : `${m.half}. Halbzeit`
  return (
    <div className="scoreboard">
      <div className="team team-0">{teams.teams[0].name}</div>
      <div className="result">
        {game.score[0]}
        <span className="colon">:</span>
        {game.score[1]}
      </div>
      <div className="team team-1">{teams.teams[1].name}</div>
      <div className="half">{halfLabel}</div>
      <div className="clock">{formatClock(matchSeconds(m))}</div>
    </div>
  )
}
