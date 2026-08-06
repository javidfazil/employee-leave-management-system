import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ApprovalModal from "../../components/manager/ApprovalModal.jsx";
import LeaveRequestTable from "../../components/manager/LeaveRequestTable.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import useToast from "../../context/useToast.js";
import { decideRequest, getRequests } from "../../services/managerService.js";

const TABS = [
  { status: "Pending", label: "Pending" },
  { status: "Approved", label: "Approved" },
  { status: "Rejected", label: "Rejected" },
];

// Manager Requests page (/manager/requests) — every employee leave request
// shows up here, filterable by status, with Approve / Reject actions.
const ManagerRequests = () => {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const status = TABS.some((tab) => tab.status === searchParams.get("status"))
    ? searchParams.get("status")
    : "Pending";

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState(null);
  const [decision, setDecision] = useState("approve");
  const [remark, setRemark] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setRequests(await getRequests(status));
    } catch {
      showToast(`Unable to load ${status.toLowerCase()} requests.`);
    } finally {
      setIsLoading(false);
    }
  }, [showToast, status]);

  useEffect(() => {
    void Promise.resolve().then(loadRequests);
  }, [loadRequests]);

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
      void loadRequests();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to update leave request.");
    }
  };

  const emptyCopy = useMemo(
    () => ({
      Pending: { title: "No pending requests", message: "New employee leave requests will appear here." },
      Approved: { title: "No approved requests", message: "Approved leave requests will appear here." },
      Rejected: { title: "No rejected requests", message: "Rejected leave requests will appear here." },
    }),
    []
  );

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">REQUEST REVIEW</span>
          <h1>Leave Requests</h1>
          <p>Review employee leave requests and record your decision.</p>
        </div>
      </div>
      <div className="tabs" role="tablist" aria-label="Filter requests by status">
        {TABS.map((tab) => (
          <button
            key={tab.status}
            type="button"
            role="tab"
            aria-selected={status === tab.status}
            className={`tab ${status === tab.status ? "tab--active" : ""}`}
            onClick={() => setSearchParams({ status: tab.status })}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <section className="card table-card">
        {isLoading ? (
          <div className="loading-wrap">
            <LoadingSpinner />
          </div>
        ) : requests.length ? (
          <LeaveRequestTable
            requests={requests}
            onDecide={status === "Pending" ? openDecision : undefined}
            showAppliedDate={status === "Pending"}
          />
        ) : (
          <EmptyState title={emptyCopy[status].title} message={emptyCopy[status].message} />
        )}
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
    </section>
  );
};

export default ManagerRequests;
