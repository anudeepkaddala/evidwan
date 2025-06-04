import React, { useState } from 'react';
import './InstructorCommunication.css';
import Navbar from "../home/Navbar.tsx";

interface ForumPost {
  postId: number;
  userId: number;
  message: string;
  timestamp: string;
}

interface Notification {
  notificationId: number;
  userId: number;
  message: string;
  type: string;
}

const InstructorCommunication: React.FC = () => {
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const notifications: Notification[] = [
    {
      notificationId: 1,
      userId: 101,
      message: "Reminder: Grade Assignment 2 by this weekend.",
      type: "Assignment Due"
    },
    {
      notificationId: 2,
      userId: 101,
      message: "Platform update: New feature for analytics reporting now live!",
      type: "Announcement"
    },
    {
      notificationId: 3,
      userId: 101,
      message: "New student enrolled in your 'React Fundamentals' course.",
      type: "New Course"
    }
  ];

  const handlePostMessage = () => {
    if (newMessage.trim() === '') return;

    const newPost: ForumPost = {
      postId: Date.now(),
      userId: 101,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    setForumPosts([...forumPosts, newPost]);
    setNewMessage('');
  };

  return (
    <>
      <Navbar role={localStorage.getItem("evidwan-role") || "Instructor"} />
      <div className="communication-module">
        <div className="forum-section">
          <h2>Instructor Forum</h2>
          <div className="forum-posts">
            {forumPosts.map((post) => (
              <div key={post.postId} className="forum-post">
                <p>{post.message}</p>
                <span>{new Date(post.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="new-message">
            <input
              type="text"
              placeholder="Post a message for students..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={handlePostMessage}>Post</button>
          </div>
        </div>

        <div className="notifications-section">
          <h2>Notifications</h2>
          <ul className="notifications-list">
            {notifications.map((notification) => (
              <li
                key={notification.notificationId}
                className={`notification ${notification.type.toLowerCase().replace(' ', '-')}`}
              >
                <p className={notification.type === "Assignment Due" ? "high-priority" : ""}>
                  {notification.message}
                </p>
                <span>{notification.type}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default InstructorCommunication;
