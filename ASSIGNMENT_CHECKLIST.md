# Assignment Checklist

## Employee

| Requirement | Status | Implementation |
|---|---|---|
| Dashboard | ✅ Complete | Employee dashboard exposes leave balance, request counts, and recent requests. |
| Apply Leave | ✅ Complete | Employees can submit typed, dated leave requests with a reason. |
| Leave Validation | ✅ Complete | Client and server validate leave type, dates, reason, overlap, and balance. |
| Auto Duration | ✅ Complete | The form displays calculated calendar-day duration; the server calculates and persists the authoritative value. |
| Cancel Pending Leave | ✅ Complete | Employees can cancel pending requests; approved cancellation remains supported and restores the balance. |
| Leave Balance | ✅ Complete | Casual, sick, and earned balances are stored and displayed. |

## Manager

| Requirement | Status | Implementation |
|---|---|---|
| Dashboard | ✅ Complete | Manager dashboard provides employee/request totals and recent requests. |
| Approve Leave | ✅ Complete | Managers can approve pending requests. |
| Reject Leave | ✅ Complete | Managers can reject pending requests. |
| Remarks | ✅ Complete | Managers may include an optional remark with approval or rejection. |
| Employees on Leave Today | ✅ Complete | Manager dashboard displays approved leave records covering the current day. |

## Notifications

| Requirement | Status | Implementation |
|---|---|---|
| Submitted | ✅ Complete | Managers are notified when an employee submits leave. |
| Approved | ✅ Complete | Employees are notified after approval. |
| Rejected | ✅ Complete | Employees are notified after rejection. |
| Cancelled | ✅ Complete | Managers are notified after cancellation. |
| Unread Count | ✅ Complete | Notification API returns `unreadCount` and the top navigation displays it. |

## Leave Rules

| Requirement | Status | Implementation |
|---|---|---|
| No past dates | ✅ Complete | Server rejects leave starts before today; form prevents selecting past dates. |
| Start <= End | ✅ Complete | Both client input constraints and server validation enforce date order. |
| Balance validation | ✅ Complete | Requests are checked against available balance, including pending reservations. |
| Deduct only after approval | ✅ Complete | Balance changes only after a manager approves the request. |
| Restore balance correctly when needed | ✅ Complete | Cancelling an approved leave restores its deducted balance. |

## Validation

| Requirement | Status | Implementation |
|---|---|---|
| Unique email | ✅ Complete | User email is indexed unique and registration detects duplicates. |
| Password hashing | ✅ Complete | Passwords are hashed with bcrypt before persistence. |
| JWT | ✅ Complete | Signed JWTs protect authenticated API access. |
| Proper HTTP status codes | ✅ Complete | Controllers/services and centralized middleware return appropriate success, validation, authentication, authorization, conflict, and not-found statuses. |
| Centralized error handling | ✅ Complete | Express error middleware maps service/database errors to HTTP responses. |
| Input validation | ✅ Complete | Authentication and leave request parameters are validated server-side. |

## Frontend

| Requirement | Status | Implementation |
|---|---|---|
| Protected routes | ✅ Complete | Route guard redirects unauthenticated users. |
| Role-based UI | ✅ Complete | Role-specific dashboards, navigation, leave actions, and route access are enforced. |
| Loading states | ✅ Complete | Leave and notification views provide loading states; dashboards use safe loading placeholders. |
| Error handling | ✅ Complete | Forms, data loads, and notification actions provide failure feedback. |
| Responsive design | ✅ Complete | Layouts adapt for desktop, tablet, and mobile. |

## Backend

| Requirement | Status | Implementation |
|---|---|---|
| Layered architecture | ✅ Complete | Routes delegate to controllers, with services handling authentication, leave calculations/today queries, and notifications. |
| Controllers | ✅ Complete | Auth, leave, dashboard, and notification controllers are implemented. |
| Services | ✅ Complete | Auth, leave, and notification services are implemented and integrated. |
| Models | ✅ Complete | User, Leave, and Notification Mongoose models are implemented. |
| Middleware | ✅ Complete | Authentication, role authorization, not-found, and centralized error middleware are implemented. |
| Validation | ✅ Complete | Auth and leave validation middleware is applied to relevant routes. |
| Routes | ✅ Complete | Auth, leave, dashboard, and notification route modules are wired into the API. |
