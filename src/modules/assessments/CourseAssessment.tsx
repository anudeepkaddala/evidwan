import React, { useState, useEffect } from 'react';
import './CourseAssessment.css';
import Navbar from '../home/Navbar.tsx';
import { useNavigate } from 'react-router-dom';

interface Course {
  courseID: string;
  title: string;
  description: string;
  instructorID: string;
  instructorName: string;
  category: string;
  imageUrl: string;
}

const CourseAssessment: React.FC = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem("evidwan-role") || "null");

  useEffect(() => {
    // Fetch the latest data from localStorage whenever the component is mounted
    if (role === 'Student') {
      const studentCourses = JSON.parse(localStorage.getItem('evidwan-enrolled-courses') || '[]') || [];
      setEnrolledCourses(studentCourses);
    } else {
      const instructorCourses = JSON.parse(localStorage.getItem('instructor-courses') || '[]') || [];
      setEnrolledCourses(instructorCourses);
    }
  }, [role]); // Re-run whenever the role changes

  const handleAssignment = (cid: string) => {
    localStorage.setItem("courseID", cid);
    navigate(role === 'Student' ? '/student/assignment' : '/instructor/assignment');
  };

  const handleQuiz = (cid: string) => {
    localStorage.setItem("courseID", cid);
    navigate(role === 'Student' ? '/student/quiz' : '/instructor/quiz');
  };

  return (
    <>
      <Navbar role={role} />
      <div className="course-assessment-page">
        <h2 className="heading">Assessments for Your Courses</h2>
        <div className="course-container">
          {enrolledCourses.length === 0 ? (
            <p style={{ textAlign: 'center', width: '100%', color: 'white' }}>No enrolled courses</p>
          ) : (
            enrolledCourses.map((course) => (
              <div key={course.courseID} className="course-card">
                <img src={course.imageUrl} alt={course.title} className="course-image" />
                <div className="course-details">
                  <h3>{course.title}</h3>
                  <p><strong>Description:</strong> {course.description}</p>
                  <p><strong>Instructor:</strong> {course.instructorName}</p>
                  <p><strong>Category:</strong> {course.category}</p>
                  <div className="assessment-buttons">
                    <button
                      className="assessment-button"
                      onClick={() => handleAssignment(course.courseID)}
                    >
                      {role === 'Student' ? 'View Assignment' : 'Add Assignment'}
                    </button>
                    <button
                      className="assessment-button"
                      onClick={() => handleQuiz(course.courseID)}
                    >
                      {role === 'Student' ? 'Take Quiz' : 'Add Quiz'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CourseAssessment;