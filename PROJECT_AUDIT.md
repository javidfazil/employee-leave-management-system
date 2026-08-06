# Project Audit

**Scope:** all tracked repository files were reviewed, including client and server source, configuration, lockfiles, and assets. Generated `node_modules` and `dist` directories are ignored by Git and are not source-of-truth project files. The repository contains no assignment brief or rubric; the compliance assessment below uses requirements inferable from the README and implemented domain.

## 1. Project Overview

LeaveFlow is a MERN employee leave-management application. The React/Vite client communicates with an Express/MongoDB API using JWT bearer authentication. Employees can register, apply for and cancel leave, view balances/dashboards, and manage notifications. Managers can view team requests and approve or reject pending requests.

## 2. Folder Structure

```text
employee-leave-management-system/
├── client/                 React 19 + Vite SPA
│   ├── src/
│   │   ├── api/            Axios client
│   │   ├── components/     Layout, route guard, shared UI
│   │   ├── context/        Authentication and toast state
│   │   └── pages/          Auth, dashboard, leave, profile, notifications
│   └── public/             SVG assets
├── server/                 Express + MongoDB API
│   ├── config/             Database connection
│   ├── controllers/        Auth, leave, dashboard, notification handlers
│   ├── middleware/         JWT and error middleware
│   ├── models/             User, Leave, Notification schemas
│   ├── routes/             REST endpoints
│   ├── validations/        Request validation
│   └── utils/              JWT utility
└── README.md
```

Several planned server folders/files (`services/`, `seed/`, `roleMiddleware.js`, `asyncHandler.js`, `errorHandler.js`, and two utilities) exist but are empty and unused.

## 3. Completed Features

- JWT registration, login, protected current-user endpoint, and password hashing with bcrypt.
- Employee and manager role separation in routes and client navigation.
- Leave application with leave-type selection, date validation, overlap prevention, balance checks, approval, rejection, and cancellation.
- Leave-balance accounting for approvals and restored balance after an approved leave is cancelled.
- Employee and manager dashboards backed by API summary endpoints.
- In-app notifications for applications, decisions, and cancellations, including read, read-all, and delete operations.
- Protected React routes, responsive shell/navigation, auth forms, leave table/modals, profile view, loading/empty states, and toast feedback.
- MongoDB schemas for users, leave requests, and notifications.

## 4. Partially Implemented Features

- **User profile:** read-only display only; no edit-profile, password change, or avatar capability.
- **Notifications UI:** read/delete operations work on success but lack error handling, so a failed request can result in misleading local UI state.
- **Dashboards:** API data and summary cards work, but dashboard loading has no dedicated spinner and the “View all” links point to a nonexistent `#all-requests` anchor.
- **Manager workflow:** managers can approve/reject and optionally remark, but there are no filters, search, pagination, employee-specific review scope, or audit history.
- **Documentation and operations:** a minimal README and `.env.example` exist, but there are no setup instructions, endpoint documentation, role/seed instructions, tests, or deployment guidance.
- **Architecture:** controller/model/route separation is present, but the declared service and seed layers are empty and unused.

## 5. Missing Features

- Automated unit, integration, API, and end-to-end tests.
- Password reset/change, email verification, account management, and manager provisioning workflow.
- Leave policies such as weekends/holidays, half days, attachment support, configurable balances/types, and leave history exports.
- Pagination, filtering, searching, and reporting for requests and notifications.
- Email/push delivery, real-time notification updates, and an unread-count indicator.
- Audit trail recording who approved/rejected and when (beyond generic document timestamps).
- Production hardening: rate limiting, security headers, restricted CORS, structured logging, monitoring, and health checks.
- Complete project documentation and a database seeding implementation.

## 6. Bugs Found

