/**
 * @fileoverview Emp 관련 Entity 클래스 및 API 타입 정의
 * @description API 응답을 도메인 엔티티로 변환하는 클래스들
 */

import { EMP_CONSTANTS } from './constants';
import { formatDate, formatPhone } from './utils';

// ============================================
// API 응답 타입 정의
// ============================================

/**
 * API 응답 - 직원 단일 항목
 * @typedef {Object} ApiEmp
 * @property {number} empId - 직원 고유 ID
 * @property {string} empNo - 사번
 * @property {string} name - 이름
 * @property {string} userId - 사용자 ID
 * @property {string} email - 이메일
 * @property {string} department - 부서
 * @property {string} position - 직위
 * @property {string} role - 역할
 * @property {string} phone - 연락처
 * @property {string} address - 주소
 * @property {string} joinDate - 입사일 (ISO 8601 형식)
 * @property {string} workStatus - 근무상태 ('승인' | '반려' | '미결')
 * @property {string|null} profileImage - 프로필 이미지 URL
 * @property {string} regDtm - 생성일시 (ISO 8601 형식)
 * @property {string} updDtm - 수정일시 (ISO 8601 형식)
 */

/**
 * API 응답 - 직원 목록
 * @typedef {Object} ApiEmpList
 * @property {ApiEmp[]} list - 직원 목록
 * @property {number} page - 현재 페이지 번호
 * @property {number} size - 페이지 크기
 * @property {number} totalCount - 전체 직원 수
 * @property {number} totalPages - 전체 페이지 수
 */

// ============================================
// 도메인 엔티티 타입 정의
// ============================================

/**
 * 도메인 엔티티 - 직원
 * @typedef {Object} EmpEntity
 * @property {number} id - 직원 고유 ID
 * @property {string} empNo - 사번
 * @property {string} name - 이름
 * @property {string} userId - 사용자 ID
 * @property {string} email - 이메일
 * @property {string} department - 부서
 * @property {string} position - 직위
 * @property {string} role - 역할
 * @property {string} phone - 연락처
 * @property {string} address - 주소
 * @property {string} joinDate - 입사일 (ISO 8601 형식)
 * @property {string} workStatus - 근무상태
 * @property {string|null} profileImage - 프로필 이미지 URL
 * @property {string} createdAt - 생성일시 (ISO 8601 형식)
 * @property {string} updatedAt - 수정일시 (ISO 8601 형식)
 */

/**
 * 도메인 엔티티 - 페이지네이션 정보
 * @typedef {Object} PaginationEntity
 * @property {number} currentPage - 현재 페이지 번호
 * @property {number} totalPages - 전체 페이지 수
 * @property {number} pageSize - 페이지 크기
 * @property {number} totalCount - 전체 항목 수
 */

/**
 * 도메인 엔티티 - 직원 목록 (페이지네이션 포함)
 * @typedef {Object} EmpListEntity
 * @property {EmpEntity[]} list - 직원 목록
 * @property {PaginationEntity} pagination - 페이지네이션 정보
 */

/**
 * 직원 Entity 클래스
 * API 응답을 도메인 모델로 변환
 */
