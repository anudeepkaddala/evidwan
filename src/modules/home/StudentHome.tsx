import React from 'react';
import './StudentHome.css';
import Navbar from '../home/Navbar.tsx';
import { FaBookOpen, FaComments, FaCalendarAlt, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const StudentHome: React.FC = () => {
  const username = JSON.parse(localStorage.getItem("evidwan-current-user") || '{}').username || 'Student';
  const navigate = useNavigate();

  return (
    <>
      <Navbar role="Student" />
      <div className="student-home">
        <h1 className="welcome-heading">Welcome {username}!</h1>

        <div className="module-grid">
          <div className="module-card" onClick={() => navigate('/student/course')}>
            <FaBookOpen className="module-icon" />
            <h3>My Courses</h3>
            <p>View and continue your enrolled courses.</p>
          </div>

          <div className="module-card" onClick={() => navigate('/student/communication')}>
            <FaComments className="module-icon" />
            <h3>Forum</h3>
            <p>Join course discussions and ask questions.</p>
          </div>

          <div className="module-card" onClick={() => navigate('/student/report')}>
            <FaCalendarAlt className="module-icon" />
            <h3>Progress Report</h3>
            <p>Track your progress and performance.</p>
          </div>

          <div className="module-card" onClick={() => navigate('/student/chat')}>
            <FaDownload className="module-icon" />
            <h3>Chat with Instructor</h3>
            <p>Get instant help from your course instructor.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentHome;
