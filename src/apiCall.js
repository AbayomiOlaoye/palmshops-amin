import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signOut } from './redux/reducer/authActions';
import { store } from './redux/store';

const options = {
  theme: 'light',
  position: 'top-right',
  autoClose: 500,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

const BASE_URL = import.meta.env.VITE_APP_BASEURL;

export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const auth = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

auth.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const { token } = state.auth;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

auth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        toast.error('Session expired, please login again', options);
        store.dispatch(signOut());
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  },
);
