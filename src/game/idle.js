import { IDLE_HINT_AFTER } from './constants.js'

// Merkt sich je Spieler, wann zuletzt eine Eingabe kam. Während des Spiels
// erscheint nach einigen Sekunden ohne Eingabe ein Hinweis, mehr nicht.
// Der Hinweis gilt nur für Plätze, die schon einmal benutzt wurden oder an
// denen ein Pad hängt, damit ein leerer Platz nicht dauernd mahnt.
export function updateIdle(state) {
  state.inputs.forEach((input, i) => {
    const slot = state.idle[i]
    if (input.active) {
      slot.lastActive = state.time
      slot.used = true
    }
    const inPlay = state.match.phase === 'play'
    const relevant = slot.used || input.connected
    slot.hint = inPlay && relevant && state.time - slot.lastActive > IDLE_HINT_AFTER
  })
}
