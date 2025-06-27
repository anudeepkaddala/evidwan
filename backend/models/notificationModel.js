const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: [
    //Common Notifications
    'Password Reset', 'Email Verification', 'Login Alert', 
    //Student Notifications
    'Assignment Due', 'New Material', 'Announcement', 'Welcome', 'Course Enrollment', 'Assignment Graded', 'Forum Reply', 'Course Deletion', 'Assignment Submitted', 'New Course', 'Forum Post Deletion', 'Forum Reply Deletion',
    //Instructor Notifications
    'New Submission', 'Course Created', 'Student Enrolled', 'Annnouncement Posted', 'Course Updated', 'Course Deleted',
  ], required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);