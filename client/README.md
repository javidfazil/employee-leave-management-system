# Employee Leave Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) application for managing employee leave requests, built with role-based access control, JWT authentication, and a clean layered architecture.

Employees can apply for leave, track request status, and view their leave balance. Managers can review, approve, or reject requests with remarks, and monitor team leave activity from a dedicated dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Seed Credentials](#seed-credentials)
- [API Reference](#api-reference)
- [Leave Balance Rules](#leave-balance-rules)
- [Validation & Security](#validation--security)
- [Bonus Features Implemented](#bonus-features-implemented)

---

## Features

### Authentication
- JWT-based authentication with role verification (Employee / Manager)
- Role-selection entry screen with separate login flows per role
- Protected routes on both client and server

### Employee Workspace
- Dashboard with total leave balance, pending, approved, and rejected request counts
- Apply for leave (leave type, start date, end date, reason) with auto-calculated duration
- Validation: start date ≤ end date, no past dates, sufficient balance required
- View all submitted requests; cancel requests that are still pending

### Manager Workspace
- Dashboard with pending approvals, approved leaves, and employees on leave today
- Review, approve, or reject leave requests with optional manager remarks
- Employee directory view

### Leave Balance
- Initial balances: **Casual 12 · Sick 8 · Earned 15**
- Balance is deducted only on approval
- Rejected or pre-approval cancelled requests do not affect balance

### Notifications
- In-app notifications for submitted, approved, rejected, and cancelled leave events
- Real-time unread count synced across the app via shared context

### Data & Filtering
- Paginated leave request lists
- Date-range filtering (from/to)

---

## Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React (Vite), React Router, Context API           |
| Backend    | Node.js, Express.js                               |
| Database   | MongoDB with Mongoose                              |
| Auth       | JWT, bcrypt password hashing                       |
| Architecture | Layered backend (Routes → Controllers → Services → Models → Middleware) |

---

## Project Structure