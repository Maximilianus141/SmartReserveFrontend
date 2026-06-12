# SmartReserve - Frontend-Anwendung

SmartReserve ist eine moderne, professionelle und rollenbasierte Anwendung zur Termin- und Ressourcenreservierung. Sie wurde entwickelt, um die Dienstleistungsverwaltung zu optimieren und Buchungsprozesse dynamisch durch intuitive Benutzer-Workflows und präzise Zugriffskontrollen zu steuern.

Die Anwendung basiert auf **Angular 21 (Standalone-Komponenten-Architektur)** unter Verwendung moderner reaktiver Entwurfsmuster wie **Signals** sowie **RxJS-Datenströmen** und wird durch eine sichere **Keycloak-OAuth2-Single-Sign-On-Integration (SSO)** geschützt.

---

## 🛠️ Technologie-Stack
* **Frontend-Framework:** Angular 21 (Standalone-Komponenten, Signals, reaktive Formulargruppen)
* **Design & Styling:** SCSS (Sass), Tailwind-CSS-Zuweisungen, responsive Grid-Layouts
* **Sicherheit & IAM:** Keycloak (OAuth2-Authorization-Code-Flow, JWT-Validierung, Extraktion von Rollen auf Client-Ebene)
* **Routing & Guards:** Angular-Router mit dynamischer Zustandserhaltung und Rollenschutz-Guards
* **Testumgebung:** Vitest (14/14 automatisierte Spezifikationen zur Validierung von Services, Guards, Interzeptoren und Komponenten)

---

## 🔐 Architektur & Sicherheitsintegration
SmartReserve erzwingt Sicherheitsprüfungen an jeder Schnittstelle von Zustandsübergängen und API-Abrufen:
1. **Dynamischer Authentifizierungsstatus (`KeycloakService`):** Steuert Handshakes und Tokens und bindet Rollen auf Client-Ebene (`ROLE_admin`, `ROLE_guest`) an die bedingte Darstellung der Benutzeroberfläche.
2. **Zugriffsschutz (`authGuard`):** Sichert Routen beim Laden, fängt unbefugte Übergänge ab und leitet Benutzer direkt zur Keycloak-Anmeldeseite weiter.
3. **Implizite Interzeptoren (`authInterceptor`):** Fügt allen ausgehenden API-Anfragen an das Backend automatisch die standardmäßigen `Bearer-JWT`-Header hinzu.
4. **Ausfallsicherer Datenzugriff:** Entkoppelt Benutzeroberflächen durch dedizierte Client-Services vollständig von direkten HTTP-Operationen.

---

## 📖 Benutzerfunktionen & Dokumentationsleitfaden
Der folgende Abschnitt bietet einen umfassenden Überblick über die Kernfunktionen der Anwendung, ergänzt durch visuelle Platzhalter für Dokumentations- und Bewertungszwecke.

---

### 1. Einheitliche Authentifizierung & rollenbasierte Navigation
Beim Aufrufen der Anwendung können sich Benutzer sicher über Keycloak anmelden. Nach erfolgreicher Authentifizierung aktualisiert sich die Navigationsleiste dynamisch, zeigt den Benutzernamen an und gibt administrative Funktionen selektiv basierend auf den zugewiesenen Rollen frei.

* **Funktionen:**
  - One-Click-An- und Abmeldung mit automatischer Weiterleitung.
  - Nahtlose Token-Aktualisierung im Hintergrund.
  - Rollenbasierte Benutzeroberfläche (Administratoren sehen Verwaltungsmenüs, Gäste sehen den Buchungsbereich).

#### 📸 Benutzeroberfläche: Anmeldung & Status
```
+-------------------------------------------------------------------------------+
|                                                                               |
|                   [ PLATZHALTER: SCREENSHOT BENUTZER-AUTHENTIFIZIERUNG ]       |
|                                                                               |
|   Anzeige: Navigationsleiste, angemeldeter Benutzername, dynamischer          |
|   Abmeldebutton (Logout) und das Begrüßungspanel.                            |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

### 2. Dienstleistungskatalog (Service-Explorer)
Die Startseite präsentiert eine übersichtliche Übersicht aller angebotenen Dienstleistungen. Gäste und Administratoren können Beschreibungen, Sitzungsdauern und Pufferzeiten mühelos einsehen.

* **Funktionen:**
  - Interaktives Grid-Layout mit ansprechenden Hover- und Fokus-Zuständen.
  - Barrierefreie Bedienung über Tastatursteuerungen (durch `tabindex` und Keydown-Events).
  - Übersichtliche Darstellung von Behandlungszeiten und nachfolgenden Pausenzeiten.

#### 📸 Dienstleistungsübersicht
```
+-------------------------------------------------------------------------------+
|                                                                               |
|                   [ PLATZHALTER: SCREENSHOT DIENSTLEISTUNGSKATALOG ]          |
|                                                                               |
|   Anzeige: Grid-Layout der verfügbaren Dienste mit Titeln, Beschreibungen,    |
|   Dauer-Indikatoren und barrierefreien Aktionsschaltflächen.                  |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

