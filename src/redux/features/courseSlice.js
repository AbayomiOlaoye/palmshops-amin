import { createSlice } from '@reduxjs/toolkit';
import { newCourse, fetchCourses, updateCourse, deleteCourse } from '../reducer/courseActions';

const initialState = {
  loading: false,
  courses: [],
  error: null,
  success: false,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(newCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(newCourse.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.courses = [...state.courses, payload];
        state.success = true;
      })
      .addCase(newCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.courses = payload;
        state.success = true;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCourse.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.courses = state.courses.map((course) =>
          course._id === payload._id ? payload : course
        );
        state.success = true;
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.courses = state.courses.filter((course) => course._id !== payload.id);
        state.success = true;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default courseSlice.reducer;
