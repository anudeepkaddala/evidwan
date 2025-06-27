const ForumPost = require('../models/forumModel');
const Course = require('../models/courseModel');
const Notification = require('../models/notificationModel');
const { createError } = require('../utils/error');
 
// Create a forum post
exports.createForumPost = async (req, res, next) => {
    try {
        const { courseId, title, content, category } = req.body;
 
        // Check if the course exists and user is enrolled or is instructor
        const course = await Course.findById(courseId);
        if (!course) {
            return next(createError(404, 'Course not found'));
        }
 
        // If instructor, only allow announcement
        if (req.user.role && req.user.role.toLowerCase() === 'instructor') {
            if (category !== 'Announcement') {
                return next(createError(400, 'Instructors can only create announcements. To answer questions, reply to a student post.'));
            }
        } else {
            // If student, only allow Question or General
            if (category === 'Announcement') {
                return next(createError(400, 'Only instructors can create announcements.'));
            }
        }
 
        const post = await ForumPost.create({
            courseId,
            author: req.user._id,
            title,
            content,
            category
        });
 
        res.status(201).json({
            success: true,
            data: post
        });
    } catch (error) {
        next(error);
    }
};
 
// Get course discussions
exports.getCourseDiscussions = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { page = 1, limit = 10, category, search } = req.query;
 
        // Check if user has access to the course
        const course = await Course.findById(courseId);
        if (!course) {
            return next(createError(404, 'Course not found'));
        }
 
        if (!course.enrolledStudents.some(
            (student) => student._id.toString() === req.user._id.toString()
          ) &&
            course.instructor.toString() !== req.user._id.toString()) {
            return next(createError(403, 'You do not have access to this course'));
        }
 
        const query = { courseId };
 
        if (category) {
            query.category = category;
        }
 
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }
 
        console.log('Current user role:', req.user.role); // Debug log
 
        const posts = await ForumPost.find(query)
            .populate({
                path: 'author',
                select: 'username email role'
            })
            .populate({
                path: 'replies.author',
                select: 'username email role'
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ isPinned: -1, createdAt: -1 });
 
        // Debug log for the first post's replies
        if (posts.length > 0 && posts[0].replies.length > 0) {
            console.log('Sample reply author:', posts[0].replies[0].author);
        }
 
        const total = await ForumPost.countDocuments(query);
 
        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};
 
// Get announcements
exports.getAnnouncements = async (req, res, next) => {
    try {
        const { courseId } = req.query;
        const query = { category: 'Announcement' };
 
        if (courseId) {
            // Check if user has access to the course
            const course = await Course.findById(courseId);
            if (!course) {
                return next(createError(404, 'Course not found'));
            }
 
            if (!course.enrolledStudents.some(
                (student) => student._id.toString() === req.user._id.toString()
              ) &&
                course.instructor.toString() !== req.user._id.toString()) {
                return next(createError(403, 'You do not have access to this course'));
            }
 
            query.courseId = courseId;
        }
 
        const announcements = await ForumPost.find(query)
            .populate('author', 'username email')
            .populate('courseId', 'title')
            .sort({ createdAt: -1 });
 
        res.status(200).json({
            success: true,
            data: announcements
        });
    } catch (error) {
        next(error);
    }
};
 
// Create announcement (instructor only)
exports.createAnnouncement = async (req, res, next) => {
    try {
        const { courseId, title, content } = req.body;
 
        // Check if the course exists and user is instructor
        const course = await Course.findById(courseId);
        if (!course) {
            return next(createError(404, 'Course not found'));
        }
 
        if (course.instructor.toString() !== req.user._id.toString()) {
            return next(createError(403, 'Only instructors can create announcements'));
        }
 
        const announcement = await ForumPost.create({
            courseId,
            author: req.user._id,
            title,
            content,
            category: 'Announcement',
            isPinned: false
        });
 
        // Create notification for all enrolled students
 
        if (course.enrolledStudents && course.enrolledStudents.length > 0) {
            const announcementStudentNotifications = course.enrolledStudents.map(studentObj => ({
                userId: studentObj._id,
                message: `New announcement in ${course.title}: "${title}"`,
                type: "Announcement",
                isRead: false,
                createdAt: new Date()
            }));
            await Notification.insertMany(announcementStudentNotifications);
        }
 
        // Create notification for the instructor
        const instructorAnnouncementNotification = new Notification({
            userId: course.instructor,
            message: `You created a new announcement in ${course.title}: "${title}"`,
            type: "Announcement",
            isRead: false
        });
        await instructorAnnouncementNotification.save();
 
        res.status(201).json({
            success: true,
            data: announcement
        });
    } catch (error) {
        next(error);
    }
};
 
// Pin/Unpin post (instructor only)
exports.pinPost = async (req, res, next) => {
    try {
        const post = await ForumPost.findById(req.params.postId);
        if (!post) {
            return next(createError(404, 'Post not found'));
        }
 
        // Check if user is the course instructor
        const course = await Course.findById(post.courseId);
        if (course.instructor.toString() !== req.user._id.toString()) {
            return next(createError(403, 'Only instructors can pin/unpin posts'));
        }
 
        post.isPinned = !post.isPinned;
        await post.save();
 
        res.status(200).json({
            success: true,
            data: {
                isPinned: post.isPinned
            }
        });
    } catch (error) {
        next(error);
    }
};
 
// Get user's posts
exports.getMyPosts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
 
        const posts = await ForumPost.find({ author: req.user._id })
            .populate('author', 'username email role')
            .populate('courseId', 'title')
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
 
        const total = await ForumPost.countDocuments({ author: req.user._id });
 
        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};
 
// Add reply to post
exports.addReply = async (req, res, next) => {
    try {
        const post = await ForumPost.findById(req.params.postId);
        if (!post) {
            return next(createError(404, 'Post not found'));
        }
 
        // Check if user has access to the course
        const course = await Course.findById(post.courseId);
        if (!course.enrolledStudents.some(
            (student) => student._id.toString() === req.user._id.toString()
          ) &&
            course.instructor.toString() !== req.user._id.toString()) {
            return next(createError(403, 'You are not authorized to reply to this post'));
        }
 
        console.log('User adding reply:', req.user); // Debug log
 
        const reply = {
            author: req.user._id,
            content: req.body.content,
        };
 
        post.replies.push(reply);
        await post.save();
 
        // Populate the author details for the new reply
        const populatedPost = await ForumPost.findById(post._id)
            .populate({
                path: 'replies.author',
                select: 'username email role'
            });
        const newReply = populatedPost.replies[populatedPost.replies.length - 1];
 
        console.log('New reply with author:', newReply); // Debug log
 
        // Create notification for the post author
        const authorForumNotification = new Notification({
            userId: post.author,
            message: `You have a new reply on your post "${post.title} from ${req.user.username} in ${course.title}"`,
            type: "Forum Reply",
            isRead: false
        });
        await authorForumNotification.save();
 
        res.status(201).json({
            success: true,
            data: newReply
        });
    } catch (error) {
        next(error);
    }
};
 