### 3. Intelligenter Buchungskalender (Gast-Buchung)
Die Auswahl einer Dienstleistung öffnet einen interaktiven Buchungsassistenten. Gäste wählen ein gewünschtes Datum auf einem integrierten Kalender aus. Die Benutzeroberfläche fragt die Verfügbarkeiten in Echtzeit vom Backend ab, listet freie Zeitfenster auf und ermöglicht die Reservierung.

* **Funktionen:**
  - Visuelle Hervorhebung des ausgewählten Tages im Kalender.
  - Chronologische Auflistung aller freien Buchungsfenster.
  - Konsistente lokale Zeitzonenbehandlung (umgeht UTC-Verschiebungen zur Erhaltung der ausgewählten Uhrzeit).

#### 📸 Buchungsassistent
```
+-------------------------------------------------------------------------------+
|                                                                               |
|                   [ PLATZHALTER: SCREENSHOT BUCHUNGSASSISTENT / KALENDER ]    |
|                                                                               |
|   Anzeige: Datumsauswahl, freie Zeitfenster in Echtzeit, dynamische           |
|   Zusammenfassung des ausgewählten Termins und Buchungs-Schaltfläche.        |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

### 4. Persönlicher Reservierungsmanager (Gast-Ansicht)
Gäste können all ihre gebuchten Termine in einem zentralen Dashboard verwalten. Die Ansicht berechnet automatisch das voraussichtliche Ende des Termins und ermöglicht sichere Stornierungen.

* **Funktionen:**
  - Chronologisch sortierte Liste zukünftiger Termine.
  - Präzise Berechnung von Start- und Endzeitpunkten.
  - Sicherheitsabfragen vor Stornierungsaktionen.

#### 📸 Dashboard für Gäste
```
+-------------------------------------------------------------------------------+
|                                                                               |
|                [ PLATZHALTER: SCREENSHOT GAST-RESERVIERUNGSMANAGER ]          |
|                                                                               |
|   Anzeige: Buchungsliste, aktueller Buchungsstatus (PENDING, CONFIRMED,       |
|   CANCELLED) und der Stornierungsdialog.                                      |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

### 5. Dienstleistungskonfiguration (Admin-Bereich)
Administratoren haben Zugriff auf eine Benutzeroberfläche zur Erstellung und Bearbeitung von Dienstleistungen. Dieses Formular nutzt Angular FormGroups für sofortiges Frontend-Feedback und präzise Validierungen.

* **Funktionen:**
  - Feldvalidierungen (Mindestlängen, positive Zahlenbereiche, Pflichtfelder).
  - Zweifache Betriebsmodi (Erstellung vs. Bearbeitung) passend zu den Backend-Datenstrukturen.
  - Sicherheitsabfragen beim Verwerfen von Änderungen zur Vermeidung von Datenverlust.

#### 📸 Formular zur Dienstleistungskonfiguration
```
+-------------------------------------------------------------------------------+
|                                                                               |
|                [ PLATZHALTER: SCREENSHOT DIENSTLEISTUNGSKONFIGURATION ]       |
|                                                                               |
|   Anzeige: Administrator-Formular, Validierungsfehler-Anzeigen                |
|   und Steuerungsschaltflächen (Speichern/Abbrechen).                         |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

### 6. Globale Reservierungsübersicht & Verwaltung (Admin-Bereich)
Administratoren steht eine Master-Übersicht aller Reservierungen der gesamten Plattform zur Verfügung. Diese Ansicht ermöglicht direkte Statusänderungen, Terminverschiebungen und administrative Löschungen.

* **Funktionen:**
  - Vollständige Liste aller aktiven Buchungen aller Benutzer.
  - Live-Status-Dropdowns zur direkten Synchronisierung von Statusänderungen mit der Datenbank.
  - Verschiebungssteuerungen, die an die Backend-Struktur `AdminReservationRequestDTO` gekoppelt sind.
  - Sicherheitsabfragen vor endgültigen Löschungen zur Wahrung der Datenbankkonsistenz.

#### 📸 Globale Reservierungsverwaltung
```
+-------------------------------------------------------------------------------+
|                                                                               |
|                [ PLATZHALTER: SCREENSHOT GLOBALE RESERVIERUNGSVERWALTUNG ]    |
|                                                                               |
|   Anzeige: Reservierungstabelle, Dropdown-Auswahl für den Buchungsstatus      |
|   sowie administrative Lösch- und Bearbeitungsoptionen.                       |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

## 🚀 Ausführung & Befehlsreferenz

### Lokalen Entwicklungsserver starten
```bash
npm run start
```
*Öffnet die Anwendung unter `http://localhost:4200/`*

### Produktions-Build erstellen
```bash
npm run build
```

### Linter & Qualitätsprüfungen ausführen
```bash
npm run lint
```

### Automatisierte Tests ausführen (Vitest)
```bash
npm run test
```
