import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Card from "../../components/ui/Card.jsx";
import LeaveRequestTable from "../../components/manager/LeaveRequestTable.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import useToast from "../../context/useToast.js";
import { getEmployeeHistory } from "../../services/managerService.js";

// Employee Leave History (/manager/employees/:employeeId/history)
const EmployeeHistory = () => {
  const { employeeId } = useParams();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setData(await getEmployeeHistory(employeeId));
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to load employee leave history.");
    } finally {
      setIsLoading(false);
    }
  }, [employeeId, showToast]);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  if (isLoading) {
    return (
      <section className="page">
        <div className="loading-wrap">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="page">
        <p>This employee could not be found.</p>
        <Link className="text-button" to="/manager/employees">
          ← Back to directory
        </Link>
      </section>
    );
  }

  const { employee, leaves } = data;

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <Link className="text-button" to="/manager/employees">
            ← Back to directory
          </Link>
          <span className="eyebrow">EMPLOYEE LEAVE HISTORY</span>
          <h1>{employee.name}</h1>
          <p>{employee.email}</p>
        </div>
      </div>

      <Card className="profile-details">
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

      <section className="card table-card">
        {leaves.length ? (
          <LeaveRequestTable requests={leaves} showAppliedDate />
        ) : (
          <EmptyState title="No leave requests" message="This employee has not submitted any leave requests." />
        )}
      </section>
    </section>
  );
};

export default EmployeeHistory;
