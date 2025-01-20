import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const token = localStorage.getItem('token');
const options = {
  theme: 'light',
  position: 'bottom-right',
  autoClose: 2000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const fetchNotication = createAsyncThunk(
  'notif/fetchNotification',
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `${process.env.REACT_APP_BASEURL}/notification/`,
        config,
      );

      localStorage.setItem('notifications', data);
      console.log(data);

      return data;
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 400) {
        toast.error(error.response.data.error, options);
      } else {
        toast.error('Check your internet connection and try again', options);
      }
      return rejectWithValue(error.response.data.error);
    }
  },
);

export const markAsRead = createAsyncThunk(
  'notif/markAsRead',
  async (notifId, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${process.env.REACT_APP_BASEURL}/notification/${notifId}`,
        {},
        config,
      );

      return data;
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 400) {
        toast.error(error.response.data.error, options);
      } else {
        toast.error('Check your internet connection and try again', options);
      }
      return rejectWithValue(error.response.data.error);
    }
  },
);

export const markAllAsRead = createAsyncThunk(
  'notif/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${process.env.REACT_APP_BASEURL}/notification/all`,
        {},
        config,
      );

      return data;
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Check your internet connection and try again', options);
      }
      toast.error(error.response.data.error, options);
      return rejectWithValue(error.response.data.error);
    }
  },
);

export const deleteNotif = createAsyncThunk(
  'notif/deleteNotif',
  async (notifId, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.delete(
        `${process.env.REACT_APP_BASEURL}/notification/delete/${notifId}`,
        config,
      );

      return data;
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 400) {
        toast.error(error.response.data.error, options);
      } else {
        toast.error('Check your internet connection and try again', options);
      }
      return rejectWithValue(error.response.data.error);
    }
  },
);

export const clearNotif = createAsyncThunk(
  'notif/clearNotif',
  async (_, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.delete(
        `${process.env.REACT_APP_BASEURL}/notification/clear`,
        config,
      );

      return data;
    } catch (error) {
      if (error.response.status === 401 || error.response.status === 400) {
        toast.error(error.response.data.error, options);
      } else {
        toast.error('Check your internet connection and try again', options);
      }
      return rejectWithValue(error.response.data.error);
    }
  },
);
