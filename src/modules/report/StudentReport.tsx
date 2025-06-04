import React, { useState } from "react";
import "./StudentReport.css";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend
} from "recharts";
import Navbar from "../home/Navbar.tsx";

interface DonutDataItem {
  name: string;
  value: number;
}

interface QuizScore {
  name: string;
  score: number;
}
//newadd
interface AssignmentScore {
  name: string;
  score: number;
}

interface EngagementPoint {
  [key: string]: string | number;
}

interface Course {
  title: string;
  progress: number;
  category: string;
  icon: string;
}

interface LeaderboardEntry {
  name: string;
  points: number;
  isCurrentUser?: boolean;
}


const donutData: DonutDataItem[] = [
  { name: "Completed", value: 80 },
  { name: "Remaining", value: 20 },
];

const quizScores: QuizScore[] = [
  { name: "Quiz 1", score: 85 },
  { name: "Quiz 2", score: 92 },
  { name: "Quiz 3", score: 78 },
];
//newadd
const AssignmentScore: AssignmentScore[] = [
  { name: "Assignment 1", score: 97 },
  { name: "Assignment 2", score: 92 },
  { name: "Assignment 3", score: 100 },
];


const COLORS = ["#4CAF50", "#FF7043","#2196F3"];

const engagementData: Record<string, EngagementPoint[]> = {
  daily: [
    { day: "Mon", time: 2 },
    { day: "Tue", time: 1.5 },
    { day: "Wed", time: 3 },
    { day: "Thu", time: 2.5 },
    { day: "Fri", time: 2 },
    { day: "Sat", time: 1 },
    { day: "Sun", time: 0.5 },
  ],
  weekly: [
    { week: "Week 1", time: 10 },
    { week: "Week 2", time: 12 },
    { week: "Week 3", time: 8 },
    { week: "Week 4", time: 14 },
  ],
  monthly: [
    { month: "Jan", time: 40 },
    { month: "Feb", time: 35 },
    { month: "Mar", time: 45 },
    { month: "Apr", time: 50 },
  ],
};

const enrolledCourses: Course[] = [
  { title: "React for Beginners", progress: 45, category: "Web Development", icon: "📱" },
  { title: "JavaScript Essentials", progress: 70, category: "Programming", icon: "💻" },
  { title: "CSS Mastery", progress: 60, category: "Web Development", icon: "🎨" },
  { title: "Node.js Crash Course", progress: 30, category: "Backend", icon: "⚙️" },
  { title: "Data Structures", progress: 50, category: "Computer Science", icon: "🔍" },
];

const leaderboard: LeaderboardEntry[] = [
  { name: "Alice", points: 1200 },
  { name: "Bob", points: 1100 },
  { name: "Charlie", points: 1050 },
  { name: "You", points: 950, isCurrentUser: true },
];


const StudentReport: React.FC = () => {
  const [engagementView, setEngagementView] = useState<string>("daily");

  return (
    <>
    <Navbar role="student" />
    <div className="student-dashboard p-4">
      <h1 className="dashboard-heading">Student Reporting & Analytics</h1>

      <div className="card-section second-color p-4 mb-4">
        <h4 className="section-title">Course Completion</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {donutData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="card-section second-color p-4 mb-4">
        <h4 className="section-title">Enrolled Courses</h4>
        <ul>
          {enrolledCourses.map((course, index) => (
            <li key={index}>{course.icon} {course.title} - {course.progress}%</li>
          ))}
        </ul>
      </div>
      

      <div className="card-section second-color p-4 mb-4">
        <h4 className="section-title">Quiz Performance</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={quizScores}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-section second-color p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="section-title">Study Time</h4>
          <select
            value={engagementView}
            onChange={(e) => setEngagementView(e.target.value)}
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
            <Line type="monotone" dataKey="time" stroke="#393e46" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      

      {/*//newadd */}
        <div className="card-section second-color p-4 mb-4">
        <h4 className="section-title">Assignment Scores</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={AssignmentScore}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card-section second-color p-4 mb-4">
        <h4 className="section-title">Leaderboard</h4>
        <ul>
          {leaderboard.map((user, index) => (
            <li key={index}>
              {index + 1}. {user.name} - {user.points} pts
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
};

export default StudentReport;
