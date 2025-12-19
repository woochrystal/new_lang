import { CUST_CONSTANTS } from './constants';
import { formatDate, formatContractPeriod, formatPhone } from './utils';

export class Cust {
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('Cust.fromApi: apiData가 필요합니다.');
    }

    return {
      id: apiData.tenantId,
      tenantName: apiData.tenantNm || '',
      domainPath: apiData.domainPath || '',
      tenantStatus: apiData.tenantSt || '',
      contractStartDate: apiData.cntrtStaDt || '',
      contractEndDate: apiData.cntrtEndDt || '',
      voucherYn: apiData.voucherYn || 'N',
      managerName: apiData.mgrNm || '',
      managerEmail: apiData.mgrEmail || '',
      tenantTel: apiData.tenantTel || '',
      registeredAt: apiData.regDtm || ''
    };
  }

  static fromApiList(apiList) {
    if (!Array.isArray(apiList)) {
      throw new Error('Cust.fromApiList: apiList는 배열이어야 합니다.');
    }
    return apiList.map((item) => Cust.fromApi(item));
  }

  static toTableRow(cust, rowNumber) {
    return {
      id: cust.id,
      rowNumber,
      tenantName: cust.tenantName,
      domainPath: cust.domainPath,
      tenantStatus: cust.tenantStatus,
      contractPeriod: formatContractPeriod(cust.contractStartDate, cust.contractEndDate),
      voucherYn: CUST_CONSTANTS.VOUCHER_YN[cust.voucherYn] || cust.voucherYn,
      managerName: cust.managerName,
      managerEmail: cust.managerEmail,
      tenantTel: formatPhone(cust.tenantTel),
      registeredAt: formatDate(cust.registeredAt),
      originalItem: cust
    };
  }
}

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
}

export class CustList {
  static fromApi(apiData) {
    if (!apiData) {
      throw new Error('CustList.fromApi: apiData가 필요합니다.');
    }

    if (!Array.isArray(apiData.list)) {
      throw new Error('CustList.fromApi: apiData.list는 배열이어야 합니다.');
    }

    return {
      list: Cust.fromApiList(apiData.list),
      pagination: Pagination.fromApi(apiData)
    };
  }
}
