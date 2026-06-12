# SmartReserve - Frontend Application

SmartReserve is a modern, enterprise-grade, role-based scheduling and resource reservation application. It is designed to streamline service discovery and manage bookings dynamically with clean user workflows and strict access controls. 

The application is built on **Angular 21 (Standalone Component Architecture)**, utilizing modern reactive patterns such as **Signals** and **RxJS streams**, and is protected by robust **Keycloak OAuth2 Single Sign-On (SSO)**.

---

## 🛠️ Technology Stack
* **Frontend Framework:** Angular 21 (Standalone Components, Signals, Reactive Form Groups)
* **Design & Styling:** SCSS (Sass), Tailwind CSS utility mappings, Responsive layout grids
* **Security & IAM:** Keycloak (OAuth2 Authorization Code Flow, JWT validation, Client-level role extraction)
* **Routing & Guards:** Angular Router with dynamic state preservation and Role Guards
* **Test Suite:** Vitest (14/14 automated specs verifying services, guards, interceptors, and components)

---

## 🔐 Architecture & Security Integration
SmartReserve enforces security at the boundary of every state transition and API boundary:
1. **Dynamic Authentication State (`KeycloakService`):** Orchestrates handshakes and tokens, binding client-level roles (`ROLE_admin`, `ROLE_guest`) to conditional template views.
2. **Access Guards (`authGuard`):** Protects routes on load by intercepting transitions and redirecting unauthorized clients to Keycloak's login interface.
3. **Implicit Interceptors (`authInterceptor`):** Automatically appends standard `Bearer JWT` headers to all outgoing backend API endpoints.
4. **Resilient Data Access:** Decouples layouts from HTTP operations using dedicated client services.

---

## 📖 User Functions & Documentation Guide
The following section provides a comprehensive walkthrough of the application's core capabilities, accompanied by visual placeholders for documentation and grading purposes.

---

### 1. Unified Authentication & Role-Based Navigation
Upon visiting the application, guests can securely log in via Keycloak. Once authenticated, the navigation bar dynamically updates to greet the user and conditionally expose features (such as Administrative tools) based on their assigned roles.

* **Features:**
  - One-click Login/Logout redirection.
  - Seamless background token refreshes.
  - Role-based conditional layout rendering (Admins see advanced management tabs; guests see booking views).

#### 📸 User Authentication view
```
+-------------------------------------------------------------------------------+
|                                                                               |
|                   [ PLACEHOLDER: USER AUTHENTICATION SCREENSHOT ]             |
|                                                                               |
|   Shows: Navigation Bar, Logged-in Username, Dynamic Log Out button, and      |
|   the greeting panel.                                                         |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

### 2. Service Exploration Directory
The landing page displays an elegant grid of all services offered by the platform. Guests and Admins can browse descriptions, session durations, and buffers easily.

* **Features:**
  - Interactive card-grid with focus and hover state transitions.
  - Fully keyboard-accessible controls (`tabindex` and Keyboard trigger bindings).
  - Prominent durations and break time counters.

#### 📸 Service Explorer Panel
```
+-------------------------------------------------------------------------------+
|                                                                               |
|                   [ PLACEHOLDER: SERVICE EXPLORER SCREENSHOT ]                |
|                                                                               |
|   Shows: Grid layout of available services with title headers, descriptions,  |
|   session duration counters, and keyboard-friendly CTA selectors.             |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

### 3. Smart Slot Calendar (Guest Booking)
Selecting a service opens an interactive, step-by-step reservation wizard. Guests select a target date on an inline calendar, which fetches real-time backend availability, lists unreserved intervals, and registers a booking.

* **Features:**
  - Active day state highlighted on the calendar.
  - Chronological grid of available booking intervals.
  - Unified local timezone handling (bypasses UTC shifts to preserve chosen hours).

#### 📸 Booking Selection View
```
+-------------------------------------------------------------------------------+
|                                                                               |
|                   [ PLACEHOLDER: SLOT BOOKING SELECTOR SCREENSHOT ]           |
|                                                                               |
|   Shows: Calendar date selector, real-time hourly intervals, dynamic          |
|   selection summary card, and the checkout action buttons.                    |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

### 4. Personal Reservation Manager (Guest View)
Guests can keep track of all their registered appointments in a centralized dashboard. The view calculates session boundaries and handles on-the-fly cancellations safely.

* **Features:**
  - Clear lists sorted by upcoming reservation times.
  - Precise start and end time boundaries (calculated seamlessly).
  - Native confirmation-guarded cancellation pipelines.

#### 📸 Guest Reservations Dashboard
```
+-------------------------------------------------------------------------------+
|                                                                               |
|                [ PLACEHOLDER: GUEST RESERVATION MANAGER SCREENSHOT ]          |
|                                                                               |
|   Shows: List of bookings, current reservation statuses (PENDING, CONFIRMED,  |
|   CANCELLED), and the interactive cancellation prompt.                        |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

### 5. Service Configuration Form (Admin Workspace)
Administrators have access to a robust interface for drafting, publishing, and modifying services. This workspace utilizes Angular FormGroups to provide immediate front-end validations and strict payload mappings.

* **Features:**
  - Field validators (minimum length, positive numbers, non-empty bounds).
  - Dual modes (Create vs. Edit) matching separate database entity structures.
  - Clean cancel/discard guard states to prevent accidental loss of work.

#### 📸 Service Editing/Creation View
```
+-------------------------------------------------------------------------------+
|                                                                               |
|                [ PLACEHOLDER: SERVICE CONFIGURATION FORM SCREENSHOT ]         |
|                                                                               |
|   Shows: Admin workspace, service details form, validation boundary markers,  |
|   and submit/cancel controls.                                                 |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

### 6. Global Reservations Directory & Registry (Admin Workspace)
Admins have access to a master database of all reservation entries across the entire platform. This panel enables direct status modifications, appointment rescheduling, and absolute administrative deletion controls.

* **Features:**
  - Complete master list of active platform-wide reservations.
  - Live status editor dropdowns (instantly synchronizes status updates with the DB).
  - Rescheduling controls mapped to strict backend `AdminReservationRequestDTO` structures.
  - Deletion triggers guarded by warning screens to maintain database reference integrity.

#### 📸 Administrative Reservation Directory
```
+-------------------------------------------------------------------------------+
|                                                                               |
|                [ PLACEHOLDER: ADMIN RESERVATIONS DIRECTORY SCREENSHOT ]       |
|                                                                               |
|   Shows: Master listing of reservations, editable fields, selection dropdowns  |
|   for status flags, and deletion safety warning gates.                        |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

## 🚀 Execution & Commands Reference

### Launch Development Server
```bash
npm run start
```
*Navigates to `http://localhost:4200/`*

### Run Production Builds
```bash
npm run build
```

### Run Linter & Quality Gates
```bash
npm run lint
```

### Execute Automated Test Suite (Vitest)
```bash
npm run test
```
