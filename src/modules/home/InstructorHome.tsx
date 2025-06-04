import React from 'react';
import Navbar from '../home/Navbar.tsx';
import './InstructorHome.css';
import { useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaClipboardList, FaComments, FaChalkboardTeacher } from 'react-icons/fa';

const InstructorHome: React.FC = () => {
  const navigate = useNavigate();
  const modules = [
    { icon: <FaPlusCircle />, label: "Create Course", route: "/instructor/course" },
    { icon: <FaClipboardList />, label: "Manage Courses", route: "/instructor/course" },
    { icon: <FaComments />, label: "Communication", route: "/instructor/communication" },
    { icon: <FaChalkboardTeacher />, label: "Assessments", route: "/instructor/assessment" },
  ];

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <>
      <Navbar role="Instructor" />
      <div className="instructor-home">
        <h1 className="title">Welcome, Instructor!</h1>
        <div className="module-grid">
          {modules.map((mod, index) => (
            <div key={index} className="module-card" onClick={() => handleNavigate(mod.route)}>
              <div className="module-icon">{mod.icon}</div>
              <div className="module-label">{mod.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InstructorHome;