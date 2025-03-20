import { useState, useEffect } from 'react';
import { Comment, PostCommentRequest } from '../types/commentTypes';

interface CommentFormProps {
  comment?: Comment;
  onSubmit: (data: PostCommentRequest) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

const CommentForm = ({ comment, onSubmit, onCancel, isEditing = false }: CommentFormProps) => {
  const [formData, setFormData] = useState<PostCommentRequest>({
    user_id: '999',
    author: 'Admin',
    text: '',
    image: '',
  });
  const [errors, setErrors] = useState<{ text?: string; image?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (comment) {
      // Handle both text and content fields
      const commentText = comment.text || comment.image || '';
      const image = comment.image || '';
      
      setFormData({
        user_id: '999',
        author: 'Admin',
        text: commentText,
        image: image,
      });
    }
  }, [comment]);

  const validateForm = (): boolean => {
    const newErrors: { text?: string; image?: string } = {};
    
    if (!formData.text.trim()) {
      newErrors.text = 'Comment text is required';
    }
    
    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      if (!isEditing) {
        // Reset form after successful submission if not editing
        setFormData({ 
          user_id: '999',
          author: 'Admin',
          text: '', 
          image: '' 
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Comment' : 'Add a Comment'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="text" className="form-label">
            Comment
          </label>
          <textarea
            id="text"
            name="text"
            rows={4}
            value={formData.text}
            onChange={handleChange}
            className="form-input"
            placeholder="Write your comment here..."
            disabled={isSubmitting}
          />
          {errors.text && <p className="form-error">{errors.text}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="image" className="form-label">
            Image URL (optional)
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
          />
          {errors.image && <p className="form-error">{errors.image}</p>}
        </div>
        
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : isEditing ? 'Update' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm; 