import api from "../api/api.js";

const getDashboard = async () => (await api.get("/manager/dashboard")).data;

const getRequests = async (status) => (await api.get("/manager/requests", { params: { status } })).data.requests;

const getRequestById = async (leaveId) => (await api.get(`/manager/requests/${leaveId}`)).data.request;

const decideRequest = async (leaveId, decision, managerRemark) =>
  (await api.put(`/manager/requests/${leaveId}/${decision}`, { managerRemark })).data.leave;

const getEmployees = async () => (await api.get("/manager/employees")).data.employees;

const getEmployeesOnLeaveToday = async () => (await api.get("/manager/on-leave-today")).data.employees;

const getEmployeeHistory = async (employeeId) => (await api.get(`/manager/employees/${employeeId}/leaves`)).data;

export { decideRequest, getDashboard, getEmployeeHistory, getEmployees, getEmployeesOnLeaveToday, getRequestById, getRequests };