1. **Frontend lint fails:** `npm run lint` returns 4 errors and 3 warnings. Errors include Fast Refresh violations in both context files and `set-state-in-effect` errors in LeaveManagement and Notifications. This prevents a clean quality gate.
2. **Broken dashboard links:** both dashboard pages link to `#all-requests`, but no element uses that ID. The links do not navigate to the leave-management page or a target section.
3. **Notification mutations have no failure path:** `markAllRead`, `markRead`, and `remove` update local state after awaited calls without `try/catch`; network/API failures can surface as unhandled errors and show inaccurate state.
4. **No cross-resource transaction:** approval changes a Leave and then a User balance in separate operations; cancellation has a similar multi-document update. A process/database failure between operations can leave status and balance inconsistent.
5. **No client expiry recovery:** an expired/invalid token yields API failures while the stale user remains in local storage; the app does not automatically clear the session or redirect to sign-in.
6. **Empty duplicate/dead modules:** empty middleware, service, utility, and seed files add misleading architecture and maintenance noise.

## 7. Backend Review

### Authentication

JWT generation and verification are implemented, tokens expire after seven days by default, passwords are hashed with bcrypt (12 rounds), and the protected middleware removes password data from the attached user. Registration creates only employees, which avoids public manager-role elevation. Missing: refresh/revocation strategy, rate limiting, account recovery, and session/device management.

### Models

`User`, `Leave`, and `Notification` models are appropriate and use timestamps. User email is unique and normalized. Leave status and leave type are enumerated. Missing: indexes for common query paths, explicit approval actor/audit data, and richer policy metadata.

### Controllers

Controllers cover the primary workflow and use useful conflict/status responses. Leave overlap and reserved pending-balance checks are thoughtful. However, balance/status multi-document updates are not transactional, list endpoints are unpaginated, and user input constraints rely largely on middleware instead of schema-level limits.

### Routes

REST endpoints are sensibly grouped under `/api/auth`, `/api/leaves`, `/api/dashboard`, and `/api/notifications`. Manager protection is applied to manager leave actions. Dashboard role checks are duplicated locally instead of sharing a middleware.

### Services

The `services` directory has three tracked, zero-byte files. No service layer is implemented; notification helpers and business logic remain in `leaveController.js`.

### Middleware

JWT protection and basic 404/error middleware are functional. `roleMiddleware.js`, `asyncHandler.js`, and `errorHandler.js` are empty. Error responses expose raw error messages and there is no security/rate-limit middleware.

### Validation

Registration, login, leave dates/types/reason, leave IDs, and optional manager remarks are validated. Improvements: maximum name/email/password policies, a date parser used consistently, and schema-level validation/normalization for defense in depth.

### Database

MongoDB connection requires `MONGODB_URI` and fails startup cleanly when absent. The environment example is present. Missing: transactions for leave/balance consistency, indexes, migrations/seeding, backup/observability plan, and connection retry/configuration controls.

## 8. Frontend Review

### Pages

Login, registration, employee dashboard, manager dashboard, leave management, notifications, and profile pages are all implemented. Profile is read-only; dashboards do not show a loading state; error treatment is inconsistent.

### Components

The application has reusable layout, modal, confirmation, card, empty-state, and loading components. The modal lacks focus trapping, Escape-to-close behavior, and focus restoration, limiting keyboard accessibility.

### Routing

React Router protects employee and manager routes and redirects unauthenticated or wrong-role users appropriately. The role-aware home redirect is correct. Dashboard internal “View all” anchors are broken.

### API Integration

Axios centralizes the base URL and adds bearer tokens. Pages call the corresponding backend endpoints. Missing: response interceptor for 401 handling, cancellation/retry behavior, request-state abstraction, and robust errors for notification mutations/profile loading.

### UI

The UI is consistent, responsive at defined breakpoints, and offers accessible labels/focus styles in many controls. It uses text glyphs rather than a cohesive icon set and needs modal keyboard support, a notification badge/count, and validation feedback before submitting leave forms.

## 9. Assignment Compliance

**Important:** no assignment requirements/rubric were included in the repository. The following is an inferred baseline for the stated Employee Leave Management System, not a substitute for the original assignment brief.

