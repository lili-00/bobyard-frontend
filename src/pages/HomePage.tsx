import { useState } from 'react';
import CommentsList from '../components/CommentsList';
import CommentForm from '../components/CommentForm';
import { CommentFormData } from '../types/commentTypes';
import { postComment } from '../api/apiClient';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddComment = async (data: CommentFormData) => {
    try {
      await postComment(data);
      toast.success('Comment added successfully');
      // Trigger a refresh of the comments list
      setRefreshKey(prevKey => prevKey + 1);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add comment';
      toast.error(errorMessage);
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <CommentForm onSubmit={handleAddComment} />
      </section>
      
      <section key={refreshKey}>
        <CommentsList />
      </section>
    </div>
  );
};

export default HomePage; 