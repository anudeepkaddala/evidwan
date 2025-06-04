import React from "react";
import './Profile.css';
import Navbar from "../home/Navbar.tsx";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("evidwan-current-user") || '{}');
  const role = localStorage.getItem("evidwan-role");
    const handleLogout = () => {
    localStorage.removeItem("evidwan-current-user");
    navigate("/");
  };
  return (
    <>
    <Navbar userRole={role} />
    <div className="profile-page">
      <div className="profile-box second-color">
        <h2>Profile</h2>
        <p><strong>Username:</strong> {currentUser.username}</p>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Role:</strong> {role}</p>
        <button className="logout-button third-color" onClick={handleLogout}>Logout</button>
      </div>
    </div>
    </>
  );
};

export default Profile;
