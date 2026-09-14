import { PITCH, GOAL } from '../game/constants.js'

const LINE = 4
const CENTER_R = 130
const PENALTY = { w: 267, h: 569 }
const GOAL_AREA = { w: 89, h: 258 }
const SPOT = 178

// Absolut positionierte Rechtecke und Kreise, alle Maße in Bühnenpixeln.
function box(x, y, w, h, extra = {}) {
  return { position: 'absolute', left: x, top: y, width: w, height: h, ...extra }
}

export default function Pitch() {
  const { x, y, w, h } = PITCH
  const cy = y + h / 2
  const goalTop = cy - GOAL.width / 2

  return (
    <div className="pitch" style={box(x, y, w, h)}>
      <div className="line" style={box(0, 0, w, h)} />
      <div className="line" style={box(w / 2 - LINE / 2, 0, LINE, h)} />
      <div
        className="line round"
        style={box(w / 2 - CENTER_R, h / 2 - CENTER_R, CENTER_R * 2, CENTER_R * 2)}
      />
      <div className="spot" style={box(w / 2 - 6, h / 2 - 6, 12, 12)} />

      {/* Strafräume und Torräume, links und rechts */}
      <div className="line" style={box(-LINE, h / 2 - PENALTY.h / 2, PENALTY.w, PENALTY.h)} />
      <div className="line" style={box(w - PENALTY.w + LINE, h / 2 - PENALTY.h / 2, PENALTY.w, PENALTY.h)} />
      <div className="line" style={box(-LINE, h / 2 - GOAL_AREA.h / 2, GOAL_AREA.w, GOAL_AREA.h)} />
      <div className="line" style={box(w - GOAL_AREA.w + LINE, h / 2 - GOAL_AREA.h / 2, GOAL_AREA.w, GOAL_AREA.h)} />
      <div className="spot" style={box(SPOT - 6, h / 2 - 6, 12, 12)} />
      <div className="spot" style={box(w - SPOT - 6, h / 2 - 6, 12, 12)} />

      {/* Tore hinter der Torlinie */}
      <div className="goal" style={box(-GOAL.depth, goalTop - y, GOAL.depth, GOAL.width)} />
      <div className="goal" style={box(w, goalTop - y, GOAL.depth, GOAL.width)} />
    </div>
  )
}
