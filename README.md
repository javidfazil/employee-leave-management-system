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

## API documentation

Import [the Postman collection](docs/Employee_Leave_Management.postman_collection.json) and set its `baseUrl` and `token` collection variables. The full endpoint reference is below.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register an employee |
| POST | `/api/auth/login` | Log in with `email`, `password`, and `selectedRole` |
| GET | `/api/auth/me` | Current user |
| GET | `/api/dashboard/employee` | Employee dashboard |
| GET | `/api/dashboard/manager` | Manager dashboard |
| POST | `/api/leaves` | Employee creates a leave request |
| GET | `/api/leaves/my` | Employee leave history (`page`, `limit`, `fromDate`, `toDate`) |
| PATCH | `/api/leaves/:leaveId/cancel` | Employee cancels a pending request |
| GET | `/api/manager/dashboard` | Manager totals, including employees on leave today |
| GET | `/api/manager/requests?status=Pending` | Manager reviews requests by status |
| PATCH | `/api/manager/requests/:leaveId/approve` | Manager approves a pending request (optional `managerRemark`) |
| PATCH | `/api/manager/requests/:leaveId/reject` | Manager rejects a pending request (optional `managerRemark`) |
| GET | `/api/notifications` | Current user's notifications and unread count |
| PATCH | `/api/notifications/read-all` | Mark all current-user notifications as read |
| PATCH | `/api/notifications/:notificationId/read` | Mark one notification as read |
| DELETE | `/api/notifications/:notificationId` | Delete one current-user notification |
