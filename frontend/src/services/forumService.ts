import axios from 'axios';
const API_URL =  'http://localhost:5000/api';
 
interface ForumPost {
  _id: string;
  courseId: string;
  author: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };
  title: string;
  content: string;
  category: 'General Discussion' | 'Question' | 'Announcement';
  replies: Array<{
    _id: string;
    author: {
      _id: string;
      username: string;
      email: string;
      role: string;
    };
    content: string;
    createdAt: string;
    updatedAt: string;
  }>;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}
 
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}
 
 
class ForumService {
  private token: string;
 
  constructor() {
    this.token = window.sessionStorage.getItem('token') || '';
  }
 
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }
 
  // Get course discussions with pagination and filters
  async getCourseDiscussions(
    courseId: string,
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string
  ): Promise<PaginatedResponse<ForumPost>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
      ...(search && { search })
    });
 
    const token = window.sessionStorage.getItem('token') || '';
 
    const response = await axios.get(
      `${API_URL}/forum/course/${courseId}?${params}`,
      { headers: {
        Authorization: `Bearer ${token}`,
      } }
    );
    return response.data;
  }
 
  // Create a new forum post
  async createPost(data: {
    courseId: string;
    title: string;
    content: string;
    category?: string;
  }): Promise<{ success: boolean; data: ForumPost }> {
    // If user is instructor, force category to 'Announcement'
    const userRole = (window.sessionStorage.getItem('role') || '').toLowerCase();
    let postData = { ...data };
    if (userRole === 'instructor') {
      postData.category = 'Announcement';
    }
    const response = await axios.post(
      `${API_URL}/forum/create`,
      postData,
      { headers: this.getHeaders() }
    );
    return response.data;
  }
 
  // Add a reply to a post
  async addReply(
    postId: string,
    data: {
      content: string;
    }
  ): Promise<{ success: boolean; data: ForumPost['replies'][0] }> {
    const response = await axios.post(
      `${API_URL}/forum/${postId}/reply`,
      data,
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  // Get announcements (optionally filtered by course)
  async getAnnouncements(courseId?: string): Promise<{ success: boolean; data: ForumPost[] }> {
    const params = new URLSearchParams(
      courseId ? { courseId } : {}
    );
    const token = window.sessionStorage.getItem('token') || '';
    const response = await axios.get(
      `${API_URL}/forum/announcements?${params}`,
      { headers: {
        Authorization: `Bearer ${token}`,
      } }
    );
    return response.data;
  }
 
  // Create an announcement (instructor only)
  async createAnnouncement(data: {
    courseId: string;
    title: string;
    content: string;
  }): Promise<{ success: boolean; data: ForumPost }> {
    const response = await axios.post(
      `${API_URL}/forum/announcement`,
      data,
      { headers: this.getHeaders() }
    );
    return response.data;
  }
 
  // Pin/Unpin a post (instructor only)
  async togglePinPost(postId: string): Promise<{ success: boolean; data: { isPinned: boolean } }> {
    const response = await axios.post(
      `${API_URL}/forum/${postId}/pin`,
      {},
      { headers: this.getHeaders() }
    );
    return response.data;
  }
 
  // Get user's own posts
  async getMyPosts(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<ForumPost>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    const response = await axios.get(
      `${API_URL}/forum/my-posts?${params}`,
      { headers: this.getHeaders() }
    );
    return response.data;
  }
}
 
export const forumService = new ForumService();