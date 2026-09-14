import teams from '../../content/teams.json'

// Hinweis am Feldrand der Mannschaft, deren Controller gerade ruht.
export default function IdleHint({ game }) {
  return game.idle.map((slot, i) =>
    slot.hint ? (
      <div key={i} className={`idle-hint side-${game.attack[i] === 1 ? 'left' : 'right'} team-${i}`}>
        {teams.teams[i].name}: Controller!
      </div>
    ) : null,
  )
}
