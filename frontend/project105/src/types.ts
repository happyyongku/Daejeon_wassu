export interface ImageData {
  url: string;
}

export interface ArticleData {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  liked: number;
  user: number;
  viewCount: number;
  images: ImageData[];
  profileImage: string;
  nickName: string;
  userLiked: boolean;
  matched: boolean;
}
