import { useEffect, useState } from "react";

import api from "../api/api.js";
import Card from "../components/ui/Card.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import useAuth from "../context/useAuth.js";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);

  useEffect(() => { api.get("/auth/me").then(({ data }) => setProfile(data.user)).catch(() => {}); }, []);

  if (!profile) return <div className="loading-wrap"><LoadingSpinner /></div>;

  return <section className="page"><div className="page-heading"><div><span className="eyebrow">ACCOUNT</span><h1>My profile</h1><p>Review your personal account details.</p></div></div><div className="profile-grid"><Card className="profile-summary"><div className="profile-summary__avatar">{profile.name?.slice(0, 1).toUpperCase()}</div><h2>{profile.name}</h2><p>{profile.email}</p><span className="status">{profile.role}</span></Card><Card className="profile-details"><h2>Personal details</h2><div className="details-list"><div><span>Full name</span><strong>{profile.name}</strong></div><div><span>Email address</span><strong>{profile.email}</strong></div><div><span>Role</span><strong>{profile.role}</strong></div></div></Card></div>{profile.role === "employee" && <Card className="profile-balance"><h2>Leave balance</h2><div className="balance-list"><div className="balance-row"><span>Casual leave</span><strong>{profile.leaveBalance?.casual ?? 0} days</strong></div><div className="balance-row"><span>Sick leave</span><strong>{profile.leaveBalance?.sick ?? 0} days</strong></div><div className="balance-row"><span>Earned leave</span><strong>{profile.leaveBalance?.earned ?? 0} days</strong></div></div></Card>}</section>;
};

export default Profile;
