/**
 * @fileoverview Approval API 서비스
 * @description 결재 관련 CRUD API 호출
 */

import { apiClient } from '@/shared/api/client';
import LoggerFactory from '@/shared/lib/logger';

const logger = LoggerFactory.getLogger('ApprovalAPI');

/**
 * Approval API 서비스
 */
export const aprvApi = {
  // ========================================
  // 1. 결재 상신(Draft) 관련 API
  // ========================================

  /**
   * 마지막 결재선을 가져옵니다.
   * GET /api/v1/aprv/draft/getAprvStep
   * @returns {Promise<Array<AprvStepODT>|null>} 결재선 데이터 배열 (실패 시 null)
   *
   * AprvStepODT: {
   *   aprvStep: string,    // 결재단계
   *   aprvUsrId: number,   // 결재자 ID
   *   usrNm: string,       // 결재자 이름
   *   posNm: string,       // 직급명
   *   deptNm: string       // 부서명
   * }
   */
  async getLastAprvStep() {
    const { data } = await apiClient.get('/api/v1/aprv/draft/getAprvStep', {
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 일반결재 템플릿 목록을 조회합니다.
   * GET /api/v1/aprv/draft/getTemplate
   * @returns {Promise<Array<TmplODT>|null>} 템플릿 목록 데이터 (실패 시 null)
   *
   * TmplODT: {
   *   tmplId: number,      // 템플릿 ID
   *   tmplCd: string,      // 템플릿 코드
   *   tmplTtl: string,     // 템플릿 제목
   *   tmplCtt: string      // 템플릿 내용
   * }
   */
  async getTemplateList() {
    const { data } = await apiClient.get('/api/v1/aprv/draft/getTemplate', {
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 직원 조회(결재선 선택용 - 트리 구조)
   * GET /api/v1/aprv/draft/searchEmp
   * @param {string} [name] - 검색할 직원 이름 (선택)
   * @returns {Promise<Array<AprvOrgTreeODT>|null>} 조직도 트리 데이터 (실패 시 null)
   *
   * AprvOrgTreeODT: {
   *   nodeType: string,    // 'DEPT' | 'EMP'
   *   deptId: number,      // 부서 ID
   *   deptNm: string,      // 부서명
   *   uppDeptId: number,   // 상위 부서 ID
   *   deptDepth: string,   // 부서 깊이
   *   deptOrd: number,     // 부서 순서
   *   usrId: number,       // 직원 ID (nodeType='EMP'일 때만)
   *   usrNm: string,       // 직원명
   *   posNm: string        // 직급명
   * }
   */
  async searchApproverList(name = '') {
    const { data } = await apiClient.get('/api/v1/aprv/draft/searchEmp', {
      params: name ? { name } : {},
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 직원 목록 조회(대무자 선택용)
   * GET /api/v1/aprv/draft/getEmpList
   * @returns {Promise<Array<EmpODT>|null>} 직원 목록 데이터 (실패 시 null)
   *
   * EmpODT: {
   *   usrId: number,       // 직원 ID
   *   usrNm: string,       // 직원명
   *   posNm: string,       // 직급명
   *   deptNm: string       // 부서명
   * }
   */
  async getEmployeeList() {
    const { data } = await apiClient.get('/api/v1/aprv/draft/getEmpList', {
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 일반결재를 저장합니다. (상신 또는 임시저장)
   * POST /api/v1/aprv/draft/saveGeneral
   * @param {DraftGeneIDT} draftData - 일반결재 데이터
   * @param {FileStateType} fileState - 파일 상태 (선택사항)
   * @returns {Promise<AprvIdODT|null>} 생성된 결재 ID 및 메시지 (실패 시 null)
   *
   * DraftGeneIDT: {
   *   approvers: Array<AprvStepIDT>,  // 결재선
   *   aprvTitle: string,               // 결재 제목
   *   aprvCtt: string,                 // 결재 내용
   *   aprvSts: 'REQ' | 'TEMP'          // 결재 상태
   * }
   *
   * FileStateType: {
   *   fileId: number | null,
   *   existing: Array,      // 기존 파일 목록
   *   new: Array,          // 신규 파일 목록
   *   deletedIds: Array    // 삭제된 파일 ID
   * }
   *
   * AprvStepIDT: {
   *   aprvStep: string,    // "1", "2", "3"
   *   aprvUsrId: number    // 결재자 ID
   * }
   *
   * AprvIdODT: {
   *   aprvId: number,      // 생성된 결재 ID
   *   message: string      // 성공 메시지
   * }
   */
  async saveGeneral(draftData, fileState) {
    const formData = new FormData();

    // 1. draft 데이터를 JSON Blob으로 추가
    const draftBlob = new Blob([JSON.stringify(draftData)], {
      type: 'application/json'
    });
    formData.append('draft', draftBlob);

    // 2. 파일 메타 정보 (파일이 있을 때만 추가)
    if (fileState && (fileState.new.length > 0 || fileState.existing.length > 0)) {
      const fileMeta = {
        fileId: fileState.fileId,
        deletedIds: fileState.deletedIds || [],
        shouldClearFiles:
          fileState.existing.length > 0 &&
          fileState.deletedIds.length === fileState.existing.length &&
          fileState.new.length === 0
      };
      const fileMetaBlob = new Blob([JSON.stringify(fileMeta)], {
        type: 'application/json'
      });
      formData.append('fileMeta', fileMetaBlob);
    }

    // 3. 신규 파일들
    if (fileState && fileState.new && fileState.new.length > 0) {
      fileState.new.forEach((file) => {
        formData.append('files', file);
      });
    }

    const { data } = await apiClient.post('/api/v1/aprv/draft/saveGeneral', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('[aprvApi.saveGeneral] 일반결재 저장 실패:', error);
        return error;
      }
    });
    return data;
  },

  /**
   * 휴가결재를 저장합니다. (상신 또는 임시저장)
   * POST /api/v1/aprv/draft/saveVacation
   * @param {DraftVctIDT} draftData - 휴가결재 데이터
   * @returns {Promise<AprvIdODT|null>} 생성된 결재 ID 및 메시지 (실패 시 null)
   *
   * DraftVctIDT: {
   *   approvers: Array<AprvStepIDT>,  // 결재선
   *   emgTel: string,                  // 비상연락처
   *   subId: number,                   // 대무자 ID
   *   vacTy: string,                   // 휴가유형
   *   vacRsn: string,                  // 휴가사유
   *   vacStaDt: string,                // 휴가 시작일 (YYYY-MM-DD)
   *   vacEndDt: string,                // 휴가 종료일 (YYYY-MM-DD)
   *   vacDays: number,                 // 휴가일수
   *   trfNote: string,                 // 인수인계사항
   *   aprvSts: 'REQ' | 'TEMP'          // 결재 상태
   * }
   */
  async saveVacation(draftData) {
    const { data } = await apiClient.post('/api/v1/aprv/draft/saveVacation', draftData, {
      headers: {
        'Content-Type': 'application/json'
      },
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('[aprvApi.saveVacation] 휴가결재 저장 실패:', error);
        return error;
      }
    });
    return data;
  },

  /**
   * 비용결재를 저장합니다. (상신 또는 임시저장)
   * POST /api/v1/aprv/draft/saveExpense
   * @param {DraftExpnIDT} draftData - 비용결재 데이터
   * @param {FileStateType} fileState - 파일 상태 (영수증 필수)
   * @returns {Promise<AprvIdODT|null>} 생성된 결재 ID 및 메시지 (실패 시 null)
   *
   * DraftExpnIDT: {
   *   approvers: Array<AprvStepIDT>,  // 결재선
   *   expnTy: string,                  // 비용 지불수단
   *   expnDt: string,                  // 비용 사용일자 (YYYY-MM-DD)
   *   cardNo: string,                  // 카드번호
   *   payAmt: number,                  // 비용금액
   *   expnRsn: string,                 // 비용 지출사유
   *   aprvSts: 'REQ' | 'TEMP'          // 결재 상태
   * }
   *
   * FileStateType: {
   *   fileId: number | null,
   *   existing: Array,      // 기존 파일 목록
   *   new: Array,          // 신규 파일 목록
   *   deletedIds: Array    // 삭제된 파일 ID
   * }
   */
  async saveExpense(draftData, fileState) {
    const formData = new FormData();

    // 1. draft 데이터를 JSON Blob으로 추가
    const draftBlob = new Blob([JSON.stringify(draftData)], {
      type: 'application/json'
    });
    formData.append('draft', draftBlob);

    // 2. 파일 메타 정보
    const fileMeta = {
      fileId: fileState.fileId,
      deletedIds: fileState.deletedIds || [],
      shouldClearFiles:
        fileState.existing.length > 0 &&
        fileState.deletedIds.length === fileState.existing.length &&
        fileState.new.length === 0
    };
    const fileMetaBlob = new Blob([JSON.stringify(fileMeta)], {
      type: 'application/json'
    });
    formData.append('fileMeta', fileMetaBlob);

    // 3. 신규 파일들
    if (fileState.new && fileState.new.length > 0) {
      fileState.new.forEach((file) => {
        formData.append('files', file);
      });
    }

    const { data } = await apiClient.post('/api/v1/aprv/draft/saveExpense', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('[aprvApi.saveExpense] 비용결재 저장 실패:', error);
        return error;
      }
    });
    return data;
  },

  //=======================================================================
  // 아래3개의 메서드는(updateGeneral, updateVacation, updateExpense)
  // 결재작성이 아닌 결재 상세 에서 수행되는 기능이나
  // 결재작성시 사용하는 IDT를 동일하게 재사용하기에 백엔드의 Draft패키지에 포함되어 있음
  // api.js 전체적으로 화면별로 메서드를 정리하였으나, 이 3개는 예외적으로 Draft영역에 남겨둠
  //=======================================================================

  /**
   * 일반결재 수정 후 상신 (UPDATE)
   * PUT /api/v1/aprv/draft/updateGeneral
   * @param {number} aprvId - 결재 문서 ID
   * @param {DraftGeneIDT} draftData - 수정된 결재 데이터
   * @param {FileStateType} fileState - 파일 상태
   * @returns {Promise<AprvIdODT|null>}
   *
   * FileStateType: {
   *   fileId: number | null,
   *   existing: Array,      // 기존 파일 목록
   *   new: Array,          // 신규 파일 목록
   *   deletedIds: Array    // 삭제된 파일 ID
   * }
   */
  async updateGeneral(aprvId, draftData, fileState) {
    const formData = new FormData();

    // 1. 결재 데이터 (draft)
    const draftBlob = new Blob(
      [
        JSON.stringify({
          aprvId,
          ...draftData
        })
      ],
      {
        type: 'application/json'
      }
    );
    formData.append('draft', draftBlob);

    // 2. 파일 메타 정보
    const fileMeta = {
      fileId: fileState.fileId,
      deletedIds: fileState.deletedIds || [],
      shouldClearFiles:
        fileState.existing.length > 0 &&
        fileState.deletedIds.length === fileState.existing.length &&
        fileState.new.length === 0
    };
    const fileMetaBlob = new Blob([JSON.stringify(fileMeta)], {
      type: 'application/json'
    });
    formData.append('fileMeta', fileMetaBlob);

    // 3. 신규 파일들
    if (fileState.new && fileState.new.length > 0) {
      fileState.new.forEach((file) => {
        formData.append('files', file);
      });
    }

    const { data } = await apiClient.put('/api/v1/aprv/draft/updateGeneral', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('[aprvApi.updateGeneral] 일반결재 수정 실패:', error);
        return error;
      }
    });
    return data;
  },

  /**
   * 휴가결재 수정 후 상신 (UPDATE)
   * PUT /api/v1/aprv/draft/updateVacation
   * @param {number} aprvId - 결재 문서 ID
   * @param {DraftVctIDT} draftData - 수정된 결재 데이터
   * @returns {Promise<AprvIdODT|null>}
   */
  async updateVacation(aprvId, draftData) {
    const { data } = await apiClient.put(
      '/api/v1/aprv/draft/updateVacation',
      {
        aprvId,
        ...draftData
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        _onSuccess: (response) => response.data,
        _onError: (error) => {
          logger.error('[aprvApi.updateVacation] 휴가결재 수정 실패:', error);
          return error;
        }
      }
    );
    return data;
  },

  /**
   * 비용결재 수정 후 상신 (UPDATE)
   * PUT /api/v1/aprv/draft/updateExpense
   * @param {number} aprvId - 결재 문서 ID
   * @param {DraftExpnIDT} draftData - 수정된 결재 데이터
   * @param {FileStateType} fileState - 파일 상태
   * @returns {Promise<AprvIdODT|null>}
   */
  async updateExpense(aprvId, draftData, fileState) {
    const formData = new FormData();

    // 1. 결재 데이터
    const draftBlob = new Blob(
      [
        JSON.stringify({
          aprvId,
          ...draftData
        })
      ],
      {
        type: 'application/json'
      }
    );
    formData.append('draft', draftBlob);

    // 2. 파일 메타 정보
    const fileMeta = {
      fileId: fileState.fileId,
      deletedIds: fileState.deletedIds || [],
      shouldClearFiles:
        fileState.existing.length > 0 &&
        fileState.deletedIds.length === fileState.existing.length &&
        fileState.new.length === 0
    };
    const fileMetaBlob = new Blob([JSON.stringify(fileMeta)], {
      type: 'application/json'
    });
    formData.append('fileMeta', fileMetaBlob);

    // 3. 신규 파일들
    if (fileState.new && fileState.new.length > 0) {
      fileState.new.forEach((file) => {
        formData.append('files', file);
      });
    }

    const { data } = await apiClient.put('/api/v1/aprv/draft/updateExpense', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('[aprvApi.updateExpense] 비용결재 수정 실패:', error);
        return error;
      }
    });
    return data;
  },

  // ========================================
  // 2. 결재함(Box) 관련 API
  // ========================================

  /**
   * 내 결재함 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/v1/aprv/box/getMyBoxList
   * @param {Object} [queryParams={}] - 조회 파라미터
   * @returns {Promise<MyBoxListODT|null>} 결재 문서 목록 데이터 (실패 시 null)
   *
   * MyBoxListODT: {
   *   list: Array<MyBoxODT>,
   *   page: number,
   *   size: number,
   *   totalPages: number,
   *   totalCount: number
   * }
   */
  async getMyBoxList(queryParams = {}) {
    const { data } = await apiClient.get('/api/v1/aprv/box/getMyBoxList', {
      params: queryParams,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 결재진행함 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/v1/aprv/box/getPendingBoxList
   * @param {Object} [queryParams={}] - 조회 파라미터
   * @returns {Promise<PendingBoxListODT|null>} 결재 문서 목록 데이터 (실패 시 null)
   */
  async getPendingBoxList(queryParams = {}) {
    const { data } = await apiClient.get('/api/v1/aprv/box/getPendingBoxList', {
      params: queryParams,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * ======================================
   * status 페이지이지만 내결재함/결재진행과 로직동일이기에
   * ======================================
   * 결재현황 목록을 조회합니다. (페이징, 검색 지원)
   * GET /api/v1/aprv/status/getList
   * @param {Object} [queryParams={}] - 조회 파라미터
   * @returns {Promise<StatusListODT|null>} 결재 현황 목록 데이터 (실패 시 null)
   */
  async getStatusList(queryParams = {}) {
    const { data } = await apiClient.get('/api/v1/aprv/status/getList', {
      params: queryParams,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 결재함 상세 조회
   * GET /api/v1/aprv/box/getBoxDetail
   * @param {Object} queryParams - 조회 파라미터
   * @param {number} queryParams.aprvId - 결재 문서 ID
   * @param {string} queryParams.aprvTy - 결재 유형 (GENE/VCT/EXPN)
   * @returns {Promise<VctAprvODT|GeneAprvODT|ExpnAprvODT|null>} 결재 문서 상세 데이터 (실패 시 null)
   */
  async getBoxDetail(queryParams) {
    const { data } = await apiClient.get('/api/v1/aprv/box/getBoxDetail', {
      params: queryParams,
      _onSuccess: (response) => response.data
    });
    return data;
  },

  /**
   * 결재를 회수합니다.
   * PUT /api/v1/aprv/box/withdraw
   * @param {number} aprvId - 결재 문서 ID
   * @param {string} aprvTy - 결재 유형 (GENE/VCT/EXPN)
   * @returns {Promise<Object|null>} 회수 결과 (실패 시 null)
   */
  async withdraw(aprvId, aprvTy) {
    const { data } = await apiClient.put(
      '/api/v1/aprv/box/withdraw',
      {
        aprvId,
        aprvTy
      },
      {
        _onSuccess: (response) => response.data,
        _onError: (error) => {
          logger.error('[aprvApi.withdraw] 결재 회수 실패:', error);
          return error;
        }
      }
    );
    return data;
  },

  /**
   * 결재를 승인합니다.
   * PUT /api/v1/aprv/box/approve
   * @param {UpdateAprvIDT} approveData - 승인 데이터
   * @returns {Promise<AprvActionODT|null>} 승인 결과 (실패 시 null)
   *
   * UpdateAprvIDT: {
   *   aprvId: number,      // 결재 ID
   *   aprvTy: string,      // 결재 유형 (GENE/VCT/EXPN)
   *   aprvStep: string,    // 결재 단계 (char(1) - '0', '1', '2', ...)
   *   comment: string      // 결재 의견
   * }
   *
   * AprvActionODT: {
   *   message: string      // 성공 메시지
   * }
   */
  async approve(approveData) {
    const { data } = await apiClient.put('/api/v1/aprv/box/approve', approveData, {
      headers: {
        'Content-Type': 'application/json'
      },
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('[aprvApi.approve] 결재 승인 실패:', error);
        return error;
      }
    });
    return data;
  },

  /**
   * 결재를 반려합니다.
   * PUT /api/v1/aprv/box/reject
   * @param {UpdateAprvIDT} rejectData - 반려 데이터
   * @returns {Promise<AprvActionODT|null>} 반려 결과 (실패 시 null)
   *
   * UpdateAprvIDT: {
   *   aprvId: number,      // 결재 ID
   *   aprvTy: string,      // 결재 유형 (GENE/VCT/EXPN)
   *   aprvStep: string,    // 결재 단계 (char(1) - '0', '1', '2', ...)
   *   comment: string      // 결재 의견 (반려 사유)
   * }
   *
   * AprvActionODT: {
   *   message: string      // 성공 메시지
   * }
   */
  async reject(rejectData) {
    const { data } = await apiClient.put('/api/v1/aprv/box/reject', rejectData, {
      headers: {
        'Content-Type': 'application/json'
      },
      _onSuccess: (response) => response.data,
      _onError: (error) => {
        logger.error('[aprvApi.reject] 결재 반려 실패:', error);
        return error;
      }
    });
    return data;
  }
};
