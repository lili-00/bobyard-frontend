export interface Comment {
  id?: string;
  parent?: string;
  author: string;
  text?: string;
  date: string;
  likes: number;
  image?: string | null;
  replies?: Comment[]
}

export interface PostCommentRequest {
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
  id: string;
}

export interface UpdateCommentResponse {
  message: string;
  id: string;
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