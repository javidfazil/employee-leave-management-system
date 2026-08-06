import { Link, Outlet, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import ApprovalModal from "../../components/manager/ApprovalModal.jsx";
import LeaveRequestTable from "../../components/manager/LeaveRequestTable.jsx";
import ManagerNavbar from "../../components/manager/ManagerNavbar.jsx";
import ManagerSidebar from "../../components/manager/ManagerSidebar.jsx";
import ManagerStats from "../../components/manager/ManagerStats.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import Modal from "../../components/ui/Modal.jsx";
import useToast from "../../context/useToast.js";
import { decideRequest, getDashboard, getEmployees, getEmployeesOnLeaveToday, getRequests } from "../../services/managerService.js";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));

const getLeaveBalanceSummary = (employee) => {
  const balances = Object.values(employee.leaveBalance || {}).filter((balance) => typeof balance === "number");

  return balances.length ? `${balances.reduce((total, balance) => total + balance, 0)} leave days available` : null;
};

const detailTitles = {
  Pending: "Pending requests",
  Approved: "Approved leaves",
  Rejected: "Rejected requests",
  onLeaveToday: "Employees on leave today",
};

export const ManagerPortalLayout = () => (
  <div className="app-shell manager-portal">
    <ManagerSidebar />
    <main className="app-shell__content">
      <ManagerNavbar />
      <Outlet />
    </main>
  </div>
);

// Manager Dashboard Home (/manager/dashboard) — overview only.
// Detailed request review lives on the Pending Requests page, not here.
const ManagerDashboard = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [isRequestsLoading, setIsRequestsLoading] = useState(true);
  const [isEmployeesLoading, setIsEmployeesLoading] = useState(true);
  const [review, setReview] = useState(null);
  const [decision, setDecision] = useState("approve");
  const [remark, setRemark] = useState("");
  const [detailType, setDetailType] = useState(null);
  const [detailItems, setDetailItems] = useState([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      setIsDashboardLoading(true);
      const dashboard = await getDashboard();
      setSummary(dashboard.summary);
    } catch {
      showToast("We could not load the manager dashboard. Please refresh.");
    } finally {
      setIsDashboardLoading(false);
    }
  }, [showToast]);

  const loadPendingRequests = useCallback(async () => {
    try {
      setIsRequestsLoading(true);
      setPendingRequests((await getRequests("Pending")).slice(0, 5));
    } catch {
      showToast("Unable to load pending requests.");
    } finally {
      setIsRequestsLoading(false);
    }
  }, [showToast]);

  const loadEmployees = useCallback(async () => {
    try {
      setIsEmployeesLoading(true);
      setEmployees((await getEmployees()).slice(0, 6));
    } catch {
      showToast("Unable to load employees.");
    } finally {
      setIsEmployeesLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void Promise.resolve().then(() => Promise.all([loadDashboard(), loadPendingRequests(), loadEmployees()]));
  }, [loadDashboard, loadEmployees, loadPendingRequests]);

  const openDecision = (request, action) => {
    setReview(request);
    setDecision(action);
    setRemark("");
  };

  const submitDecision = async (event) => {
    event.preventDefault();

    try {
      await decideRequest(review._id, decision, remark);
      showToast(`Leave request ${decision === "approve" ? "approved" : "rejected"}.`);
      setReview(null);
      void Promise.all([loadDashboard(), loadPendingRequests()]);
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to update leave request.");
    }
  };

  const openDetail = async (type) => {
    setDetailType(type);
    setDetailItems([]);
    setIsDetailLoading(true);

    try {
      setDetailItems(type === "onLeaveToday" ? await getEmployeesOnLeaveToday() : await getRequests(type));
    } catch {
      showToast("Unable to load dashboard details.");
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <section className="dashboard-page">
      <div className="page-heading dashboard-hero">
        <div>
          <span className="eyebrow">MANAGER DASHBOARD</span>
          <h1>Approval control center.</h1>
          <p>A snapshot of leave activity across your team.</p>
        </div>
      </div>
      {isDashboardLoading ? (
        <div className="loading-wrap">
          <LoadingSpinner />
        </div>
      ) : (
        <ManagerStats summary={summary} onCardClick={openDetail} />
      )}

      <section className="card table-card panel--wide">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pending Approvals</th>
                <th>Leave type</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isRequestsLoading ? (
                <tr>
                  <td colSpan="6">
                    <div className="loading-wrap">
                      <LoadingSpinner />
                    </div>
                  </td>
                </tr>
              ) : pendingRequests.length ? (
                pendingRequests.map((request) => (
                  <tr key={request._id}>
                    <td>
                      <strong>{request.employee?.name || "Former employee"}</strong>
                    </td>
                    <td><span className="leave-type">{request.leaveType}</span></td>
                    <td>{formatDate(request.startDate)}</td>
                    <td>{formatDate(request.endDate)}</td>
                    <td>{request.totalDays} day{request.totalDays === 1 ? "" : "s"}</td>
                    <td>
                      <div className="table-actions">
                        <button className="text-button" type="button" onClick={() => openDecision(request, "approve")}>Approve</button>
                        <button className="text-button text-button--gold" type="button" onClick={() => openDecision(request, "reject")}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <EmptyState title="All caught up" message="There are no pending leave requests to review." />
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="6">
                  <Link className="text-button" to="/manager/requests">View all requests</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card table-card panel--wide">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Employee Overview</th>
                <th>Department</th>
                <th>Leave activity</th>
              </tr>
            </thead>
            <tbody>
              {isEmployeesLoading ? (
                <tr>
                  <td colSpan="3">
                    <div className="loading-wrap">
                      <LoadingSpinner />
                    </div>
                  </td>
                </tr>
              ) : employees.map((employee) => (
                <tr
                  key={employee._id}
                  role="link"
                  tabIndex="0"
                  aria-label={`View ${employee.name}'s leave history`}
                  onClick={() => navigate(`/manager/employees/${employee._id}/history`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/manager/employees/${employee._id}/history`);
                    }
                  }}
                >
                  <td><strong>{employee.name}</strong></td>
                  <td>{employee.department || "—"}</td>
                  <td>{getLeaveBalanceSummary(employee) || "—"}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3">
                  <Link className="text-button" to="/manager/employees">View full directory</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {review && (
        <ApprovalModal
          request={review}
          decision={decision}
          remark={remark}
          onRemarkChange={setRemark}
          onClose={() => setReview(null)}
          onSubmit={submitDecision}
        />
      )}
      {detailType && (
        <Modal title={detailTitles[detailType]} onClose={() => setDetailType(null)}>
          {isDetailLoading ? (
            <div className="loading-wrap">
              <LoadingSpinner />
            </div>
          ) : detailItems.length ? (
            detailType === "onLeaveToday" ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Leave type</th>
                      <th>End date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailItems.map((leave) => (
                      <tr key={leave._id}>
                        <td><strong>{leave.employee?.name || "Former employee"}</strong></td>
                        <td><span className="leave-type">{leave.leaveType}</span></td>
                        <td>{formatDate(leave.endDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <LeaveRequestTable requests={detailItems} onDecide={undefined} />
            )
          ) : (
            <EmptyState title="No records found" message="There are no records to show right now." />
          )}
        </Modal>
      )}
    </section>
  );
};

export default ManagerDashboard;
