import { MATCH } from '../game/constants.js'

// Große Einblendung in der Feldmitte für Phasen ohne laufendes Spiel.
export default function Banner({ game }) {
  const m = game.match
  let text = null
  if (m.phase === 'ready') text = 'Start drücken'
  if (m.phase === 'halftime') text = `Halbzeit · ${Math.ceil(m.timer)}`
  if (m.phase === 'fulltime') text = 'Abpfiff'
  if (m.phase === 'goal') text = 'Tor!'
  if (!text) return null
  return (
    <div className={`banner phase-${m.phase}`} key={m.phase}>
      <div className="banner-text">{text}</div>
      {m.phase === 'fulltime' && <div className="banner-sub">Neues Spiel mit Start</div>}
      {m.phase === 'ready' && <div className="banner-sub">Enter oder Start-Taste</div>}
      {m.phase === 'halftime' && <div className="banner-sub">Seitenwechsel</div>}
      {m.phase === 'goal' && <div className="banner-sub">{MATCH.clockRunsDuringCelebration ? '' : 'Uhr angehalten'}</div>}
    </div>
  )
}
