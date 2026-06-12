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
