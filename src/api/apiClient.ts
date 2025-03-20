import axios from 'axios';
import { Comment, PostCommentRequest, ApiResponse, CommentResponse, UpdateCommentRequest, UpdateCommentResponse } from '../types/commentTypes';

// Relative URL to the url
const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all comments
export const getComments = async (): Promise<Comment[]> => {
  try {
    const response = await api.get<Comment[]>('/comments/all');
    console.log('API Response:', response);
    return response.data;
  } catch (error: any) {
    console.log(error, 'Error fetching comments');
    throw error;
  }
};

// Add a new comment
export const postComment = async (data: PostCommentRequest): Promise<Comment> => {
  try {
    const response = await api.post<Comment>('/comments/post', data);
    console.log('Post response:', response.data);
    return response.data;
  } catch (error: any) {
    console.log(error, 'Error adding comment');
    throw error;
  }
};

// Update an existing comment
export const updateComment = async (comment_id: string, data: UpdateCommentRequest, originalComment: Comment): Promise<Comment> => {
  try {
    const response = await api.put<UpdateCommentResponse>(`/comments/update/${comment_id}`, data)
    
    const updatedComment: Comment = {
      ...originalComment,
      text: response.data.text,
      image: response.data.image || ''
    }

    console.log('Update response:', response.data);
    return updatedComment;
  } catch (error: any) {
    console.log(error, 'Updating comment failed')
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    // Try the original endpoint first
    await api.delete(`/comments/delete/${commentId}`);
  } catch (error: any) {
    console.log(error, 'Error deleting comment');
    throw error;
  }
}; 