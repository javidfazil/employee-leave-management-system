import { useCallback, useEffect, useState } from "react";

import LeaveRequestTable from "../../components/manager/LeaveRequestTable.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import useToast from "../../context/useToast.js";
import { getRequests } from "../../services/managerService.js";

const RejectedRequests = () => {
  const { showToast } = useToast(); const [requests, setRequests] = useState([]); const [isLoading, setIsLoading] = useState(true);
  const loadRequests = useCallback(async () => { try { setIsLoading(true); setRequests(await getRequests("Rejected")); } catch { showToast("Unable to load rejected requests."); } finally { setIsLoading(false); } }, [showToast]);
  useEffect(() => { void Promise.resolve().then(loadRequests); }, [loadRequests]);
  return <section className="page"><div className="page-heading"><div><span className="eyebrow">REQUEST HISTORY</span><h1>Rejected Requests</h1><p>Employee leave requests that were not permitted.</p></div></div><section className="card table-card">{isLoading ? <div className="loading-wrap"><LoadingSpinner /></div> : requests.length ? <LeaveRequestTable requests={requests} /> : <EmptyState title="No rejected requests" message="Rejected leave requests will appear here." />}</section></section>;
};

export default RejectedRequests;
