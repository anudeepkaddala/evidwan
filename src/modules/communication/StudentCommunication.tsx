import React, { useState } from 'react';
import './StudentCommunication.css';
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

const StudentCommunication: React.FC = () => {
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Static notifications
  const notifications: Notification[] = [
    {
      notificationId: 1,
      userId: 1,
      message: "Assignment 2 is due in 2 days. Please submit on time.",
      type: "Assignment Due"
    },
    {
      notificationId: 2,
      userId: 1,
      message: "New announcement: Live Q&A session on Friday!",
      type: "Announcement"
    },
    {
      notificationId: 3,
      userId: 1,
      message: "New content added to React Fundamentals course.",
      type: "New Course"
    }
  ];

  const handlePostMessage = () => {
    if (newMessage.trim() === '') return;

    const newPost: ForumPost = {
      postId: Date.now(),
      userId: 1,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    setForumPosts([...forumPosts, newPost]);
    setNewMessage('');
  };

  return (
    <>
      <Navbar role={localStorage.getItem("evidwan-role") || "Student"} />
      <div className="communication-module">
        <div className="forum-section">
          <h2>Forum</h2>
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
              placeholder="Type your message..."
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

export default StudentCommunication;
