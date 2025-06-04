import React, { useState } from "react";
import "./InstructorReport.css";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, Tooltip, LineChart, Line,
  ResponsiveContainer, Legend
} from "recharts";
import Navbar from "../home/Navbar.tsx"

// Interfaces
interface Performance {
  name: string;
  students: number;
}

interface Assignment {
  assignment: string;
  completed: number;
  pending: number;
}

interface EngagementPoint {
  [key: string]: string | number;
}

interface Course {
  title: string;
  students: number;
  progress: number;
  category: string;
  icon: string;
}

// Sample Data
const gradeData: Performance[] = [
  { name: "A", students: 15 },
  { name: "B", students: 24 },
  { name: "C", students: 18 },
  { name: "D", students: 8 },
  { name: "F", students: 3 },
];

const assignmentData: Assignment[] = [
  { assignment: "Assignment 1", completed: 85, pending: 15 },
  { assignment: "Assignment 2", completed: 72, pending: 28 },
  { assignment: "Assignment 3", completed: 60, pending: 40 },
];

const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#F44336", "#9C27B0"];

const InstructorReport: React.FC = () => {
  const [engagementView, setEngagementView] = useState<"daily" | "weekly" | "monthly">("daily");

  const engagementData: Record<string, EngagementPoint[]> = {
    daily: [
      { day: "Mon", students: 42 },
      { day: "Tue", students: 38 },
      { day: "Wed", students: 45 },
      { day: "Thu", students: 40 },
      { day: "Fri", students: 35 },
      { day: "Sat", students: 25 },
      { day: "Sun", students: 20 },
    ],
    weekly: [
      { week: "Week 1", students: 50 },
      { week: "Week 2", students: 48 },
      { week: "Week 3", students: 45 },
      { week: "Week 4", students: 52 },
    ],
    monthly: [
      { month: "Jan", students: 45 },
      { month: "Feb", students: 48 },
      { month: "Mar", students: 52 },
      { month: "Apr", students: 55 },
    ],
  };

  const activeCourses: Course[] = [
    { title: "React for Beginners", students: 45, progress: 65, category: "Web Development", icon: "📱" },
    { title: "JavaScript Essentials", students: 38, progress: 70, category: "Programming", icon: "💻" },
    { title: "CSS Mastery", students: 32, progress: 60, category: "Web Development", icon: "🎨" },
    { title: "Node.js Crash Course", students: 28, progress: 45, category: "Backend", icon: "⚙️" },
    { title: "Data Structures", students: 35, progress: 50, category: "Computer Science", icon: "🔍" },
  ];

  const renderProgressBar = (progress: number) => {
    return (
      <div className="progress-container">
        <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
        <span className="progress-label">{progress}%</span>
      </div>
    );
  };

  return (
    <>
    <Navbar role="instructor" />
    <div className="dashboard-container">
      <h1 className="dashboard-title">Instructor Reporting & Analytics</h1>

      {/* Grade Distribution */}
      <div className="section second-color p-4 rounded mb-4">
        <h4 className="section-title">Grade Distribution</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={gradeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
              dataKey="students"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {gradeData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Assignment Completion */}
      <div className="section second-color p-4 rounded mb-4">
        <h4 className="section-title">Assignment Completion</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={assignmentData} barSize={30}>
            <XAxis dataKey="assignment" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" stackId="a" fill="#4CAF50" />
            <Bar dataKey="pending" stackId="a" fill="#FF9800" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Student Engagement */}
      <div className="section second-color p-4 rounded mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="section-title mb-0">Student Engagement</h4>
          <select
            value={engagementView}
            onChange={(e) => setEngagementView(e.target.value as "daily" | "weekly" | "monthly")}
            className="form-select w-auto"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={engagementData[engagementView]}>
            <XAxis dataKey={engagementView === "daily" ? "day" : engagementView === "weekly" ? "week" : "month"} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="students" stroke="#393e46" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Active Courses */}
      <div className="section second-color p-4 rounded mb-5">
        <h4 className="section-title">Active Courses</h4>
        <div className="table-responsive">
          <table className="table table-bordered table-hover bg-white">
            <thead className="third-color text-white">
              <tr>
                <th>Course</th>
                <th>Category</th>
                <th>Students</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {activeCourses.map((course, idx) => (
                <tr key={idx}>
                  <td>{course.icon} {course.title}</td>
                  <td>{course.category}</td>
                  <td>{course.students}</td>
                  <td>{renderProgressBar(course.progress)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default InstructorReport;