export class Emp {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiEmp} apiData - 백엔드 API 응답 데이터
   * @returns {EmpEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Emp.fromApi: apiData가 필요합니다.');
    }

    // 주소 파싱: 백엔드에서 "주소|상세주소" 형태로 올 수 있음
    const rawAddr = apiData.addr || apiData.address || '';
    let address = '';
    let addressDetail = '';

    if (typeof rawAddr === 'string' && rawAddr.includes('|')) {
      const [addr, detail] = rawAddr.split('|');
      address = addr || '';
      addressDetail = detail || '';
    } else {
      address = rawAddr || '';
      addressDetail = apiData.addrDetail || apiData.addressDetail || '';
    }

    // ========== 파일 정보 객체 생성 헬퍼 ==========
    /**
     * 파일 정보를 객체로 변환
     * @param {number} fileDtlId - 파일 상세 ID
     * @param {string} orgFileNm - 원본 파일명 (사용자에게 표시)
     * @returns {Object|null} 파일 정보 객체 또는 null
     */
    const createFileObject = (fileDtlId, orgFileNm) => {
      if (!fileDtlId) {
        return null;
      }

      return {
        fileDtlId,
        fileName: orgFileNm || '', // 원본 파일명을 fileName으로 사용
        orgFileNm: orgFileNm || '',
        // 이미지 미리보기 URL (inline)
        fileUrl: `/api/common/files/view/${fileDtlId}`,
        // 다운로드 URL (attachment)
        downloadUrl: `/api/common/files/download/${fileDtlId}`
      };
    };

    return {
      id: apiData.usrId || apiData.empId,
      empNo: apiData.empNo || '',
      name: apiData.usrNm || apiData.name || '',
      usrNmEn: apiData.usrNmEn || '',
      userId: apiData.loginId || apiData.userId || '',
      email: apiData.email || '',
      deptId: apiData.deptId || null,
      department: apiData.deptNm || apiData.department || '',
      posId: apiData.posId || null,
      position: apiData.posNm || apiData.position || '',
      usrAuth: apiData.usrAuth || apiData.role || '',
      role: apiData.usrAuth || apiData.role || '',
      authNm: apiData.authNm || '',
      phone: apiData.usrTel || apiData.phone || '',
      usrEmgTel: apiData.usrEmgTel || '',
      address,
      addressDetail,
      joinDate: apiData.joinDt || apiData.joinDate || '',
      quitDt: apiData.quitDt || '',
      eduLvl: apiData.eduLvl || '',
      birthDt: apiData.birthDt || '',
      note: apiData.note || '',
      empStatus: apiData.empStatus || apiData.workStatus || '미결',
      workStatus: apiData.empStatus || apiData.workStatus || '미결',

      // ========== 파일 정보 객체로 변환 (간소화) ==========
      usrPicFile: createFileObject(apiData.usrPicFileDtlId, apiData.usrPicOrgFileNm),
      usrProFile: createFileObject(apiData.usrProFileDtlId, apiData.usrProOrgFileNm),
      usrCertFile: createFileObject(apiData.usrCertFileDtlId, apiData.usrCertOrgFileNm),
      usrRefFile: createFileObject(apiData.usrRefFileDtlId, apiData.usrRefOrgFileNm),

      createdAt: apiData.regDtm || '',
      updatedAt: apiData.updDtm || apiData.regDtm || '',
      // 계약구분 (정직원, 계약직, 협력사)
      empType: apiData.empTy || ''
    };
  }

  /**
   * 직원 목록을 변환
   * @param {ApiEmp[]} apiList - 백엔드 API 응답 목록
   * @returns {EmpEntity[]} 변환된 도메인 모델 목록
   */
  static fromApiList(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('Emp.fromApiList: apiList는 배열이어야 합니다.');
    }

    return apiList.map((item) => Emp.fromApi(item));
  }

  /**
   * 테이블 표시용 데이터로 변환
   * @param {EmpEntity} emp - 도메인 모델
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터
   */
  static toTableRow(emp, rowNumber) {
    return {
      id: emp.id,
      rowNumber,
      empNo: emp.empNo, // 테이블에 표시하지 않지만 식별용으로 유지
      usrNm: emp.name,
      deptNm: emp.department,
      usrTel: formatPhone(emp.phone),
      email: emp.email,
      usrRole: emp.authNm || emp.role,
      empStatus: emp.workStatus,
      empType: emp.empType ? EMP_CONSTANTS.EMP_TYPE[emp.empType] || emp.empType : '',
      posNm: emp.position,
      originalItem: emp
    };
  }
}

/**
 * 페이지네이션 Entity 클래스
 * API 응답을 페이지네이션 모델로 변환
 */
export class Pagination {
  /**
   * 백엔드 API 응답을 페이지네이션 모델로 변환
   * @param {Object} apiData - API 응답의 페이지네이션 데이터
   * @param {number} apiData.page - 현재 페이지
   * @param {number} apiData.size - 페이지 크기
   * @param {number} apiData.totalCount - 전체 항목 수
   * @param {number} apiData.totalPages - 전체 페이지 수
   * @returns {PaginationEntity} 변환된 페이지네이션 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Pagination.fromApi: apiData가 필요합니다.');
    }

    // totalPages 계산 (백엔드가 제공하지 않는 경우 대비)
    const totalPages =
      apiData.totalPages || (apiData.totalCount && apiData.size ? Math.ceil(apiData.totalCount / apiData.size) : 1);

    return {
      currentPage: apiData.page || 1,
      totalPages,
      pageSize: apiData.size || 10,
      totalCount: apiData.totalCount || 0
    };
  }

  /**
   * 이전 페이지 존재 여부
   * @param {PaginationEntity} pagination
   * @returns {boolean}
   */
  static hasPrevious(pagination) {
    return pagination.currentPage > 1;
  }

  /**
   * 다음 페이지 존재 여부
   * @param {PaginationEntity} pagination
   * @returns {boolean}
   */
  static hasNext(pagination) {
    return pagination.currentPage < pagination.totalPages;
  }
}

/**
 * 직원 목록 Entity 클래스
 * API 응답을 직원 목록 모델로 변환
 */
export class EmpList {
  /**
   * 백엔드 API 응답을 도메인 모델로 변환
   * @param {ApiEmpList} apiData - 백엔드 API 응답 데이터
   * @returns {EmpListEntity} 변환된 도메인 모델
   */
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('EmpList.fromApi: apiData가 필요합니다.');
    }

    if (!Array.isArray(apiData.list)) {
      throw new Error('EmpList.fromApi: apiData.list는 배열이어야 합니다.');
    }

    return {
      list: Emp.fromApiList(apiData.list),
      pagination: Pagination.fromApi(apiData)
    };
  }
}
