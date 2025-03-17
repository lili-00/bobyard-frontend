export interface Comment {
  comment_id?: string;
  user_id?: string;
  author: string;
  text?: string;
  date: string;
  likes: number;
  image?: string | null;
}

export interface CommentFormData {
  text: string;
  image: string;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  comments?: Comment[];
  [key: string]: any;
} 