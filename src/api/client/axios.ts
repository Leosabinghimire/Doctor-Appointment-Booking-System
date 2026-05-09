import axios from 'axios';
import { env } from '@/config';
import { setupInterceptors } from './interceptors';

export const axiosClient = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
  headers: { 'Content-Type': 'application/json' },
});

setupInterceptors(axiosClient);
