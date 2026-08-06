import { useCallback, useEffect, useState } from "react";

import LeaveRequestTable from "../../components/manager/LeaveRequestTable.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import useToast from "../../context/useToast.js";
import { getEmployeeHistory, getEmployees } from "../../services/managerService.js";

const ManagerEmployees = () => {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const loadEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setEmployees(await getEmployees());
    } catch {
      showToast("Unable to load employees.");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => { void Promise.resolve().then(loadEmployees); }, [loadEmployees]);

  const viewHistory = async (employeeId) => {
    try {
      setIsHistoryLoading(true);
      setSelectedHistory(await getEmployeeHistory(employeeId));
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to load employee leave history.");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  return <section className="page"><div className="page-heading"><div><span className="eyebrow">EMPLOYEE DIRECTORY</span><h1>Registered Employees</h1><p>Review employee accounts and their complete leave histories.</p></div></div><section className="card table-card">{isLoading ? <div className="loading-wrap"><LoadingSpinner /></div> : employees.length ? <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Department</th><th>Joined</th><th>Leave history</th></tr></thead><tbody>{employees.map((employee) => <tr key={employee._id}><td><strong>{employee.name}</strong><small>{employee.email}</small></td><td>{employee.department || "—"}</td><td>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(employee.createdAt))}</td><td><button className="text-button" type="button" onClick={() => viewHistory(employee._id)}>View history</button></td></tr>)}</tbody></table></div> : <EmptyState title="No employees found" message="Employee accounts will appear here after registration." />}</section>{(isHistoryLoading || selectedHistory) && <section className="card table-card"><div className="section-heading"><div><span className="eyebrow">EMPLOYEE LEAVE HISTORY</span><h2>{selectedHistory?.employee?.name || "Loading history..."}</h2></div></div>{isHistoryLoading ? <div className="loading-wrap"><LoadingSpinner /></div> : selectedHistory.leaves.length ? <LeaveRequestTable requests={selectedHistory.leaves} /> : <EmptyState title="No leave requests" message="This employee has not submitted any leave requests." />}</section>}</section>;
};

export default ManagerEmployees;
