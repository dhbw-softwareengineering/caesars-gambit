# Testplan und neuer Sprint

---

## 1. Arten von Tests

Wir benutzen Unit und Componententests um die Komplexität übersichtlich zu halten.

### 1.1 Backend

Der Fokus unseres Testplans liegt auf Unit-Tests im Backend.  
Dabei werden die zentralen Funktionalitäten des Spiels isoliert getestet,
wie zum Beispiel das Betreten und das Verlassen eines Raums, sowie grundlegende Spiellogik. 

Ziel ist es, die wichtigsten Komponenten unabhängig voneinander zu überprüfen und Fehler frühzeitig zu erkennen.

Die Implementierung erfolgt mit JUnit.

Wir verfolgen bewusst einen pragmatischen Ansatz:  
Zunächst werden die wichtigsten Kernfunktionen getestet und 
anschließend weitere Tests bei Bedarf ergänzt.

### 1.2 Frontend

Zusätzlich planen wir im Frontend Tests mit Vitest umsetzen.

Dabei liegt der Fokus auf einfachen, aber wichtigen Szenarien wie:
- API-Aufrufen,
- ob die Spielansicht nach der Navigation geladen wird, 
- grundlegende Interaktionen wie Dialog-Verhalten

Diese Tests prüfen vor allem die Sichtbarkeit von Komponenten und Fehlerfälle.

Der Umfang der UI-Tests ist bewusst begrenzt und dient als Ergänzung zu den Backend-Tests.

---

## 2. Testziel

Unser zentrales Ziel im Testing ist es, die Stabilität und Korrektheit der Backend-Logik zuverlässig abzusichern, weil dort die wichtigsten Spielregeln und Zustandsübergänge umgesetzt werden.

Konkret wollen wir damit:
sicherstellen, dass Kernfunktionen des Spiels (z. B. Zustandswechsel, Aktionen, Validierungen) robust und fehlerfrei funktionieren,
Fehler frühzeitig im Entwicklungsprozess erkennen (damit Bugs nicht erst im Frontend oder in manuellen Tests auffallen),
und vor allem ungültige oder inkonsistente Spielzustände konsequent verhindern (z. B. illegale Züge, falsche Reihenfolgen, widersprüchliche Daten).
Dabei ist uns bewusst, dass Tests keine vollständige Fehlerfreiheit beweisen, sondern in erster Linie helfen, Fehler systematisch aufzudecken. Deshalb setzen wir auf zielgerichtete Tests mit hoher Aussagekraft: Fokus auf kritische Logik, Grenzfälle und negative Tests (Fehleingaben/unerlaubte Aktionen), statt „möglichst viele“ triviale Tests.

Als neues Learning aus der bisherigen Umsetzung hat sich gezeigt, dass besonders State-Management und Validierungslogik die größten Risiken für Folgefehler darstellen. Entsprechend priorisieren wir hier umfangreiche Abdeckung inkl. Edge-Cases und achten darauf, dass Tests auch saubere Fehlerreaktionen (Exceptions/Return-Codes) und korrekte Invarianten prüfen.

Unser Zielwert bleibt, für alle Kernfunktionalitäten im Backend eine Testabdeckung von ca. 90 % zu erreichen (mit Fokus auf sinnvolle Coverage, nicht nur reine Linienabdeckung).

---

## 3. Testwerkzeuge

Für unsere Tests verwenden wir folgende Werkzeuge:

- JUnit: Unit-Tests im Backend

- Vitest: Tests im Frontend

- GitHub Actions (CI/CD Pipeline): automatische Ausführung der Tests bei jedem Commit

- GitHub (Versionierung): Verwaltung des Quellcodes und der Tests

- Jira: Organisation von Aufgaben und ggf. Fehlertracking

Wir verzichten bewusst auf zusätzliche Tools wie API-Test-Frameworks oder Integrationstest-Tools, da diese für uns aktuell nicht im Fokus stehen. 

---

## 4. Testverwaltung

Unsere Testfälle werden direkt im Code implementiert und über GitHub versioniert.

Die Nachverfolgbarkeit erfolgt über GitHub Commits (welche Tests wann hinzugefügt wurden) und die CI/CD Pipeline (Testergebnisse pro Build). 

Die Tests können sowohl lokal in der IDE ausgeführt werden als auch automatisch über die Pipeline überprüft werden. 

Dadurch ist jederzeit ersichtlich welche Tests erfolgreich bzw. fehlgeschlagen sind, und in welchem Stand des Projekts sich das System befindet.
