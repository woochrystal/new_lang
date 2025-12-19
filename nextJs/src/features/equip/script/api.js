import { apiClient } from '@/shared/api';

const onSuccess = (res) => res.data;

export const equipApi = {
  // ============================================================================
  // 자산 (관리자)
  // ============================================================================
  getAdminList: async ({ params }) => {
    return apiClient.get('/api/v1/admin/equips', { params, _onSuccess: onSuccess });
  },
  getAdminDetail: async (id) => {
    return apiClient.get(`/api/v1/admin/equips/${id}`, { _onSuccess: onSuccess });
  },
  createByAdmin: async (data) => {
    return apiClient.post('/api/v1/admin/equips', data, { _onSuccess: onSuccess });
  },
  update: async (id, data) => {
    return apiClient.put(`/api/v1/admin/equips/${id}`, data, { _onSuccess: onSuccess });
  },
  delete: async (id) => {
    return apiClient.delete(`/api/v1/admin/equips/${id}`, { _onSuccess: onSuccess });
  },
  getTenantUsers: async () => {
    return apiClient.get('/api/v1/admin/equips/users', { _onSuccess: onSuccess });
  },
  checkAssetNoExists: async (assetNo) => {
    return apiClient.get(`/api/v1/equips/exists/${assetNo}`, { _onSuccess: onSuccess });
  },

  // --- 자산 유형 ---
  getEquipTypes: async () => {
    return apiClient.get('/api/v1/admin/equips/types', { _onSuccess: onSuccess });
  },
  createEquipType: async (data) => {
    return apiClient.post('/api/v1/admin/equips/types', data, { _onSuccess: onSuccess });
  },
  updateEquipType: async (id, data) => {
    return apiClient.put(`/api/v1/admin/equips/types/${id}`, data, { _onSuccess: onSuccess });
  },
  deleteEquipType: async (id) => {
    return apiClient.delete(`/api/v1/admin/equips/types/${id}`, { _onSuccess: onSuccess });
  },

  // ============================================================================
  // 자산 (공용) - 사용자/관리자 모두 사용
  // ============================================================================
  getModelNamesByType: async (eqpTy) => {
    return apiClient.get(`/api/v1/equips/models/${eqpTy}`, { _onSuccess: onSuccess });
  },
  getAssetsByModel: async (eqpNm) => {
    return apiClient.get(`/api/v1/equips/assets/${eqpNm}`, { _onSuccess: onSuccess });
  },
  getEquipDetailByAssetNo: async (assetNo) => {
    return apiClient.get(`/api/v1/equips/by-asset-no/${assetNo}`, { _onSuccess: onSuccess });
  },

  // ============================================================================
  // 자산 (사용자)
  // ============================================================================
  getMyList: async ({ params }) => {
    return apiClient.get('/api/v1/equips/my', { params, _onSuccess: onSuccess });
  },
  getDetail: async (id) => {
    return apiClient.get(`/api/v1/equips/${id}`, { _onSuccess: onSuccess });
  },
  claimEquip: async (data) => {
    return apiClient.post('/api/v1/equips/claim', data, { _onSuccess: onSuccess });
  },
  updateStatus: async (id, data) => {
    return apiClient.put(`/api/v1/equips/${id}/status`, data, { _onSuccess: onSuccess });
  },
  transferEquip: async (id, data) => {
    return apiClient.put(`/api/v1/equips/${id}/transfer`, data, { _onSuccess: onSuccess });
  },

  // ============================================================================
  // 실사 (관리자)
  // ============================================================================
  getSurveyList: async ({ params }) => {
    return apiClient.get('/api/v1/admin/surveys', { params, _onSuccess: onSuccess });
  },
  createSurvey: async (data) => {
    return apiClient.post('/api/v1/admin/surveys', data, { _onSuccess: onSuccess });
  },
  updateSurvey: async (id, data) => {
    return apiClient.put(`/api/v1/admin/surveys/${id}`, data, { _onSuccess: onSuccess });
  },
  deleteSurvey: async (survId) => {
    return apiClient.delete(`/api/v1/admin/surveys/${survId}`, { _onSuccess: onSuccess });
  },
  getAllSurveyChecks: async ({ params }) => {
    return apiClient.get('/api/v1/admin/surveyChecks', { params, _onSuccess: onSuccess });
  },
  getEquipListBySurveyAndUser: async ({ survId, usrId }) => {
    return apiClient.get('/api/v1/admin/surveyChecks/by-user', { params: { survId, usrId }, _onSuccess: onSuccess });
  },
  getSurveyCheckDetail: async (chkId) => {
    return apiClient.get(`/api/v1/admin/surveyChecks/${chkId}`, { _onSuccess: onSuccess });
  },
  updateBulkSurveyChecks: async (data) => {
    return apiClient.put('/api/v1/admin/equips/surveyChecks/bulkComplete', data, { _onSuccess: onSuccess });
  },

  // ============================================================================
  // 실사 (사용자)
  // ============================================================================
  getMySurveyChecks: async () => {
    return apiClient.get('/api/v1/equips/surveyChecks/my-active', { _onSuccess: onSuccess });
  },
  submitSurvey: async (data) => {
    return apiClient.put('/api/v1/equips/surveys/submit', data, { _onSuccess: onSuccess });
  },
  submitSurveyCheck: async (chkId, data) => {
    return apiClient.put(`/api/v1/equips/surveyChecks/${chkId}`, data, { _onSuccess: onSuccess });
  }
};
