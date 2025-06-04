import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo2.png'; // Add your logo image in this path
import { useNavigate } from 'react-router-dom';
type NavbarProps = {
  userRole: string;
};

const Navbar: React.FC<NavbarProps> = ({ userRole }) => {
  const navigate = useNavigate();
  userRole = JSON.parse(localStorage.getItem("evidwan-role") || "null");

  const handleCourseCatalog = () => {
    navigate(userRole === 'Instructor' ? '/instructor/course' : '/student/course');
  }
  const handleAssessment = () => {
    navigate(userRole === 'Instructor' ? '/instructor/assessment' : '/student/assessment');
  }
  const handleCommunication = () => {
    navigate(userRole === 'Instructor' ? '/instructor/communication' : '/student/communication');
  }
  const handlePerformance = () => {
    navigate(userRole === 'Instructor' ? '/instructor/report' : '/student/report');
  }
  const handleClick = () => {
    navigate(userRole === 'Instructor' ? '/instructor/home' : '/student/home');
  }
  const handleProfile = () => {
    navigate(userRole === 'Instructor' ? '/instructor/profile' : '/student/profile');
  }
  const handleChat = () => {
    navigate(userRole === 'Instructor' ? '/instructor/chat' : '/student/chat');
  }
  // const handleMode = () => {
  //   const checkbox = document.getElementById("checkbox") as HTMLInputElement;
  //   const body = document.body;

  //   if (checkbox.checked) {
  //     body.classList.toggle("dark");
      
  //   } 
  // }
  return (
    <nav className="navbar">
      <div className="logo-section">
        <img src={logo} alt="e-vidwan logo" className="logo home" onClick={handleClick}/>
      </div>

      <ul className="nav-links">
        <li onClick={handleCourseCatalog}>Course Catalog</li>
        <li onClick={handleAssessment}>Assessment</li>
        <li onClick={handleCommunication}>Notification</li>
        <li onClick={handleChat}>Chat</li>
        <li onClick={handlePerformance}>Report</li>
        <li onClick={handleProfile}>Profile</li>
        {/* <li onClick={handleMode}><input type="checkbox" class="checkbox" id="checkbox" />
          <label for="checkbox" class="checkbox-label">
            <i class="fas fa-moon"></i>
            <i class="fas fa-sun"></i>
            <span class="ball"></span>
          </label></li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
