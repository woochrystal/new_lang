/**
 * @fileoverview JoinMng Entity 클래스
 * @description API 응답을 도메인 엔티티로 변환
 */

/**
 * @typedef {Object} ApiJoinMngList
 * @property {ApiJoinMng[]} list
 * @property {number} page
 * @property {number} size
 * @property {number} totalCount
 * @property {number} totalPages
 */

/**
 * @typedef {Object} ApiJoinMng
 * @property {number} joinId
 * @property {string} domainPath
 * @property {string} tenantNm
 * @property {string} joinSt
 * @property {string} bsnsRegNo
 * @property {string} tenantTel
 * @property {string} addr
 * @property {string} mgrEmail
 * @property {string} mgrNm
 * @property {string} mgrTel
 * @property {string} regDtm
 */

//상태 표시를 위한 component
import { Tag } from '@/shared/component';

export class Pagination {
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Pagination.fromApi: apiData가 필요합니다.');
    }

    return {
      currentPage: apiData.page || 1,
      totalPages: apiData.totalPages || 1,
      pageSize: apiData.size || 10,
      totalCount: apiData.totalCount || 0
    };
  }

  static hasPrevious(pagination) {
    return pagination.currentPage > 1;
  }

  static hasNext(pagination) {
    return pagination.currentPage < pagination.totalPages;
  }
}

export class JoinMng {
  static getStatusName(statusCode) {
    switch (statusCode) {
      case 'PENDING':
        return '대기';
      case 'APPROVED':
        return '승인';
      case 'DENIED':
        return '반려';
      default:
        return '';
    }
  }

  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('JoinMng.fromApi: apiData가 필요합니다.');
    }

    const joinSt = apiData.joinSt || apiData.join_st;

    return {
      joinId: apiData.joinId || apiData.join_id,
      domainPath: apiData.domainPath || apiData.domain_path || '',
      tenantNm: apiData.tenantNm || apiData.tenant_nm || '',
      joinSt,
      bsnsRegNo: apiData.bsnsRegNo || apiData.bsns_reg_no || '',
      tenantTel: apiData.tenantTel || apiData.tenant_tel || '',
      addr: (apiData.addr || '').replace('|', ' '), // '|' 문자를 공백으로 대체
      mgrEmail: apiData.mgrEmail || apiData.mgr_email || '',
      mgrNm: apiData.mgrNm || apiData.mgr_nm || '',
      mgrTel: apiData.mgrTel || apiData.mgr_tel || '',
      regDtm: apiData.regDtm || apiData.reg_dtm || '',
      apprStatusNm: JoinMng.getStatusName(joinSt),
      // 첨부파일 정보
      bsnsFileDtlId: apiData.bsnsFileDtlId || apiData.bsns_file_dtl_id || null,
      bsnsFileNm: apiData.bsnsFileNm || apiData.bsns_file_org_nm || '',
      logoFileDtlId: apiData.logoFileDtlId || apiData.logo_file_dtl_id || null,
      logoFileNm: apiData.logoFileNm || apiData.logo_file_org_nm || ''
    };
  }

  /**
   * 테이블 표시용 데이터로 변환
   * @param {JoinMngEntity} joinMng - 도메인 모델
   * @param {number} rowNumber - 행 번호
   * @returns {Object} 테이블 표시용 데이터
   */
  static toTableRow(joinMng, rowNumber) {
    //variant 기준으로 Tag 스타일 계산
    let variant = 'default';
    let label = joinMng.apprStatusNm;

    switch (joinMng.joinSt) {
      case 'APPROVED':
        variant = 'success';
        label = '승인';
        break;
      case 'PENDING':
        variant = 'info';
        label = '대기';
        break;
      case 'DENIED':
        variant = 'danger';
        label = '반려';
        break;
    }

    return {
      joinId: joinMng.joinId,
      rowNumber,
      regDtm: joinMng.regDtm,
      tenantNm: joinMng.tenantNm,
      domainPath: joinMng.domainPath,
      mgrNm: joinMng.mgrNm,
      mgrTel: joinMng.mgrTel,
      // apprStatusNm: joinMng.apprStatusNm,
      apprStatusNm: (
        <Tag variant={variant} size="txtOnly">
          {label}
        </Tag>
      ),
      originalItem: joinMng
    };
  }
}

export class JoinMngList {
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('JoinMngList.fromApi: apiData가 필요합니다.');
    }

    return {
      list: Array.isArray(apiData.list) ? apiData.list.map((item) => JoinMng.fromApi(item)) : [],
      pagination: Pagination.fromApi(apiData)
    };
  }
}
