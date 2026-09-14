// Liest Tastatur und Gamepads und liefert pro Spieler einen Eingabezustand:
// { dx, dy, pass, shoot, sprint, passPressed, shootPressed, active }
// pass/shoot sind gehaltene Tasten, *Pressed nur im Frame des Drückens.

// 8BitDo SN30 Pro im Standard-Mapping (X-Input): physisch B = Index 0,
// physisch A = Index 1, R = Index 5, Steuerkreuz = Index 12 bis 15.
export const PAD_BUTTONS = { pass: 0, shoot: 1, sprint: 5, up: 12, down: 13, left: 14, right: 15 }

// Tastatur für Tests ohne Pads: Pfeiltasten, X passen, C schießen, Shift sprinten.
const KEYS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyX: 'pass',
  KeyC: 'shoot',
  ShiftLeft: 'sprint',
  ShiftRight: 'sprint',
}

const keyState = {}
const prev = [{}, {}]

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (KEYS[e.code]) {
      keyState[KEYS[e.code]] = true
      e.preventDefault()
    }
  })
  window.addEventListener('keyup', (e) => {
    if (KEYS[e.code]) keyState[KEYS[e.code]] = false
  })
}

function emptyInput() {
  return { dx: 0, dy: 0, pass: false, shoot: false, sprint: false, active: false }
}

function readPad(pad) {
  const b = (i) => Boolean(pad.buttons[i]?.pressed)
  const raw = {
    up: b(PAD_BUTTONS.up),
    down: b(PAD_BUTTONS.down),
    left: b(PAD_BUTTONS.left),
    right: b(PAD_BUTTONS.right),
    pass: b(PAD_BUTTONS.pass),
    shoot: b(PAD_BUTTONS.shoot),
    sprint: b(PAD_BUTTONS.sprint),
  }
  // Manche Modi melden das Steuerkreuz als Achsen statt als Tasten.
  if (!raw.up && !raw.down && !raw.left && !raw.right && pad.axes.length >= 2) {
    raw.left = pad.axes[0] < -0.5
    raw.right = pad.axes[0] > 0.5
    raw.up = pad.axes[1] < -0.5
    raw.down = pad.axes[1] > 0.5
  }
  return raw
}

function toInput(raw) {
  const input = emptyInput()
  input.dx = (raw.right ? 1 : 0) - (raw.left ? 1 : 0)
  input.dy = (raw.down ? 1 : 0) - (raw.up ? 1 : 0)
  input.pass = Boolean(raw.pass)
  input.shoot = Boolean(raw.shoot)
  input.sprint = Boolean(raw.sprint)
  input.active = input.dx !== 0 || input.dy !== 0 || input.pass || input.shoot || input.sprint
  return input
}

// Pad 1 steuert Spieler 0, Pad 2 Spieler 1. Die Tastatur ergänzt Spieler 0.
export function readInputs() {
  const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : []
  const connected = [...pads].filter(Boolean)
  const inputs = [0, 1].map((i) => {
    const pad = connected[i]
    const input = pad ? toInput(readPad(pad)) : emptyInput()
    input.connected = Boolean(pad)
    return input
  })
  const kb = toInput(keyState)
  if (kb.active) {
    inputs[0].dx = kb.dx || inputs[0].dx
    inputs[0].dy = kb.dy || inputs[0].dy
    inputs[0].pass ||= kb.pass
    inputs[0].shoot ||= kb.shoot
    inputs[0].sprint ||= kb.sprint
    inputs[0].active = true
  }
  inputs.forEach((input, i) => {
    input.passPressed = input.pass && !prev[i].pass
    input.shootPressed = input.shoot && !prev[i].shoot
    prev[i] = { pass: input.pass, shoot: input.shoot }
  })
  return inputs
}

// Für Tests mit echten Pads: Kennung und gedrückte Tastenindizes je Pad.
export function padDebug() {
  const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : []
  return [...pads].filter(Boolean).map((pad, i) => {
    const pressed = pad.buttons.map((b, j) => (b.pressed ? j : -1)).filter((j) => j >= 0)
    const axes = pad.axes.map((a) => a.toFixed(1)).join(' ')
    return `Pad ${i + 1}: ${pad.id} | Tasten ${pressed.join(',') || '-'} | Achsen ${axes}`
  })
}
