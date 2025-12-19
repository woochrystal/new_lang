/*
 * path           : features/groupware/sys/info/script
 * fileName       : utils.js
 * author         : Park ChangHyeon
 * date           : 25.12.16
 * description    : 회사 정보 페이지 유틸리티 함수
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.12.16        Park ChangHyeon       최초 생성
 */

const formatDomestic = (numbers) => {
  // 서울(02)인 경우
  if (numbers.startsWith('02')) {
    if (numbers.length <= 2) {
      return numbers;
    }
    if (numbers.length <= 5) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    }
    if (numbers.length <= 9) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
    }
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  }

  // 그 외 지역번호/휴대폰 번호 (0xx)
  if (numbers.length <= 3) {
    return numbers;
  }
  if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }
  if (numbers.length <= 10) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * 전화번호 포맷팅
 * - 국내 번호: 0xx-xxxx-xxxx 자동 포맷팅
 * - 국제 번호: 사용자가 입력한 포맷 유지 (+)
 * @param {string} value - 입력값
 * @returns {string} 포맷팅된 전화번호
 */
export const formatPhoneNumber = (value) => {
  if (!value) {
    return '';
  }

  // 국제전화(+)인 경우 자동 포맷팅 하지 않음 (사용자 입력 유지)
  if (value.startsWith('+')) {
    return value;
  }

  // 국내 번호 포맷팅
  return formatDomestic(value.replace(/\D/g, ''));
};

/**
 * 사업자번호 포맷팅 (123-45-67890 형식)
 * @param {string} value - 입력값
 * @returns {string} 포맷팅된 사업자번호
 */
export const formatBusinessNumber = (value) => {
  if (!value) {
    return '';
  }

  // 숫자만 추출
  const numbers = value.replace(/\D/g, '');

  // 길이에 따라 포맷팅
  if (numbers.length <= 3) {
    return numbers;
  }
  if (numbers.length <= 5) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
};

/**
 * 주소를 파이프로 분리하여 도로명주소와 상세주소로 분리
 * @param {string} fullAddress - 전체 주소 (도로명|상세주소 형식)
 * @returns {Object} { roadAddress, addressDetail }
 */
export const splitAddress = (fullAddress = '') => {
  if (typeof fullAddress !== 'string' || !fullAddress.includes('|')) {
    return { roadAddress: fullAddress || '', addressDetail: '' };
  }

  const [roadAddress, addressDetail] = fullAddress.split('|');
  return {
    roadAddress: roadAddress || '',
    addressDetail: addressDetail || ''
  };
};

/**
 * 도로명주소와 상세주소를 파이프로 조합
 * @param {string} roadAddress - 도로명주소
 * @param {string} addressDetail - 상세주소
 * @returns {string} 조합된 주소 (도로명|상세주소)
 */
export const combineAddress = (roadAddress = '', addressDetail = '') => {
  if (!roadAddress) {
    return '';
  }
  if (!addressDetail) {
    return roadAddress;
  }
  return `${roadAddress}|${addressDetail}`;
};

/**
 * 파일 상태 생성 헬퍼 함수
 * @param {string|null} fileDtlId - 파일 상세 ID
 * @param {string|null} orgFileNm - 원본 파일명
 * @returns {Object} fileState 구조
 */
export const createFileState = (fileDtlId, orgFileNm) => {
  if (!fileDtlId) {
    return { saved: null, new: null, deleted: false };
  }

  return {
    saved: {
      fileDtlId,
      fileName: orgFileNm || '',
      orgFileNm: orgFileNm || '',
      fileUrl: `/api/common/files/view/${fileDtlId}`
    },
    new: null,
    deleted: false
  };
};
