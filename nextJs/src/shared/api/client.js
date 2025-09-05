/**
 * @fileoverview API 클라이언트
 * @description Axios 기반 API 클라이언트
 *
 * 사용법:
 * import { apiClient } from '@/shared/api/client'
 * const posts = await apiClient.get('/posts')
 * const post = await apiClient.post('/post', data)
 */

import axios from 'axios';

import { API_CONFIG } from '../config/api';
import { CONTENT_TYPES } from '../constants/http';

/**
 * API 클라이언트
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': CONTENT_TYPES.JSON
  }
});

/*
 * Request Interceptor
 * 토큰 첨부 로직 필요
 */
/*
 * Response Interceptor
 * 토큰 갱신 및 에러 처리 필요
 */
export default apiClient;
