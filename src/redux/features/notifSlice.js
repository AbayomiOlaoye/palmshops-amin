/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNotication, markAsRead, markAllAsRead, deleteNotif, clearNotif,
} from '../reducer/notifAction';

const notifications = localStorage.getItem('notification');

const initialState = {
  loading: false,
  notifications: notifications || [],
  error: null,
};

const notifSlice = createSlice({
  name: 'notif',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotication.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotication.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.notifications.unshift(payload);
        state.success = true;
      })
      .addCase(fetchNotication.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAsRead.fulfilled, (state, { payload }) => {
        state.loading = false;
        const notification = state.notifications.find((notif) => notif._id === payload);
        if (notification) {
          notification.isRead = true;
        }
      })
      .addCase(markAllAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading = false;
        state.notifications.forEach((notif) => {
          notif.isRead = true;
        });
      })
      .addCase(markAllAsRead.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(deleteNotif.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNotif.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.notifications = state.notifications.filter((notif) => notif._id !== payload);
        state.success = true;
      })
      .addCase(deleteNotif.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      .addCase(clearNotif.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearNotif.fulfilled, (state) => {
        state.loading = false;
        state.notifications = [];
      })
      .addCase(clearNotif.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default notifSlice.reducer;
