import Stage from './components/Stage.jsx'
import Pitch from './components/Pitch.jsx'
import Player from './components/Player.jsx'
import Ball from './components/Ball.jsx'
import { useGame } from './game/useGame.js'

export default function App() {
  const game = useGame()
  return (
    <Stage>
      <Pitch />
      {game.players.map((p, i) => (
        <Player key={i} player={p} />
      ))}
      <Ball ball={game.ball} />
      <div className="debug">{game.time.toFixed(1)} s</div>
    </Stage>
  )
}
