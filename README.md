# Schmarrn Cup

Ein reduziertes Fußballspiel für die TV-Show. Draufsicht, kleine Figuren,
hohes Tempo, kein Pausenknopf.

## Starten

```
npm install
npm run dev
```

Der Server läuft fest auf Port 3004: http://localhost:3004

Für die Show `npm run build` und den Ordner `dist` ausliefern, oder einfach
den Dev-Server laufen lassen. Das Bild ist eine feste Bühne von 1920×1080 und
wird auf die Fenstergröße skaliert. Im Browser Vollbild schalten.

## Steuerung

| Aktion   | Pad (8BitDo SN30 Pro) | Spieler 1 (gelb) | Spieler 2 (blau) |
| -------- | --------------------- | ---------------- | ---------------- |
| Laufen   | Steuerkreuz           | Pfeiltasten      | W A S D          |
| Passen   | B                     | X                | Q                |
| Schießen | A                     | C                | E                |
| Sprinten | R                     | Umschalt         | Tabulator        |
| Start    | Start                 | Eingabetaste     | Eingabetaste     |

Ton stumm mit M. Pad 1 steuert Gelb, Pad 2 steuert Blau.

Ruht ein Controller länger als drei Sekunden, erscheint ein Hinweis am
Spielfeldrand. Nach einer Sekunde ohne Eingabe führt die KI den Spieler
mit, damit das Spiel nicht stehen bleibt. Die nächste Eingabe holt ihn
sofort zurück.

Mit `?debug` in der Adresse zeigt die Seite unten links die erkannten Pads
mit ihren Tastennummern. Nützlich, wenn ein Controller anders belegt ist.

## Ablauf

Zwei Halbzeiten à 3 Minuten, 15 Sekunden Pause mit Seitenwechsel. Nach einem
Tor 5 Sekunden Jubel, dann Wiederanstoß durch die Mannschaft, die das Tor
kassiert hat. Die Uhr läuft beim Jubel weiter, damit die Gesamtdauer steht.

## Stellschrauben

Alle Zahlen stehen in `src/game/constants.js`:

- `MATCH` Länge der Halbzeiten, Pause, Jubeldauer, ob die Uhr beim Jubel läuft
- `PLAYER` Laufgeschwindigkeit und Sprint
- `KICK` Pass- und Schusskraft, Reichweite der Ballannahme, Zweikampfquote
- `AI` Verhalten der Mitspieler, Schussentfernung, Passweiten
- `BALL` Reibung und Abprall
- `IDLE_HINT_AFTER` Sekunden bis zum Controller-Hinweis

Die Mannschaften stehen in `content/teams.json`, je elf Spitznamen mit
Rückennummer.
