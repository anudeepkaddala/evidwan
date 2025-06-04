import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./modules/auth/AuthForms.tsx";
import StudentCourse from "./modules/course/StudentCourse.tsx";
import InstructorCourse from "./modules/course/InstructorCourse.tsx";
import InstructorHome from "./modules/home/InstructorHome.tsx";
import StudentHome from "./modules/home/StudentHome.tsx";
import StudentReport from "./modules/report/StudentReport.tsx";
import InstructorReport from "./modules/report/InstructorReport.tsx";
import InstructorAssignment from "./modules/assessments/InstructorAssignment.tsx";
import StudentAssignment from "./modules/assessments/StudentAssignment.tsx";
import InstructorQuiz from "./modules/assessments/InstructorQuiz.tsx";
import StudentQuiz from "./modules/assessments/StudentQuiz.tsx";
import StudentCommunication from "./modules/communication/StudentCommunication.tsx";
import InstructorCommunication from "./modules/communication/InstructorCommunication.tsx";
import ChatBox from "./modules/communication/ChatBox.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import CourseAssessment from "./modules/assessments/CourseAssessment.tsx";
import Profile from "./modules/profile/Profile.tsx";
import {UserProvider} from "./context/UserContext.tsx";

const App = () => {

  return (
    <UserProvider>
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<AuthForm />} />

        {/* Instructor Routes */}
        <Route
          path="/instructor/home"
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <InstructorHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/course"
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <InstructorCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/report"
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <InstructorReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/assignment"
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <InstructorAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/quiz"
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <InstructorQuiz />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/home"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/course"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/report"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/assignment"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentAssignment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/quiz"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/communication"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <StudentCommunication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/communication"
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <InstructorCommunication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/assessment"
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <CourseAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/assessment"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <CourseAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/profile"
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/chat"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <ChatBox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instructor/chat"
          element={
            <ProtectedRoute allowedRoles={["Instructor"]}>
              <ChatBox />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </UserProvider>
  );
};

export default App;