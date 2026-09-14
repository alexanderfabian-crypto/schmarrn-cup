# Schmarrn Cup

## Projekt

Ein bewusst reduziertes Fußballspiel für eine TV-Show. Zwei Spieler treten gegeneinander an und kochen parallel Kaiserschmarrn – sie spielen abwechselnd, legen den Controller weg, greifen wieder zu. Das Spiel läuft durch, Pause ist unmöglich.

Kein FIFA-Klon: Vorbild Sensible Soccer, Draufsicht aufs ganze Feld, kleine klare Figuren, hohes Tempo. Keine echten Vereine, Wappen, Gesichter oder fremde Gestaltung.

## Ablauf

- 2 Halbzeiten à 3 Minuten, 15 Sekunden Halbzeitpause.
- Nach einem Tor 5 Sekunden Jubel, dann Wiederanstoß.
- Die Uhr läuft beim Jubel weiter, damit 7 Minuten exakt eingehalten werden (umschaltbar vorsehen).

## Steuerung

- Zwei 8BitDo SN30 Pro über Bluetooth, Gamepad-API.
- Steuerkreuz statt Stick.
- B = passen, A = schießen, R = sprinten, sonst nichts.
- Hinweis-Anzeige, wenn ein Controller länger als 3 Sekunden unberührt ist, keine Strafe.
- Zusätzlich Tastatursteuerung für Tests ohne Pads.

## Mannschaften

- Zwei Traumelfs aus Spitznamen in `/content/teams.json`, keine Klarnamen.
- Trikots gelb gegen blau, Rückennummern lesbar.

## Optik

- Grünes Feld mit Mähstreifen, weiße Linien, sonst nichts.
- Anzeigetafel oben: Spielstand, Halbzeit, Uhr.
- Feste Bühne 1920×1080, per CSS-Transform skaliert.

## Ton

- Anpfiff, Ballkontakt, Torschrei, Halbzeit, Abpfiff.
- Mit M stummschaltbar.

## Arbeitsweise

- Vor jedem größeren Schritt Plan zeigen, erst nach Freigabe bauen.
- Kleine Commits.
- Keine Libraries ohne Rückfrage, React und reines CSS reichen.
- Ausschließlich in `~/schmarrn-cup` arbeiten.
- Keine globalen Installationen, kein sudo, keine Änderungen außerhalb des Projektordners. Alles, was das System betrifft, vorher fragen.

## Plan in drei Etappen

1. Feld, zwei Mannschaften, ein Spieler steuerbar, Ball, Torerkennung.
2. Zweiter Controller, Mitspieler-KI, Uhr, Halbzeit, Anzeigetafel.
3. Ton, Jubel, Feinschliff.
