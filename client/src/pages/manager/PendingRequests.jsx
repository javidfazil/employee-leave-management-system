import { useCallback, useEffect, useState } from "react";

import LeaveDecisionModal from "../../components/manager/LeaveDecisionModal.jsx";
import LeaveRequestCard from "../../components/manager/LeaveRequestCard.jsx";
import LeaveRequestTable from "../../components/manager/LeaveRequestTable.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import useToast from "../../context/useToast.js";
import { decideRequest, getRequests } from "../../services/managerService.js";

const PendingRequests = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState(null);
  const [decision, setDecision] = useState("approve");
  const [remark, setRemark] = useState("");
  const loadRequests = useCallback(async () => { try { setIsLoading(true); setRequests(await getRequests("Pending")); } catch { showToast("Unable to load pending requests."); } finally { setIsLoading(false); } }, [showToast]);
  useEffect(() => { void Promise.resolve().then(loadRequests); }, [loadRequests]);
  const openDecision = (request, action) => { setReview(request); setDecision(action); setRemark(""); };
  const submitDecision = async (event) => { event.preventDefault(); try { await decideRequest(review._id, decision, remark); showToast(`Leave request ${decision === "approve" ? "permitted" : "rejected"}.`); setReview(null); void loadRequests(); } catch (error) { showToast(error.response?.data?.message || "Unable to update leave request."); } };

  return <section className="page"><div className="page-heading"><div><span className="eyebrow">REQUEST REVIEW</span><h1>Pending Requests</h1><p>Review employee leave requests awaiting a manager decision.</p></div></div><section className="card table-card">{isLoading ? <div className="loading-wrap"><LoadingSpinner /></div> : requests.length ? <><LeaveRequestTable requests={requests} onDecide={openDecision} showAppliedDate /><div className="manager-request-cards">{requests.map((request) => <LeaveRequestCard key={request._id} request={request} onDecide={openDecision} />)}</div></> : <EmptyState title="No pending requests" message="New employee leave requests will appear here." />}</section>{review && <LeaveDecisionModal request={review} decision={decision} remark={remark} onRemarkChange={setRemark} onClose={() => setReview(null)} onSubmit={submitDecision} />}</section>;
};

export default PendingRequests;
