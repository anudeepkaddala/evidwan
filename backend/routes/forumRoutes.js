const express = require('express');
const forumRouter = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const {
    createForumPost,
    addReply,
    getCourseDiscussions,
    getAnnouncements,
    createAnnouncement,
    getMyPosts,
    pinPost
} = require('../controllers/forumController');
 
// Protected routes - require authentication
forumRouter.use(authenticateUser);
 
// General forum routes
forumRouter.get('/course/:courseId', getCourseDiscussions);
forumRouter.get('/my-posts', getMyPosts);
forumRouter.post('/create', createForumPost);
 
// Reply routes
forumRouter.post('/:postId/reply', addReply);
 
// Instructor/Admin only routes
forumRouter.post('/announcement', authorizeRoles(['Instructor']), createAnnouncement);
forumRouter.get('/announcements', getAnnouncements);
forumRouter.post('/:postId/pin', authorizeRoles(['Instructor']), pinPost);
 
module.exports = forumRouter;