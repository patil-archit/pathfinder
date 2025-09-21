import axios from "axios";
import { getApiUrl } from '../config/api';

const client = axios.create({
  baseURL: getApiUrl(),
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
