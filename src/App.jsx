import Stage from './components/Stage.jsx'
import Pitch from './components/Pitch.jsx'
import Player from './components/Player.jsx'
import Ball from './components/Ball.jsx'
import Scoreboard from './components/Scoreboard.jsx'
import Banner from './components/Banner.jsx'
import IdleHint from './components/IdleHint.jsx'
import { useGame } from './game/useGame.js'
import { padDebug } from './game/input.js'

const DEBUG = typeof window !== 'undefined' && window.location.search.includes('debug')

export default function App() {
  const game = useGame()
  return (
    <Stage>
      <Pitch />
      {game.players.map((p, i) => (
        <Player key={i} player={p} controlled={game.controlled[p.team] === i} />
      ))}
      <Ball ball={game.ball} />
      <Scoreboard game={game} />
      <Banner game={game} />
      <IdleHint game={game} />
      <div className="debug">
        {game.time.toFixed(1)} s
        {DEBUG && padDebug().map((line) => <div key={line}>{line}</div>)}
        {DEBUG && padDebug().length === 0 && <div>Kein Gamepad erkannt</div>}
      </div>
    </Stage>
  )
}
