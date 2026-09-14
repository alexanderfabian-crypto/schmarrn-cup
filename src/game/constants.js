// Feste Bühne, wird per CSS-Transform auf das Fenster skaliert.
export const STAGE = { w: 1920, h: 1080 }

// Spielfeld in Bühnenkoordinaten. Oben bleibt Platz für die Anzeigetafel,
// links und rechts für die Tore hinter der Torlinie.
export const PITCH = { x: 110, y: 100, w: 1700, h: 960 }

export const GOAL = { width: 140, depth: 40 }

export const STEP = 1 / 120 // fester Zeitschritt der Simulation in Sekunden
