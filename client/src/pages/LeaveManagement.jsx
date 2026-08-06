import { useEffect, useState } from "react";

import api from "../api/api.js";
import ConfirmationDialog from "../components/ui/ConfirmationDialog.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import Modal from "../components/ui/Modal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const formatDate = (date) => new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));

const LeaveManagement = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [leaveToCancel, setLeaveToCancel] = useState(null);
  const [reviewLeave, setReviewLeave] = useState(null);
  const [reviewAction, setReviewAction] = useState("approve");
  const [form, setForm] = useState({ leaveType: "casual", startDate: "", endDate: "", reason: "" });
  const [remark, setRemark] = useState("");

  const loadLeaves = async () => {
    setIsLoading(true);
    try {
      const endpoint = user.role === "manager" ? "/leaves" : "/leaves/my";
      const { data } = await api.get(endpoint);
      setLeaves(data.leaves);
    } catch {
      showToast("Unable to load leave requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadLeaves(); }, []);

  const applyLeave = async (event) => {
    event.preventDefault();
    try {
      await api.post("/leaves", form);
      setForm({ leaveType: "casual", startDate: "", endDate: "", reason: "" });
      setIsApplyOpen(false);
      showToast("Leave request submitted.");
      loadLeaves();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to submit leave request.");
    }
  };

  const cancelLeave = async () => {
    try {
      await api.patch(`/leaves/${leaveToCancel._id}/cancel`);
      setLeaveToCancel(null);
      showToast("Leave request cancelled.");
      loadLeaves();
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
      loadLeaves();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to update leave request.");
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div><span className="eyebrow">{user.role === "manager" ? "TEAM LEAVE" : "TIME OFF"}</span><h1>{user.role === "manager" ? "Leave requests" : "My leave requests"}</h1><p>{user.role === "manager" ? "Review and manage leave requests from your team." : "Plan, submit, and follow your time away."}</p></div>
        {user.role === "employee" && <button className="button button--primary" type="button" onClick={() => setIsApplyOpen(true)}>Apply for leave</button>}
      </div>
      <section className="card table-card">
        {isLoading ? <div className="loading-wrap"><LoadingSpinner /></div> : leaves.length === 0 ? <EmptyState title="No leave requests" message="Your leave requests will appear here." /> : <div className="table-wrap"><table><thead><tr>{user.role === "manager" && <th>Employee</th>}<th>Leave type</th><th>Dates</th><th>Days</th><th>Status</th><th>{user.role === "manager" ? "Action" : ""}</th></tr></thead><tbody>{leaves.map((leave) => <tr key={leave._id}>{user.role === "manager" && <td><strong>{leave.employee?.name || "Former employee"}</strong><small>{leave.employee?.email}</small></td>}<td><span className="leave-type">{leave.leaveType}</span></td><td>{formatDate(leave.startDate)} – {formatDate(leave.endDate)}</td><td>{leave.totalDays}</td><td><span className={`status status--${leave.status.toLowerCase()}`}>{leave.status}</span></td><td>{user.role === "manager" && leave.status === "Pending" ? <div className="table-actions"><button className="text-button" onClick={() => { setReviewLeave(leave); setReviewAction("approve"); }}>Approve</button><button className="text-button text-button--gold" onClick={() => { setReviewLeave(leave); setReviewAction("reject"); }}>Reject</button></div> : user.role === "employee" && ["Pending", "Approved"].includes(leave.status) ? <button className="text-button text-button--gold" onClick={() => setLeaveToCancel(leave)}>Cancel</button> : "—"}</td></tr>)}</tbody></table></div>}
      </section>
      {isApplyOpen && <Modal title="Apply for leave" onClose={() => setIsApplyOpen(false)}><form className="modal-form" onSubmit={applyLeave}><label>Leave type<select value={form.leaveType} onChange={(event) => setForm({ ...form, leaveType: event.target.value })}><option value="casual">Casual leave</option><option value="sick">Sick leave</option><option value="earned">Earned leave</option></select></label><div className="form-grid"><label>Start date<input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} required /></label><label>End date<input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} required /></label></div><label>Reason<textarea rows="4" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} required /></label><div className="modal__actions"><button className="button button--secondary" type="button" onClick={() => setIsApplyOpen(false)}>Cancel</button><button className="button button--primary" type="submit">Submit request</button></div></form></Modal>}
      {leaveToCancel && <ConfirmationDialog title="Cancel leave request?" description="This will cancel your leave request. Approved leave will be returned to your balance." onCancel={() => setLeaveToCancel(null)} onConfirm={cancelLeave} />}
      {reviewLeave && <Modal title={`${reviewAction === "approve" ? "Approve" : "Reject"} leave request`} onClose={() => setReviewLeave(null)}><form className="modal-form" onSubmit={reviewRequest}><p className="modal-form__copy">{reviewLeave.employee?.name} requested {reviewLeave.totalDays} day(s) of {reviewLeave.leaveType} leave.</p><label>Manager remark <span>(optional)</span><textarea rows="4" value={remark} onChange={(event) => setRemark(event.target.value)} /></label><div className="modal__actions"><button className="button button--secondary" type="button" onClick={() => setReviewLeave(null)}>Cancel</button><button className="button button--primary" type="submit">{reviewAction === "approve" ? "Approve request" : "Reject request"}</button></div></form></Modal>}
    </section>
  );
};

export default LeaveManagement;
