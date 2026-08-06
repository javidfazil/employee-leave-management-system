import { Outlet } from "react-router-dom";

import ManagerNavbar from "../../components/manager/ManagerNavbar.jsx";
import ManagerSidebar from "../../components/manager/ManagerSidebar.jsx";
import ManagerStats from "../../components/manager/ManagerStats.jsx";
import LeaveDecisionModal from "../../components/manager/LeaveDecisionModal.jsx";
import LeaveRequestTable from "../../components/manager/LeaveRequestTable.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import useToast from "../../context/useToast.js";
import { decideRequest, getDashboard, getRequests } from "../../services/managerService.js";
import { useCallback, useEffect, useState } from "react";

export const ManagerPortalLayout = () => <div className="app-shell manager-portal"><ManagerSidebar /><main className="app-shell__content"><ManagerNavbar /><Outlet /></main></div>;

const ManagerDashboard = () => {
  const { showToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [review, setReview] = useState(null);
  const [decision, setDecision] = useState("approve");
  const [remark, setRemark] = useState("");
  const loadSummary = useCallback(async () => {
    try {
      setIsLoading(true);
      const [dashboard, pendingRequests] = await Promise.all([getDashboard(), getRequests("Pending")]);
      setSummary(dashboard.summary);
      setRequests(pendingRequests);
    } catch {
      setError("We could not load the manager dashboard. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(loadSummary); }, [loadSummary]);
  const openDecision = (request, action) => {
    setReview(request);
    setDecision(action);
    setRemark("");
  };
  const submitDecision = async (event) => {
    event.preventDefault();
    try {
      await decideRequest(review._id, decision, remark);
      showToast(`Leave request ${decision === "approve" ? "permitted" : "rejected"}.`);
      setReview(null);
      void loadSummary();
    } catch (requestError) {
      showToast(requestError.response?.data?.message || "Unable to update leave request.");
    }
  };

  return <section className="dashboard-page"><div className="page-heading dashboard-hero"><div><span className="eyebrow">MANAGER DASHBOARD</span><h1>Leave request oversight.</h1><p>Monitor employee leave requests and make informed workforce decisions.</p></div></div>{error && <p className="form-error">{error}</p>}<ManagerStats summary={summary} /><section className="card table-card manager-dashboard__requests"><div className="section-heading"><div><span className="eyebrow">ACTION REQUIRED</span><h2>Pending Leave Requests</h2></div></div>{isLoading ? <div className="loading-wrap"><LoadingSpinner /></div> : requests.length ? <LeaveRequestTable requests={requests} onDecide={openDecision} /> : <EmptyState title="No pending requests" message="New employee leave requests will appear here." />}</section>{review && <LeaveDecisionModal request={review} decision={decision} remark={remark} onRemarkChange={setRemark} onClose={() => setReview(null)} onSubmit={submitDecision} />}</section>;
};

export default ManagerDashboard;
