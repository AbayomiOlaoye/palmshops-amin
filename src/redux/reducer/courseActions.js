import { createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../apiCall';

export const newCourse = createAsyncThunk(
  'courses/newCourse',
  async (courses, { rejectWithValue }) => {
    try {
      const { data } = await auth.post('/courses', courses);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await auth.get('/courses');
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async (courseInfo, { rejectWithValue }) => {
    try {
      const { data } = await auth.put(`/courses/${courseInfo._id}/update`, courseInfo);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { rejectWithValue }) => {
    try {
      await auth.delete(`/courses/${id}`);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
