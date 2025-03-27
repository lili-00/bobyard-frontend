import { useState } from 'react';
import { Comment, UpdateCommentRequest } from '../types/commentTypes';
import CommentForm from './CommentForm';
import { FaEdit, FaTrash, FaThumbsUp } from 'react-icons/fa';

interface CommentItemProps {
  comment: Comment;
  onEdit: (comment_id: string, data: UpdateCommentRequest, existingComment: Comment) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  level?: number;
}

const CommentItem = ({ comment, onEdit, onDelete, level = 0 }: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const commentId = comment.id || '';
  const commentText = comment.text || '';
  const imageUrl = comment.image || null;
  
  const handleEdit = async (data: UpdateCommentRequest) => {
    await onEdit(commentId, data, comment);
    setIsEditing(false);
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setIsDeleting(true);
      try {
        await onDelete(commentId);
      } catch (error) {
        setIsDeleting(false);
      }
    }
  };
  
  const formatDate = (dateString: string): string => {
    try {
      // Try to parse the date
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date string: ${dateString}`);
        return 'Invalid date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  if (isEditing) {
    return (
      <CommentForm
        comment={{
          id: commentId,
          text: commentText,
          author: comment.author,
          date: comment.date,
          likes: comment.likes,
          image: imageUrl
        }}
        onSubmit={handleEdit}
        onCancel={() => setIsEditing(false)}
        isEditing={true}
      />
    );
  }
  
  return (
    <div className={`card transition-opacity ${isDeleting ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <div className="comment-author">{comment.author}</div>
          <div className="comment-date">{formatDate(comment.date)}</div>
        </div>
        <div className="comment-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary flex items-center space-x-1 text-sm py-1"
            disabled={isDeleting}
            aria-label="Edit comment"
          >
            <FaEdit className="mr-1" /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger flex items-center space-x-1 text-sm py-1"
            disabled={isDeleting}
            aria-label="Delete comment"
          >
            <FaTrash className="mr-1" /> Delete
          </button>
        </div>
      </div>
      
      <div className="comment-text">{commentText}</div>
      
      {imageUrl && (
        <div className="mt-3">
          <p className="comment-url">Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p>
          <img
            src={imageUrl}
            alt="Comment attachment"
            className="comment-image"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              const errorMsg = document.createElement('p');
              errorMsg.textContent = 'Image failed to load';
              errorMsg.className = 'text-red-500 text-sm mt-1';
              e.currentTarget.parentNode?.appendChild(errorMsg);
            }}
          />
        </div>
      )}
      
      <div className="comment-likes">
        <FaThumbsUp className="mr-1" />
        <span>{comment.likes} likes</span>
      </div>

      {/* recursive rendering of replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className='replies-container ml-8 mt-2'>
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id || Math.random().toString()}
              comment={reply}
              onEdit={onEdit}
              onDelete={onDelete}
              level={level + 1}
          />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem; 