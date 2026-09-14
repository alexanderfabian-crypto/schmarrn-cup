// Grundpositionen einer 4-4-2 als Anteile des Feldes, x vom eigenen Tor aus.
// Reihenfolge entspricht den Rückennummern 1 bis 11 in teams.json.
export const FORMATION = [
  [0.04, 0.5], // 1 Tor
  [0.2, 0.15], // 2
  [0.2, 0.38], // 3
  [0.2, 0.62], // 4
  [0.2, 0.85], // 5
  [0.42, 0.15], // 6
  [0.42, 0.38], // 7
  [0.42, 0.62], // 8
  [0.42, 0.85], // 9
  [0.62, 0.35], // 10
  [0.62, 0.65], // 11
]

// Beim Anstoß rücken zwei Spieler der anstoßenden Mannschaft zum Mittelpunkt.
export const KICKOFF = [
  [0.499, 0.5],
  [0.47, 0.56],
]

// Die andere Mannschaft zieht ihre Stürmer beim Anstoß in die eigene Hälfte.
export const KICKOFF_WAIT = [
  [0.45, 0.35],
  [0.45, 0.65],
]
