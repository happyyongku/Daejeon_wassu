export interface ImageData {
  url: string;
}

export interface LocaImgData {
  image: string;
}

export interface CategoryData {
  category: string;
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

export interface LocationData {
  id: number;
  businessHour: string;
  categories: CategoryData[];
  images: LocaImgData[];
  latitude: number;
  longitude: number;
  liked: number;
  phoneNumber: string;
  spotAddress: string;
  spotDescription: string;
  spotName: string;
  stamp: boolean;
}
