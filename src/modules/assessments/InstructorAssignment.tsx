import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './InstructorAssignment.css';
import Navbar from '../home/Navbar.tsx';

interface Assignment {
  title: string;
  description: string;
  dueDate: string;
  courseId: string;
}

const InstructorAssignment: React.FC = () => {
  const courseId  = localStorage.getItem('courseID') || 'null';  
  const [assignment, setAssignment] = useState<Assignment>({
    title: '',
    description: '',
    dueDate: '',
    courseId: courseId || '',
  });

  const [assignmentCreated, setAssignmentCreated] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAssignment({ ...assignment, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const assignments = JSON.parse(localStorage.getItem('assignments') || '[]');
    assignments.push({ ...assignment, id: Date.now() });
    localStorage.setItem('assignments', JSON.stringify(assignments));
    setAssignmentCreated(true);
  };

  const handleGoHome = () => {
    navigate('/instructor/home');
  };

  return (
    <>
    <Navbar role="instructor" />
    <div className="add-assignment-page">
      {assignmentCreated ? (
        <div className="success-message">
          <h2>Assignment Created Successfully!</h2>
          <button onClick={handleGoHome} className="home-button">Go to Dashboard</button>
        </div>
      ) : (
        <form>
          <div className="form-container second-color">
            <h2 className="form-title">Add Assignment for Course ID: {courseId}</h2>
            <input
              name="title"
              value={assignment.title}
              onChange={handleChange}
              placeholder="Title"
              className="input-field"
            />
            <textarea
              name="description"
              value={assignment.description}
              onChange={handleChange}
              placeholder="Description"
              className="input-field"
            />
            <input
              name="dueDate"
              type="date"
              value={assignment.dueDate}
              onChange={handleChange}
              className="input-field"
            />
            <button type="button" onClick={handleSubmit} className="submit-button third-color">
              Add Assignment
            </button>
          </div>
        </form>
      )}
    </div>
    </>
  );
};

export default InstructorAssignment;
