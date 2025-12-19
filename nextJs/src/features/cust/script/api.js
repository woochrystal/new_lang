import { apiClient } from '@/shared/api/client';
import { LoggerFactory } from '@/shared/lib/logger';

const ENDPOINT = '/api/v1/customers';
const logger = LoggerFactory.getLogger('CustAPI');

export const api = {
  async getList(params = {}) {
    const { data } = await apiClient.get(ENDPOINT, {
      params,
      _onSuccess: (response) => {
        logger.info('[api.getList] 백엔드 응답:', response.data);
        return response.data;
      }
    });
    return data;
  }
};
