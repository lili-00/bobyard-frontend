import { useState, useEffect } from 'react';
import { Comment, UpdateCommentRequest } from '../types/commentTypes';
import CommentItem from './CommentItem';
import { getComments, updateComment, deleteComment } from '../api/apiClient';
import { toast } from 'react-toastify';

interface ApiResponseWrapper {
  data?: Comment[];
  comments?: Comment[];
  success?: boolean;
  error?: string;
  [key: string]: any;
}

const CommentsList = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComments();
      console.log('Fetched comments:', data);
      
      // Check if data is an array
      if (Array.isArray(data)) {
        setComments(data);
      } else if (data && typeof data === 'object') {
        // If data is an object, it might be wrapped in a response object
        // Try to extract the comments array
        const responseObj = data as ApiResponseWrapper;
        if (responseObj.data && Array.isArray(responseObj.data)) {
          setComments(responseObj.data);
        } else if (responseObj.comments && Array.isArray(responseObj.comments)) {
          setComments(responseObj.comments);
        } else {
          console.error('Unexpected data format:', data);
          setError('Received data in an unexpected format');
        }
      } else {
        console.error('Unexpected data type:', typeof data);
        setError('Received data in an unexpected format');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load comments. Please try again later.';
      setError(errorMessage);
      toast.error('Failed to load comments');
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleEdit = async (id: string, data: UpdateCommentRequest, existingComment: Comment) => {
    try {
      const updatedComment = await updateComment(id, data, existingComment);
      setComments(prevComments => 
        prevComments.map(comment => {
          const commentId = comment.id;
          if (commentId === id) {
            return updatedComment;
          }
          return comment;
        })
      );
      toast.success('Comment updated successfully');
    } catch (err) {
      toast.error('Failed to update comment');
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteComment(id);
      setComments(prevComments => 
        prevComments.filter(comment => {
          // Check if the comment has comment_id
          const commentId = comment.id;
          return commentId !== id;
        })
      );
      toast.success('Comment deleted successfully');
    } catch (err) {
      toast.error('Failed to delete comment');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <div className="mt-2">
          <p>Please check:</p>
          <ul className="list-disc pl-5 mt-1 text-sm">
            <li>The API endpoints are correctly implemented</li>
            <li>The response format matches what the frontend expects</li>
          </ul>
        </div>
        <button 
          className="btn btn-primary ml-4 mt-2"
          onClick={fetchComments}
        >
          Try again
        </button>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
      <div className="space-y-4">
        {comments.map(comment => {
          // Use comment_id as key if available, otherwise use id
          const key = comment.id || Math.random().toString();
          return (
            <CommentItem
              key={key}
              comment={comment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CommentsList; 