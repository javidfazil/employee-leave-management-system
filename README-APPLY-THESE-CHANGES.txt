HOW TO APPLY THIS PACKAGE
==========================

This folder only contains the files that changed. Copy each one into
your real project at the SAME relative path, replacing the existing
file. The folder structure here matches your project exactly, so you
can drag the "server" and "client" folders straight over yours and
overwrite when prompted.

FILES TO REPLACE (19 total)
----------------------------
server/models/User.js
server/services/authService.js
server/services/managerService.js
server/controllers/managerController.js
server/routes/managerRoutes.js

client/src/App.jsx
client/src/App.css
client/src/pages/Login.jsx
client/src/services/managerService.js
client/src/components/manager/ManagerStats.jsx
client/src/components/manager/ApprovalModal.jsx
client/src/components/manager/LeaveRequestTable.jsx
client/src/components/manager/EmployeeTable.jsx
client/src/components/manager/ManagerSidebar.jsx
client/src/pages/manager/ManagerDashboard.jsx
client/src/pages/manager/ManagerRequests.jsx
client/src/pages/manager/RequestDetails.jsx
client/src/pages/manager/ManagerEmployees.jsx
client/src/pages/manager/EmployeeHistory.jsx

FILES TO DELETE (these are no longer used — delete them from YOUR
project, they are not included in this package)
------------------------------------------------------------------
client/src/components/manager/LeaveDecisionModal.jsx
client/src/pages/manager/PendingRequests.jsx
client/src/pages/manager/ApprovedRequests.jsx
client/src/pages/manager/RejectedRequests.jsx

AFTER COPYING
-------------
1. Restart your dev servers (client "npm run dev" and server "npm run
   dev" / "npm start") so nothing is running stale code.
2. Sign out of any account you're logged in as in the browser first —
   old sessions are stored in localStorage and won't refresh on their
   own.
3. Log in as manager@example.com / Password123! via the Manager tab
   to confirm you land on /manager/dashboard.
