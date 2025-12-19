import { formatDate } from './utils';

export class Pagination {
  static fromApi(apiData) {
    if (!apiData) {
      return { currentPage: 1, totalPages: 1, pageSize: 10, totalCount: 0 };
    }
    return {
      currentPage: apiData.currentPage || 1,
      totalPages: apiData.totalPages || 1,
      pageSize: apiData.pageSize || 10,
      totalCount: apiData.totalCount || 0
    };
  }
}

export class Inquiry {
  static fromApi(apiData) {
    if (!apiData) {
      return null;
    }

    let status;
    if (apiData.inqSt === 'CMPL') {
      status = 'COMPLETED'; // 처리완료
    } else if (apiData.inqSt === 'PROC') {
      status = 'IN_PROGRESS'; // 확인중
    } else {
      status = 'PENDING'; // 답변대기 (REQ)
    }

    const inquiryObject = {
      id: apiData.inqId,
      title: apiData.inqTitle || '',
      content: apiData.inqCtt || '',
      author: apiData.usrNm || '',
      createdAt: apiData.regDtm || '',
      status, // inqSt 기반으로 상태 매핑
      answer: apiData.ansCtt || null,
      usrId: apiData.usrId || apiData.regId || null,
      fileId: apiData.fileId,
      fileList: apiData.fileList || []
    };
    return inquiryObject;
  }

  static toTableRow(inquiry, rowNumber) {
    let displayStatus;
    if (inquiry.status === 'COMPLETED') {
      displayStatus = '처리완료';
    } else if (inquiry.status === 'IN_PROGRESS') {
      displayStatus = '확인중';
    } else {
      displayStatus = '답변대기';
    }

    return {
      id: inquiry.id,
      rowNumber,
      title: inquiry.title,
      author: inquiry.author,
      createdAt: formatDate(inquiry.createdAt),
      status: displayStatus,
      originalItem: inquiry
    };
  }
}

export class InquiryList {
  static fromApi(apiData) {
    if (!apiData || !apiData.list || !apiData.pagination) {
      return { list: [], pagination: Pagination.fromApi(null) };
    }

    const list = apiData.list.map((item) => Inquiry.fromApi(item));
    const pagination = Pagination.fromApi(apiData.pagination);

    return { list, pagination };
  }
}
