# Projektdokumentation – Modul 294: Frontend-Schnittstellen realisieren

## Projekt: SmartReserve
### Intelligente Termin- & Ressourcenreservierung

* **Autor:** Maximilian Kenner
* **Kursname:** Informatik Mittelschule / Modul 294
* **Datum:** 12. Juni 2026
* **Referenzmodul:** Basiert auf Modul 295 (Datenbanken)

---

## Inhaltsverzeichnis
1. [Einleitung & Projektbeschreibung](#1-einleitung--projektbeschreibung)
2. [Frontend-Architektur & Sicherheit](#2-frontend-architektur--sicherheit)
3. [Skizzierte Wireframes der Benutzeroberfläche](#3-skizzierte-wireframes-der-benutzeroberfl%C3%A4che)
4. [Ausführliche Benutzer-Anleitung](#4-ausf%C3%BChrliche-benutzer-anleitung)
5. [Technische Konfiguration & Setup](#5-technische-konfiguration--setup)

---

## 1. Einleitung & Projektbeschreibung

Das Projekt **SmartReserve** ist eine moderne, hochgradig skalierbare Anwendung für die Termin- und Dienstleistungsreservierung in Echtzeit. Es wurde konzipiert, um Kunden (Gästen) eine benutzerfreundliche Möglichkeit zu bieten, freie Zeitfenster für Dienstleistungen einzusehen, direkt zu buchen und ihre Termine eigenständig zu verwalten. Gleichzeitig ermöglicht es Administratoren, Dienstleistungen hinzuzufügen, zu bearbeiten, zu löschen und alle Reservierungen plattformweit einzusehen und zu aktualisieren.

Dieses Dokument beschreibt die Realisierung der Frontend-Schnittstellen (Modul 294) und basiert strukturell auf den in Modul 295 (Datenbanken) erarbeiteten Konzepten und relationalen Schemata.

### Hauptmerkmale der Anwendung:
* **Responsive Single Page Application (SPA):** Entwickelt auf Basis des modernen Angular-Frameworks.
* **Identity and Access Management (IAM):** Vollständig integriert und abgesichert durch einen Keycloak-Server.
* **Rollenbasierte Ansichten:** Dynamische Benutzeroberflächen mit adaptiven Steuerungen (Admin- vs. Gast-Modus).
* **Automatisierte Berechnungen:** Echtzeit-Ermittlung freier Zeitfenster unter Berücksichtigung von individuellen Dienstleistungsdauern und nachfolgenden Pausenzeiten.
* **Lokale Zeitzonenbehandlung:** Konsistente Übertragung und Anzeige von Terminen zur Vermeidung von Verschiebungen.

---

## 2. Frontend-Architektur & Sicherheit

Die Benutzeroberfläche von SmartReserve basiert vollständig auf **Angular 21 Standalone-Komponenten**. Dies eliminiert veraltete Modulstrukturen und ermöglicht eine hochgradig modulare und typsichere Entwicklung.

### Wichtige Säulen der Architektur:

1. **Reaktivität mit Angular Signals:**
   Durch den Einsatz von Signals wird eine präzise, performante Änderungserkennung ermöglicht, welche nur die tatsächlich betroffenen DOM-Elemente aktualisiert. Dies optimiert die Render-Zyklen drastisch.

2. **Keycloak OAuth2 Integration:**
   Die gesamte Anmeldung wird über einen dedizierten Keycloak-Server abgewickelt. Nach dem Login hält der `KeycloakService` ein JSON Web Token (JWT), aus dem die Rollen (`ROLE_admin` und `ROLE_guest`) gelesen werden, um UI-Aktionen selektiv anzuzeigen.

3. **Schutz auf Routen- und API-Ebene:**
   * **Route Guards (`authGuard`):** Blockiert den unbefugten Zugriff auf Seiten wie die Reservierungsverwaltung oder Terminbuchung.
   * **HttpInterceptor (`authInterceptor`):** Fügt allen ausgehenden Backend-API-Anfragen automatisch ein `Authorization: Bearer <Token>` Header hinzu, um das Backend abzusichern.

---

## 3. Skizzierte Wireframes der Benutzeroberfläche

*(Hinweis: Ersetzen Sie diese Platzhalter durch Ihre eigenen gescannten oder gezeichneten Wireframe-Bilder)*

### Ansicht A: Dienstleistungskatalog (Startseite)
```
+-------------------------------------------------------------------------------+
| [Browser-Leiste] http://localhost:4200/                                       |
+-------------------------------------------------------------------------------+
|  SmartReserve                               Dienstleistungen | Reservierungen |
+-------------------------------------------------------------------------------+
|                                                                               |
|   [ Dienstleistungskachel 1 ]     [ Dienstleistungskachel 2 ]   [ + Admin ]   |
|   +-------------------------+     +-------------------------+   +-----------+ |
|   | Haarschnitt             |     | Bartpflege              |   | Neuer     | |
|   | Dauer: 30 M  Paus: 10 M |     | Dauer: 20 M  Paus: 5 M  |   | Dienst    | |
|   |                         |     |                         |   |           | |
|   |  [ BUCHEN-BUTTON ]      |     |  [ BUCHEN-BUTTON ]      |   |  [ + ]    | |
|   +-------------------------+     +-------------------------+   +-----------+ |
|                                                                               |
+-------------------------------------------------------------------------------+
```

### Ansicht B: Intelligente Slot-Auswahl & Kalender
```
+-------------------------------------------------------------------------------+
| [Browser-Leiste] http://localhost:4200/booking-select/1                       |
+-------------------------------------------------------------------------------+
|  SmartReserve                               Dienstleistungen | Reservierungen |
+-------------------------------------------------------------------------------+
|                                                                               |
|   [ KALENDER-WIDGET ]                     [ FREIE ZEITFENSTER-LISTE ]         |
|   Juni 2026                               Bitte wählen Sie Ihre Uhrzeit:      |
|   +-----------------------+               +---------------------------------+ |
|   | Mo Di Mi Do Fr Sa So  |               |  [ 09:00 Uhr ]   [ 10:00 Uhr ]  | |
|   |  1  2  3  4  5  6  7  |               |  [ 11:00 Uhr ]   [ 13:00 Uhr ]  | |
|   |  8  9 10 11 12 13 14  |               +---------------------------------+ |
|   | 15 16 17 18 19 [20]   |                                                   |
|   +-----------------------+               [ AUSGEWÄHLT: 20. Juni @ 10:00 ]    |
|                                           [ BUTTON: BUCHUNG BESTÄTIGEN ]      |
+-------------------------------------------------------------------------------+
```

---

## 4. Ausführliche Benutzer-Anleitung

Die Benutzeroberfläche von SmartReserve unterscheidet strikt zwischen zwei Rollen, um ein nahtloses und geschütztes Nutzererlebnis zu garantieren:

### A. Gast-Workflow (Buchung & Eigenverwaltung)
1. **Login:** Der Gast klickt oben rechts in der Navigationsleiste auf "Anmelden" und wird sicher über Keycloak authentifiziert.
2. **Dienstleistung auswählen:** Auf dem Dienstleistungskatalog wählt er die gewünschte Dienstleistung aus und klickt auf "Buchen".
3. **Termin festlegen:** Er navigiert über den Kalender zum Wunschdatum. Die freien Zeitfenster werden dynamisch geladen. Nach der Zeitauswahl klickt er auf "Buchung bestätigen".
4. **Termine verwalten:** Über "Reservierungen" sieht der Gast eine chronologische Liste seiner Termine samt errechnetem Dienstleistungsende und kann diese stornieren.

### B. Administrator-Workflow (Konfiguration & Verwaltung)
1. **Dienstleistungen anlegen/bearbeiten:** Als Admin eingeloggt, erscheint auf der Startseite eine zusätzliche Karte "+ Neuer Dienst". Bestehende Dienste können editiert oder gelöscht werden (z. B. über das Rechtsklick-Kontextmenü).
2. **Globale Reservierungsliste:** Der Admin sieht alle Buchungen aller Benutzer plattformweit. Er kann den Reservierungsstatus (PENDING, CONFIRMED, CANCELLED) direkt per Dropdown aktualisieren, Behandlungszeiten anpassen, zugeordnete Dienstleistungen ändern oder veraltete Termine löschen.

---

## 5. Technische Konfiguration & Setup

Hier finden Sie alle nötigen Konfigurationsparameter für das lokale Setup der Anwendung:

### A. Keycloak-Sicherheitsparameter:
* **Keycloak-Server URL:** `http://localhost:8080`
* **Realm-Name:** `smartreserve`
* **Client-Name:** `smartreserve`
* **Rollenkonfiguration:** `ROLE_admin` (für Administratoren) und `ROLE_guest` (für Gäste)

### B. API-Schnittstelle (Backend):
* **Backend API URL:** `http://localhost:9090`
* **Standard-Verbindungstyp:** JSON REST API über Bearer JWT-Autorisierung

### C. Backend & Datenbank (PostgreSQL):
* **Datenbankname:** `m-295-smartreserve`
* **Datenbank-Port:** `5432`
* **Verbindungstyp:** JDBC (`jdbc:postgresql://localhost:5432/m-295-smartreserve`)
* **Standard-Benutzername:** `postgres`
* **Standard-Passwort:** `admin`
* **Hibernate ddl-auto:** `update`

### D. Befehlsübersicht (Frontend):
* **Lokalen Server starten:** `npm run start` (navigiert zu `http://localhost:4200/`)
* **Produktionsbuild erstellen:** `npm run build` (erzeugt Code im Verzeichnis `dist/`)
* **Linter ausführen:** `npm run lint` (überprüft Codequalität und TypeScript-Konformität)
* **Vitest Testsuite starten:** `npm run test` (führt alle 14/14 Unit-Tests aus)

### E. Befehlsübersicht (Backend):
* **Spring Boot starten:** `./mvnw spring-boot:run` oder über Ihre Java-IDE
