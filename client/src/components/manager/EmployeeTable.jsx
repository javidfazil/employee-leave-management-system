import { Link } from "react-router-dom";

const EmployeeTable = ({ employees }) => (
  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Status</th>
          <th>Joined</th>
          <th>Leave history</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee._id}>
            <td>
              <strong>{employee.name}</strong>
            </td>
            <td>{employee.email}</td>
            <td>{employee.department || "—"}</td>
            <td>
              <span className="status status--approved">Active</span>
            </td>
            <td>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(employee.createdAt))}</td>
            <td>
              <Link className="text-button" to={`/manager/employees/${employee._id}/history`}>
                View history
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EmployeeTable;
