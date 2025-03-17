import axios from 'axios';
import { Comment, CommentFormData, ApiResponse } from '../types/commentTypes';

// Use a relative URL instead of absolute URL to avoid CORS issues
// This will make requests relative to the current domain
const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to log detailed error information
const logError = (error: any, context: string) => {
  console.error(`${context}:`, error);
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error message:', error.message);
  }
};

// Get all comments
export const getComments = async (): Promise<Comment[]> => {
  try {
    const response = await api.get<Comment[]>('/comments/all');
    console.log('API Response:', response);
    return response.data;
  } catch (error: any) {
    logError(error, 'Error fetching comments');
  }
  return []
};

// Add a new comment
export const postComment = async (data: CommentFormData): Promise<Comment> => {
  // Convert the form data to match the backend expected format based on PostCommentRequest
  const backendData = {
    user_id: 999, // Default user ID for admin
    author: 'Admin', // Default author
    text: data.text,
    image: data.image
  };

  try {
    const response = await api.post<{message: string, comment_id: number}>('/comments/post', backendData);
    console.log('Post response:', response.data);
    
    // Create a comment object from the response
    const newComment: Comment = {
      comment_id: String(response.data.comment_id),
      user_id: String(backendData.user_id),
      author: backendData.author,
      text: backendData.text,
      date: new Date().toISOString(),
      likes: 0,
      image: data.image || null
    };
    
    return newComment;
  } catch (error: any) {
    logError(error, 'Error adding comment');
    throw new Error('Failed to add comment');
  }
};

// Update an existing comment
export const updateComment = async (id: string, data: CommentFormData, originalComment: Comment): Promise<Comment> => {
  // Convert the form data to match the backend expected format
  const backendData = {
    text: data.text,
    image: data.image
  };

  try {
    // Try the original endpoint first
    const response = await api.put<{
      message: string, 
      comment_id?: number,
      text: string,
      image?: string
    }>(`/comments/update/${id}`, backendData);
    
    const updatedComment: Comment = {
      ...originalComment,
      text: response.data.text,
      image: response.data.image || ''
    }

    console.log('Update response:', response.data);
    return updatedComment;
  } catch (error: any) {
    logError(error, 'Error updating comment');
    throw new Error('Failed to update comment');
  }
};

// Delete a comment
export const deleteComment = async (id: string): Promise<void> => {
  try {
    // Try the original endpoint first
    await api.delete(`/comments/delete/${id}`);
  } catch (error: any) {
    logError(error, 'Error deleting comment');
    
    // If the first endpoint fails, try an alternative endpoint format
    try {
      console.log('Trying alternative endpoint for deleting...');
      await api.delete(`/comments/${id}`);
    } catch (altError) {
      logError(altError, 'Error deleting comment with alternative endpoint');
      throw new Error('Failed to delete comment');
    }
  }
}; 