| Inferred requirement | Status | Evidence |
|---|---|---|
| MERN client/server application | ✅ Complete | React/Vite client and Express/Mongoose server |
| User registration and login | ✅ Complete | Auth routes, controller, forms, bcrypt/JWT |
| JWT-protected access | ✅ Complete | `protect` middleware and Axios bearer interceptor |
| Employee/manager roles | ✅ Complete | Model enum and route/client role guards |
| Apply leave request | ✅ Complete | Form, POST endpoint, date/balance/overlap validation |
| Approve/reject leave | ✅ Complete | Manager endpoints and review modal |
| Cancel leave and restore balance | ✅ Complete | Employee cancellation endpoint and UI |
| Track leave balances | ✅ Complete | User leave balance, dashboards, approval accounting |
| Employee dashboard | ✅ Complete | Summary and recent leave API/page |
| Manager dashboard | ✅ Complete | Team totals and recent request API/page |
| Notifications | ✅ Complete | Persisted notification API and UI actions |
| Input validation/error handling | 🟡 Partial | Core validation exists; client failures and production error policy are incomplete |
| Responsive user interface | ✅ Complete | Responsive layouts and navigation styles |
| Database seeding/sample data | ❌ Missing | `seedData.js` is empty |
| Automated testing | ❌ Missing | No tests or test scripts |
| Assignment documentation | 🟡 Partial | README only identifies the project; setup/API/rubric documentation absent |

## 10. Bonus Features

| Potential bonus feature | Status | Notes |
|---|---|---|
| Role-based dashboards | ✅ | Separate employee and manager dashboards |
| Notification center | ✅ | Read, read-all, delete, and event-created records |
| Leave-overlap prevention | ✅ | Pending/approved date overlap check |
| Responsive sidebar/mobile navigation | ✅ | Collapsible desktop and mobile overlay navigation |
| Manager remarks | ✅ | Optional remarks on approval/rejection |
| Email/real-time notifications | ❌ | Database notifications only |
| Reports/export/analytics | ❌ | No export/reporting feature |
| Calendar/holiday-aware calculation | ❌ | Calendar-day duration only |
| Search/filter/pagination | ❌ | Lists return all records |
| Seed/demo data | ❌ | Empty seed file |

## 11. Security Review

**Strengths:** bcrypt password hashing, JWT expiration, server-side authorization, role checks, server-side input validation, password omission in protected user queries, and environment-based secrets.

**Risks:** CORS permits every origin; no Helmet/security headers; no login rate limiting or brute-force protection; JWT is held in `localStorage` and is exposed to XSS theft; no refresh/revocation; raw server errors may be returned; and multi-document leave accounting is not transactional. Add request-size limits, a production CORS allowlist, rate limiting, CSP/Helmet, centralized safe error responses/logging, and an httpOnly-cookie or otherwise hardened token strategy.

## 12. Recommended Improvements

1. Fix all lint errors/warnings and add CI quality checks.
2. Add tests for auth, authorization, all leave transitions, balance consistency, notifications, and protected routes.
3. Use MongoDB transactions (or an equivalent robust workflow) for leave status/balance changes.
4. Harden security with Helmet, CORS allowlists, rate limiting, secure secret policies, safe error handling, and a token-expiry/logout response interceptor.
5. Implement pagination/filtering/search plus manager audit fields/history.
6. Add complete README documentation, setup commands, API reference, roles/seed strategy, and a real `seedData.js` or remove empty placeholders.
7. Improve accessibility: modal focus management, Escape support, focus restore, and semantic icons/labels.
8. Implement profile/password management, notification error feedback/unread count, and correct dashboard navigation links.

## 13. Estimated Completion Percentage

**73% complete.** The core workflow and polished primary UI are implemented, but test coverage, operational documentation, production security, data consistency safeguards, and several expected management/usability features remain unfinished.
