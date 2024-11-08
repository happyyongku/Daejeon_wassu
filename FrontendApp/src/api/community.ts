import axios from 'axios';
import {Authapi} from './core';

// 게시글 작성 (이미지 파일 업로드)
export async function createPost(
  title: string,
  content: string,
  images: File[], // 이미지 파일 배열
) {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // 이미지 파일들을 FormData에 추가
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    const response = await Authapi.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response && response.data) {
      console.log('Post successfully created:', response.data);
      return response.data;
    } else {
      console.error('Failed to create post.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Create post error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during post creation:', err);
      return null;
    }
  }
}

// 게시글 수정 (이미지 파일 업로드)
export async function updatePost(
  postId: string,
  title: string,
  content: string,
  images: File[], // 이미지 파일 배열
) {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // 이미지 파일들을 FormData에 추가
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    const response = await Authapi.put(`/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response && response.data) {
      console.log('Post successfully updated:', response.data);
      return response.data;
    } else {
      console.error('Failed to update post.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Update post error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during post update:', err);
      return null;
    }
  }
}

// 게시글 삭제
export async function deletePost(postId: string) {
  try {
    const response = await Authapi.delete(`/posts/${postId}`);

    if (response && response.data) {
      console.log('Post successfully deleted:', response.data);
      return response.data;
    } else {
      console.error('Failed to delete post.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Delete post error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during post deletion:', err);
      return null;
    }
  }
}

// 게시글 조회
export async function getPosts(category: string) {
  try {
    const response = await Authapi.get(`/posts/${category}`);

    if (response && response.data) {
      console.log('Posts retrieved successfully:', response.data);
      return response.data;
    } else {
      console.error('Failed to retrieve posts.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get posts error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during posts retrieval:', err);
      return null;
    }
  }
}

// 게시글 상세 조회
export async function getPostDetail(postId: string) {
  try {
    const response = await Authapi.get(`/posts/${postId}`);

    if (response && response.data) {
      console.log('Post detail retrieved successfully:', response.data);
      return response.data;
    } else {
      console.error('Failed to retrieve post detail.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get post detail error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during post detail retrieval:', err);
      return null;
    }
  }
}

// 게시글 좋아요/취소
export async function toggleLike(postId: string, action: 'like' | 'unlike') {
  try {
    const response = await Authapi.post(`/posts/${postId}/likes`, {
      action,
    });

    if (response && response.data) {
      console.log('Like action successful:', response.data);
      return response.data;
    } else {
      console.error('Failed to perform like action.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Toggle like error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during like action:', err);
      return null;
    }
  }
}

// 게시글 검색
export async function searchPosts(
  query: string,
  category: string = '',
  page: number = 1,
  size: number = 10,
) {
  try {
    const response = await Authapi.post('/posts/search', null, {
      params: {query, category, page, size},
    });

    if (response && response.data) {
      console.log('Search results retrieved successfully:', response.data);
      return response.data;
    } else {
      console.error('Failed to retrieve search results.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Search posts error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during search:', err);
      return null;
    }
  }
}
