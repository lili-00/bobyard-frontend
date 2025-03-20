export interface Comment {
  comment_id?: string;
  user_id?: string;
  author: string;
  text?: string;
  date: string;
  likes: number;
  image?: string | null;
}

export interface PostCommentRequest {
  user_id: string;
  author: string;
  text: string;
  image: string;
}

export interface UpdateCommentRequest {
  text: string;
  image: string;
}


export interface CommentResponse {
  message: string;
  comment_id: string;
}

export interface UpdateCommentResponse {
  message: string;
  comment_id: string;
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