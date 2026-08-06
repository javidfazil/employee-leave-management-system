import useAuth from "../../context/useAuth.js";
import Card from "../../components/ui/Card.jsx";

const ManagerProfile = () => {
  const { user } = useAuth();
  return <section className="page"><div className="page-heading"><div><span className="eyebrow">MANAGER ACCOUNT</span><h1>Profile</h1><p>Review your manager portal account details.</p></div></div><div className="profile-grid"><Card className="profile-summary"><div className="profile-summary__avatar">{user.name?.slice(0, 1).toUpperCase()}</div><h2>{user.name}</h2><p>{user.email}</p><span className="status">manager</span></Card><Card className="profile-details"><h2>Account details</h2><div className="details-list"><div><span>Full name</span><strong>{user.name}</strong></div><div><span>Work email</span><strong>{user.email}</strong></div><div><span>Department</span><strong>{user.department || "Not specified"}</strong></div><div><span>Workspace role</span><strong>Manager</strong></div></div></Card></div></section>;
};

export default ManagerProfile;
