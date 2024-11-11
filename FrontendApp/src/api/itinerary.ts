import axios from 'axios';
import {Authapi, api} from './core';

export interface TouristSpot {
  id: string;
  spotName: string;
  spotAddress: string;
  liked: number;
  stamp: number;
  spotDescription: string;
  phoneNumber: string;
  businessHour: string;
  latitude: number;
  longitude: number;
  categories: {category: string}[];
  images: {image: string}[];
}

export interface ScheduleRequest {
  startDate: string;
  endDate: string;
  title: string;
  dailyPlans: {
    date: string;
    spotIds: string[];
  }[];
}

// 관광지 검색
export async function getSpots(searchText: string): Promise<TouristSpot[] | null> {
  try {
    const response = await api.get('/tourist/search', {
      params: {searchText},
    });

    if (response && response.status === 200) {
      return response.data.content as TouristSpot[];
    } else {
      console.error('Error: ', response.data);
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Axios Error: ', err.response);
    } else {
      console.error('Unexpected Error: ', err);
    }
    return null;
  }
}

// 일정 생성
export async function createSchedule(scheduleData: ScheduleRequest): Promise<string | null> {
  try {
    const response = await Authapi.post('/courses', scheduleData);

    if (response && response.status === 200) {
      console.log('Schedule created successfully:', response.data);
      return response.data;
    } else {
      console.error('Error creating schedule:', response.data);
      return null;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Axios Error:', err.response);
    } else {
      console.error('Unexpected Error:', err);
    }
    return null;
  }
}
