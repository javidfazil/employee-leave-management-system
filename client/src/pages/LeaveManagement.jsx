import { useCallback, useEffect, useState } from "react";

import api from "../api/api.js";
import ConfirmationDialog from "../components/ui/ConfirmationDialog.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import Modal from "../components/ui/Modal.jsx";
import useAuth from "../context/useAuth.js";
import useToast from "../context/useToast.js";

const formatDate = (date) => new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
const getToday = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

const getDuration = (startDate, endDate) => {
  if (!startDate || !endDate || startDate > endDate) return null;

  return Math.round((new Date(`${endDate}T00:00:00.000Z`) - new Date(`${startDate}T00:00:00.000Z`)) / 86_400_000) + 1;
};

const LeaveManagement = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [leaves, setLeaves] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState({ fromDate: "", toDate: "" });
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [leaveToCancel, setLeaveToCancel] = useState(null);
  const [reviewLeave, setReviewLeave] = useState(null);
  const [reviewAction, setReviewAction] = useState("approve");
  const [form, setForm] = useState({ leaveType: "casual", startDate: "", endDate: "", reason: "" });
  const [dateError, setDateError] = useState("");
  const [remark, setRemark] = useState("");
  const duration = getDuration(form.startDate, form.endDate);
  const today = getToday();

  const loadLeaves = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint = user.role === "manager" ? "/leaves" : "/leaves/my";
      const { data } = await api.get(endpoint, { params: { page, limit: 10, ...filters } });
      setLeaves(data.leaves);
      setPagination(data.pagination);
    } catch {
      showToast("Unable to load leave requests.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, showToast, user.role]);

  useEffect(() => {
    void Promise.resolve().then(loadLeaves);
  }, [loadLeaves]);

  const applyLeave = async (event) => {
    event.preventDefault();
    if (form.startDate < today) {
      setDateError("Start date must be today or later.");
      return;
    }
    if (form.endDate < form.startDate) {
      setDateError("End date cannot be before the start date.");
      return;
    }
    try {
      await api.post("/leaves", form);
      setForm({ leaveType: "casual", startDate: "", endDate: "", reason: "" });
      setDateError("");
      setIsApplyOpen(false);
      showToast("Leave request submitted.");
      setPage(1);
      void loadLeaves();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to submit leave request.");
    }
  };

  const updateLeaveDate = (field, value) => {
    const nextForm = { ...form, [field]: value };

    if (field === "startDate" && value < today) {
      setDateError("Start date must be today or later.");
    } else if (field === "endDate" && value && value < form.startDate) {
      setDateError("End date cannot be before the start date.");
    } else {
      setDateError("");
    }

    if (field === "startDate" && form.endDate && form.endDate < value) nextForm.endDate = "";
    setForm(nextForm);
  };

  const cancelLeave = async () => {
    try {
      await api.patch(`/leaves/${leaveToCancel._id}/cancel`);
      setLeaveToCancel(null);
      showToast("Leave request cancelled.");
      void loadLeaves();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to cancel leave request.");
    }
  };

  const reviewRequest = async (event) => {
    event.preventDefault();
    try {
      await api.patch(`/leaves/${reviewLeave._id}/${reviewAction}`, { managerRemark: remark });
      setReviewLeave(null);
      setRemark("");
      showToast(`Leave request ${reviewAction}d.`);
      void loadLeaves();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to update leave request.");
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div><span className="eyebrow">{user.role === "manager" ? "REQUEST ADMINISTRATION" : "LEAVE MANAGEMENT"}</span><h1>{user.role === "manager" ? "Leave Request Administration" : "My Leave History"}</h1><p>{user.role === "manager" ? "Review leave requests, record decisions, and support team availability." : "Submit, track, and manage your leave requests in one place."}</p></div>
        {user.role === "employee" && <button className="button button--primary" type="button" onClick={() => setIsApplyOpen(true)}>Submit Leave Request</button>}
      </div>
      <div className="leave-toolbar card">
        <div className="leave-filters">
          <label>From<input type="date" value={filters.fromDate} onChange={(event) => { const fromDate = event.target.value; setFilters({ fromDate, toDate: filters.toDate < fromDate ? "" : filters.toDate }); setPage(1); }} /></label>
          <label>To<input type="date" min={filters.fromDate} value={filters.toDate} onChange={(event) => { setFilters({ ...filters, toDate: event.target.value }); setPage(1); }} /></label>
          {(filters.fromDate || filters.toDate) && <button className="text-button" type="button" onClick={() => { setFilters({ fromDate: "", toDate: "" }); setPage(1); }}>Clear filters</button>}
        </div>
        <span>{pagination?.total ?? 0} request{pagination?.total === 1 ? "" : "s"}</span>
      </div>
      <section className="card table-card">
      {isLoading ? <div className="loading-wrap"><LoadingSpinner /></div> : leaves.length === 0 ? <EmptyState title="No leave history available" message="Your submitted leave requests will appear here." /> : <div className="table-wrap"><table><thead><tr>{user.role === "manager" && <th>Employee</th>}<th>Leave type</th><th>Dates</th><th>Days</th><th>Status</th><th>{user.role === "manager" ? "Decision" : ""}</th></tr></thead><tbody>{leaves.map((leave) => <tr key={leave._id}>{user.role === "manager" && <td><strong>{leave.employee?.name || "Former employee"}</strong><small>{leave.employee?.email}</small></td>}<td><span className="leave-type">{leave.leaveType}</span></td><td>{formatDate(leave.startDate)} – {formatDate(leave.endDate)}</td><td>{leave.totalDays}</td><td><span className={`status status--${leave.status.toLowerCase()}`}>{leave.status}</span></td><td>{user.role === "manager" && leave.status === "Pending" ? <div className="table-actions"><button className="text-button" onClick={() => { setReviewLeave(leave); setReviewAction("approve"); }}>Approve Request</button><button className="text-button text-button--gold" onClick={() => { setReviewLeave(leave); setReviewAction("reject"); }}>Decline Request</button></div> : user.role === "employee" && leave.status === "Pending" ? <button className="text-button text-button--gold" onClick={() => setLeaveToCancel(leave)}>Withdraw Request</button> : "—"}</td></tr>)}</tbody></table></div>}
      </section>
      {pagination?.totalPages > 1 && <nav className="pagination" aria-label="Leave request pages">
        <button className="button button--secondary" type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button className="button button--primary" type="button" disabled={page === pagination.totalPages} onClick={() => setPage((current) => current + 1)}>Next</button>
      </nav>}
      {isApplyOpen && <Modal title="Submit Leave Request" onClose={() => { setDateError(""); setIsApplyOpen(false); }}><form className="modal-form" onSubmit={applyLeave}><label>Leave type<select value={form.leaveType} onChange={(event) => setForm({ ...form, leaveType: event.target.value })}><option value="casual">Casual leave</option><option value="sick">Sick leave</option><option value="earned">Earned leave</option></select></label><div className="form-grid"><label>Start date<input type="date" min={today} value={form.startDate} onChange={(event) => updateLeaveDate("startDate", event.target.value)} required /></label><label>End date<input type="date" min={form.startDate || today} value={form.endDate} onChange={(event) => updateLeaveDate("endDate", event.target.value)} required /></label></div>{dateError && <p className="form-error" role="alert">{dateError}</p>}{duration && <p className="form-hint">Duration: <strong>{duration} day{duration === 1 ? "" : "s"}</strong></p>}<label>Reason<textarea rows="4" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} required /></label><div className="modal__actions"><button className="button button--secondary" type="button" onClick={() => { setDateError(""); setIsApplyOpen(false); }}>Cancel</button><button className="button button--primary" type="submit">Submit Request</button></div></form></Modal>}
      {leaveToCancel && <ConfirmationDialog title="Withdraw leave request?" description="This will withdraw your pending leave request." onCancel={() => setLeaveToCancel(null)} onConfirm={cancelLeave} />}
      {reviewLeave && <Modal title={`${reviewAction === "approve" ? "Approve" : "Decline"} Request`} onClose={() => setReviewLeave(null)}><form className="modal-form" onSubmit={reviewRequest}><p className="modal-form__copy">{reviewLeave.employee?.name} requested {reviewLeave.totalDays} day(s) of {reviewLeave.leaveType} leave.</p><label>Manager remark <span>(optional)</span><textarea rows="4" value={remark} onChange={(event) => setRemark(event.target.value)} /></label><div className="modal__actions"><button className="button button--secondary" type="button" onClick={() => setReviewLeave(null)}>Cancel</button><button className="button button--primary" type="submit">{reviewAction === "approve" ? "Approve Request" : "Decline Request"}</button></div></form></Modal>}
    </section>
  );
};

export default LeaveManagement;
