import api from "../api/api.js";

const getDashboard = async () => (await api.get("/manager/dashboard")).data;
const getRequests = async (status) => (await api.get("/manager/requests", { params: { status } })).data.requests;
const decideRequest = async (leaveId, decision, managerRemark) =>
  (await api.patch(`/manager/requests/${leaveId}/${decision}`, { managerRemark })).data.leave;

export { decideRequest, getDashboard, getRequests };
