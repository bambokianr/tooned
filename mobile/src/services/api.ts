import axios from 'axios';

import { AppError } from '@utils/AppError';

const api = axios.create({
  baseURL: "http://15.228.166.64:3333",
  // headers: {
  //   'Accept': 'application/json',
  //   'Content-Type': 'application/json',
  // }
});

// api.interceptors.request.use((config) => {
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

api.interceptors.response.use(response => response, error => {
  if (error.response && error.response.data)
    return Promise.reject(new AppError(error.response.data.message));
  else
    return Promise.reject(error);
});

export default api;
