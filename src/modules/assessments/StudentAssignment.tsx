import React, { useState, ChangeEvent, useEffect } from 'react';
import './StudentAssignment.css';
import Navbar from "../home/Navbar.tsx";
import assignmentsData from './Assignments.json';

const StudentAssignment: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [assignmentQuestion, setAssignmentQuestion] = useState<string>(""); 
  const courseId = localStorage.getItem('courseID') || 'null';
  useEffect(() => {
    // Reset the assignment question when courseId changes
    setAssignmentQuestion("Loading assignment...");
  
    // Fetch assignments from JSON
    const jsonCourse = assignmentsData.find(course => course.courseId === courseId)?.assignments || [];
  
    // Fetch assignments from localStorage
    const localAssignmentsRaw = JSON.parse(localStorage.getItem('assignments') || '[]');
    const localCourseAssignments = localAssignmentsRaw.filter((q: any) => q.courseId === courseId);
  
    // Combine both sources
    const combinedAssignments = [...jsonCourse, ...localCourseAssignments];
  
    // Find the first assignment for the current courseId
    const combinedAssignment = combinedAssignments.length > 0 
      ? combinedAssignments[0]?.description 
      : "No assignment found for this course.";

    setAssignmentQuestion(combinedAssignment);
  }, [courseId]);
  
  

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!uploadedFile) {
      alert("Please upload a file before submitting.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
    <Navbar role="student" />
    <div className="take-assignment-page">
      <div className="assignment-container second-color">
        {submitted ? (
          <div className="result-container">
            <h2>Assignment Submitted!</h2>
            <p>Your file "<strong>{uploadedFile?.name}</strong>" has been successfully uploaded.</p>
          </div>
        ) : (
          <>
            <h2 className="assignment-title">Assignment</h2>
            <div className="question-container">
              <h3 className="question-text">{assignmentQuestion}</h3>
            </div>
            <div className="file-upload-container">
              <label className="file fourth-color">
                Upload File
                <input type="file" name="file" onChange={handleFileUpload} />
              </label>
              {uploadedFile && <p className="file-name">Selected File: {uploadedFile.name}</p>}
            </div>
            <button onClick={handleSubmit} className="submit-button third-color">
              Submit Assignment
            </button>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default StudentAssignment;
