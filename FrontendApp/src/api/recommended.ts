import axios from 'axios';
import {api, fastapi} from './core';

// 추천 관광지 조회
export async function getRecommendedTouristSpots(category: string) {
  try {
    const response = await api.get(`/tourist/recommend/${category}`);
    if (response && response.data) {
      console.log('Recommended tourist spots retrieved successfully:', response.data);
      return response.data;
    } else {
      console.error('Failed to retrieve recommended tourist spots.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get recommended tourist spots error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during recommended tourist spots retrieval:', err);
      return null;
    }
  }
}

// 코스 프리셋 조회
export async function getCoursePresets() {
  try {
    const response = await api.get('/courses/presets');
    if (response && response.data) {
      console.log('Course presets retrieved successfully:', response.data);
      return response.data;
    } else {
      console.error('Failed to retrieve course presets.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get course presets error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during course presets retrieval:', err);
      return null;
    }
  }
}

// AI 코스 추천
export async function getAiRecommendedCourse() {
  try {
    const response = await fastapi.get('/courses/chatbot');
    if (response && response.data) {
      console.log('AI recommended course retrieved successfully:', response.data);
      return response.data;
    } else {
      console.error('Failed to retrieve AI recommended course.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Get AI recommended course error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during AI recommended course retrieval:', err);
      return null;
    }
  }
}

// 일정 생성
export async function createCourse(startDate: string, endDate: string) {
  try {
    const response = await api.post('/courses', {
      startDate,
      endDate,
    });

    if (response && response.data) {
      console.log('Course created successfully:', response.data);
      return response.data;
    } else {
      console.error('Failed to create course.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Create course error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during course creation:', err);
      return null;
    }
  }
}

// 일정 수정 (장소 순서 변경)
export async function updateCourseOrder(coursesId: string, updatedOrder: any) {
  try {
    const response = await api.put(`/courses/${coursesId}`, updatedOrder);

    if (response && response.data) {
      console.log('Course order updated successfully:', response.data);
      return response.data;
    } else {
      console.error('Failed to update course order.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Update course order error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during course order update:', err);
      return null;
    }
  }
}

// 장소 추가
export async function addTouristSpotToCourse(coursesId: string, touristSpot: any) {
  try {
    const response = await api.post(`/courses/${coursesId}`, touristSpot);

    if (response && response.data) {
      console.log('Tourist spot added successfully to course:', response.data);
      return response.data;
    } else {
      console.error('Failed to add tourist spot to course.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Add tourist spot error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during adding tourist spot:', err);
      return null;
    }
  }
}

// 장소 삭제
export async function deleteTouristSpotFromCourse(coursesId: string, touristId: string) {
  try {
    const response = await api.delete(`/courses/${coursesId}/tourist/${touristId}`);

    if (response && response.data) {
      console.log('Tourist spot deleted successfully from course:', response.data);
      return response.data;
    } else {
      console.error('Failed to delete tourist spot from course.');
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Delete tourist spot error (Axios):', err.response);
      return null;
    } else {
      console.error('Unexpected error during deleting tourist spot:', err);
      return null;
    }
  }
}
