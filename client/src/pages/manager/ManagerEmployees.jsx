import { useCallback, useEffect, useState } from "react";

import EmployeeTable from "../../components/manager/EmployeeTable.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import LoadingSpinner from "../../components/ui/LoadingSpinner.jsx";
import useToast from "../../context/useToast.js";
import { getEmployees } from "../../services/managerService.js";

// Employee Directory (/manager/employees) — every registered employee account.
const ManagerEmployees = () => {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    void Promise.resolve().then(loadEmployees);
  }, [loadEmployees]);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">EMPLOYEE DIRECTORY</span>
          <h1>Registered Employees</h1>
          <p>Review employee accounts and their complete leave histories.</p>
        </div>
      </div>
      <section className="card table-card">
        {isLoading ? (
          <div className="loading-wrap">
            <LoadingSpinner />
          </div>
        ) : employees.length ? (
          <EmployeeTable employees={employees} />
        ) : (
          <EmptyState title="No employees found" message="Employee accounts will appear here after registration." />
        )}
      </section>
    </section>
  );
};

export default ManagerEmployees;
