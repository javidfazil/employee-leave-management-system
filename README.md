# Employee Leave Management System

A MERN leave-management application with JWT authentication, role-based employee and manager workspaces, leave approval workflows, notifications, pagination, and date filters.

## Features

- Role-selection entry screen with separate Employee and Manager login experiences.
- JWT authentication using one login API; the selected role is verified against the stored account role.
- Employee dashboard, leave balances, leave application, request tracking, and cancellation.
- Manager dashboard, request review, approvals/rejections, and optional remarks.
- Balances start at Casual 12, Sick 8, Earned 15 and are deducted only when approved.
- In-app notifications with unread counts for submitted, approved, rejected, and cancelled leave activity.
- Paginated leave requests with start-date range filters.

## Installation

1. Install dependencies in each app:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
2. Copy `server/.env.example` to `server/.env` and set its values.
3. Start MongoDB, then seed the supplied accounts:
   ```bash
   cd server && npm run seed
   ```
4. In separate terminals, run `npm run dev` in `server` and `client`.

## Environment variables

See `server/.env.example`:

- `PORT` – API port (default `5000`)
- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – long, private signing secret
- `JWT_EXPIRES_IN` – token lifetime
- `CLIENT_URL` – Vite client URL for CORS

The client optionally accepts `VITE_API_URL` (defaults to `http://localhost:5000/api`).

## Seed credentials

| Role | Email | Password |
| --- | --- | --- |
| Employee | `alice@example.com` | `Password123!` |
| Manager | `manager@example.com` | `Password123!` |

## Folder structure

```text
client/src/     pages, components, context, api, routing
server/         routes, controllers, services, models, middleware, validations
server/seed/    repeatable local sample data
```

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register an employee |
| POST | `/api/auth/login` | Log in with `email`, `password`, and `selectedRole` |
| GET | `/api/auth/me` | Current user |
| GET | `/api/dashboard/employee` | Employee dashboard |
| GET | `/api/dashboard/manager` | Manager dashboard |
| POST/GET | `/api/leaves`, `/api/leaves/my` | Create/list leave requests (`page`, `limit`, `fromDate`, `toDate`) |
| PATCH | `/api/leaves/:leaveId/approve`, `/reject`, `/cancel` | Update a leave request |
| GET/PATCH/DELETE | `/api/notifications` | Read and manage notifications |
