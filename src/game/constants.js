// Feste Bühne, wird per CSS-Transform auf das Fenster skaliert.
export const STAGE = { w: 1920, h: 1080 }

// Spielfeld in Bühnenkoordinaten. Oben bleibt Platz für die Anzeigetafel,
// links und rechts für die Tore hinter der Torlinie.
export const PITCH = { x: 110, y: 100, w: 1700, h: 960 }

export const GOAL = { width: 140, depth: 40 }

export const STEP = 1 / 120 // fester Zeitschritt der Simulation in Sekunden

export const BALL = {
  radius: 7,
  friction: 0.9, // exponentieller Abbau der Geschwindigkeit pro Sekunde
  bounce: 0.6, // Energieerhalt beim Abprallen an der Bande
}

export const PLAYER = {
  radius: 17,
  speed: 260, // px pro Sekunde
  sprint: 390,
}

export const KICK = {
  controlRadius: 26, // Abstand, ab dem ein Spieler den Ball übernimmt
  keeperRadius: 34, // Torhüter haben Hände
  carry: 20, // Abstand des Balls vor dem Spieler beim Dribbeln
  pass: 750, // Ballgeschwindigkeit in px/s
  shot: 1350,
  shotSpread: 0.05, // Streuung des Schusses in Radiant
  cooldown: 0.3, // Sekunden, in denen der Schütze den Ball nicht zurückholt
  launch: 0.1, // Sekunden nach dem Kick, in denen niemand den Ball annimmt
  trapSpeed: 500, // ab dieser Geschwindigkeit wird die Annahme unsicher
  trapMinChance: 0.2, // Annahmechance je Schritt bei vollem Schuss
  tackleChance: 0.5, // Erfolgsquote eines Zweikampfs
  tackleRetry: 0.6, // Sekunden Pause nach einem verlorenen Zweikampf
}

export const MATCH = {
  halfLength: 180, // Sekunden je Halbzeit
  halftimeBreak: 15,
  celebration: 5, // Sekunden Jubel nach einem Tor
  clockRunsDuringCelebration: true, // Uhr läuft beim Jubel weiter, Gesamtdauer bleibt exakt
}

export const IDLE_HINT_AFTER = 3 // Sekunden ohne Eingabe, bis der Hinweis erscheint

export const AI = {
  holdTime: 0.35, // Sekunden, die ein KI-Spieler den Ball hält, bevor er entscheidet
  shootDistance: 430, // Abstand zum Tor, ab dem geschossen wird
  shotSpread: 0.09, // Streuung der KI-Schüsse in Radiant
  minShotDepth: 130, // Mindestabstand zur Torlinie für einen Schuss
  pressDistance: 60, // Abstand, den der zweite Presser zum Ball hält
  laneWidth: 45, // Gegner näher als das an der Passbahn blockieren den Pass
  passMin: 120,
  passMax: 650,
  drift: 0.35, // wie stark die Grundpositionen mit dem Ball mitwandern
  protection: 0.4, // Sekunden nach Ballgewinn, in denen kein Gegner den Ball nimmt
  takeoverAfter: 1, // Sekunden ohne Eingabe, bis die KI den gesteuerten Spieler mitführt
}
