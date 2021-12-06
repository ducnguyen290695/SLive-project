import axios from 'axios';
import Router from 'next/router';
import { notification } from 'antd';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN } from '@/src/config/constants';

const instance = axios.create({});

instance.interceptors.response.use(
  response => response,
  async error => {
    const errorResponse = error.response;
    if (errorResponse && errorResponse.status === 401) {
      setTimeout(() => {
        notification.error({
          message: 'Unauthorized',
          duration: 2.5,
        });
      }, 0);
      Cookies.get(ACCESS_TOKEN) && Cookies.remove(ACCESS_TOKEN);
      await Router.push('/login');
    }
    return Promise.reject(error.response);
  },
);

export default instance;
