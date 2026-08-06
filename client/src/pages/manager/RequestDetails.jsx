import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Card from "../../components/ui/Card.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import useToast from "../../context/useToast.js";
import { decideRequest, getRequestById } from "../../services/managerService.js";

const formatDate = (date, withTime = false) =>
  new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...(withTime && { hour: "numeric", minute: "2-digit" }),
  }).format(new Date(date));

// Request Details page (/manager/requests/:id) — full employee context
// alongside the request, with Approve / Reject actions.
const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [request, setRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [remark, setRemark] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRequest = useCallback(async () => {
    try {
      setIsLoading(true);
      setRequest(await getRequestById(id));
    } catch {
      showToast("Unable to load this leave request.");
    } finally {
      setIsLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    void Promise.resolve().then(loadRequest);
  }, [loadRequest]);

  const decide = async (decision) => {
    try {
      setIsSubmitting(true);
      await decideRequest(id, decision, remark);
      showToast(`Leave request ${decision === "approve" ? "approved" : "rejected"}.`);
      navigate(`/manager/requests?status=${decision === "approve" ? "Approved" : "Rejected"}`);
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to update leave request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="page">
        <div className="loading-wrap">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (!request) {
    return (
      <section className="page">
        <p>This leave request could not be found.</p>
        <Link className="text-button" to="/manager/requests">
          ← Back to requests
        </Link>
      </section>
    );
  }

  const employee = request.employee || {};
  const isPending = request.status === "Pending";

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <Link className="text-button" to="/manager/requests">
            ← Back to requests
          </Link>
          <span className="eyebrow">REQUEST DETAILS</span>
          <h1>{employee.name || "Former employee"}'s leave request</h1>
          <p>
            Status: <span className={`status status--${request.status.toLowerCase()}`}>{request.status}</span>
          </p>
        </div>
      </div>

      <div className="profile-grid">
        <Card className="profile-details">
          <h2>Employee details</h2>
          <div className="details-list">
            <div>
              <span>Name</span>
              <strong>{employee.name || "—"}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{employee.email || "—"}</strong>
            </div>
            <div>
              <span>Department</span>
              <strong>{employee.department || "Not specified"}</strong>
            </div>
          </div>
          <h2>Current leave balance</h2>
          <div className="details-list">
            <div>
              <span>Casual</span>
              <strong>{employee.leaveBalance?.casual ?? "—"} days</strong>
            </div>
            <div>
              <span>Sick</span>
              <strong>{employee.leaveBalance?.sick ?? "—"} days</strong>
            </div>
            <div>
              <span>Earned</span>
              <strong>{employee.leaveBalance?.earned ?? "—"} days</strong>
            </div>
          </div>
        </Card>

        <Card className="profile-details">
          <h2>Leave request details</h2>
          <div className="details-list">
            <div>
              <span>Leave type</span>
              <strong className="leave-type">{request.leaveType}</strong>
            </div>
            <div>
              <span>From</span>
              <strong>{formatDate(request.startDate)}</strong>
            </div>
            <div>
              <span>To</span>
              <strong>{formatDate(request.endDate)}</strong>
            </div>
            <div>
              <span>Total</span>
              <strong>
                {request.totalDays} day{request.totalDays === 1 ? "" : "s"}
              </strong>
            </div>
            <div>
              <span>Reason</span>
              <strong>{request.reason}</strong>
            </div>
            <div>
              <span>Submitted</span>
              <strong>{formatDate(request.createdAt, true)}</strong>
            </div>
            {request.managerRemark && (
              <div>
                <span>Manager remark</span>
                <strong>{request.managerRemark}</strong>
              </div>
            )}
          </div>
        </Card>
      </div>

      {isPending && (
        <Card className="profile-details">
          <h2>Decision</h2>
          <label>
            Manager remark <span>(optional)</span>
            <textarea rows="4" value={remark} onChange={(event) => setRemark(event.target.value)} />
          </label>
          <div className="modal__actions">
            <button
              className="button button--secondary"
              type="button"
              disabled={isSubmitting}
              onClick={() => decide("reject")}
            >
              Reject Leave
            </button>
            <button
              className="button button--primary"
              type="button"
              disabled={isSubmitting}
              onClick={() => decide("approve")}
            >
              Approve Leave
            </button>
          </div>
        </Card>
      )}
    </section>
  );
};

export default RequestDetails;
