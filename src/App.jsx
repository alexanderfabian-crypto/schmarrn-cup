import Stage from './components/Stage.jsx'
import Pitch from './components/Pitch.jsx'
import { useGame } from './game/useGame.js'

export default function App() {
  const game = useGame()
  return (
    <Stage>
      <Pitch />
      <div className="debug">{game.time.toFixed(1)} s</div>
    </Stage>
  )
}
