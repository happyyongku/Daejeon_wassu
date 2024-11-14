export interface ImageData {
  url: string;
  alt: string;
}

export interface LocaImgData {
  imageId: number;
  imageUrl: string;
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
export interface ReviewImageData {
  reviewImageId: number;
  imageUrl: string;
}

export interface ProfileData {
  email: string;
  nickname: string;
  birthYear: number;
  gender: string;
  level: string;
  exp: number;
  profileImage: string;
}

export interface ReviewData {
  reviewId: number;
  content: string;
  likeCount: number;
  profile: ProfileData;
  reviewImages: ReviewImageData[];
}

export interface LocationData {
  id: number;
  businessHours: string;
  categories: CategoryData[];
  touristSpotImages: LocaImgData[];
  latitude: number;
  longitude: number;
  liked: number;
  phoneNumber: string;
  spotAddress: string;
  spotDescription: string;
  spotName: string;
  stamp: boolean;
  reviewCount: number;
  favoritesCount: number;
  favorite: boolean;
  phone: string;
  reviews: ReviewData[]; // reviews 배열은 ReviewData 타입의 객체들을 포함
  images: Array<{ image: string }>;
  stamped: boolean;
}

export interface CourseData {
  id: number;
  course_name: string;
  description: string;
  image_url: string;
}
