/*
 * path           : src/shared/api/mock/mockData/system.js
 * fileName       : system
 * author         : changhyeon
 * date           : 25. 11. 12.
 * description    : 시스템/인증 관련 Mock 데이터 (사용자, 테넌트)
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 12.       changhyeon       초기 생성 (mockData.js 도메인 분리)
 */

/**
 * 개발 모드 사용자 정보
 */
export const user = {
  usrId: 999,
  usrNm: '개발자',
  loginId: 'dev',
  usrRole: 'ADMIN',
  tenantId: 1,
  deptId: 1,
  deptNm: '개발팀',
  permissions: ['*.read', 'admin.*', 'vacation.write', 'expense.write', 'member.write', 'approval.write'],
  features: []
};

/**
 * 개발 모드 테넌트 정보
 */
export const tenant = {
  id: 1,
  name: '펜타에스_dev',
  code: 'pentaware',
  tenantPath: 'pentaware'
};

/**
 * 회사 정보 Mock 데이터
 */
export const companyInfo = {
  tenantName: '펜타웨어',
  domainPath: 'https://pentaware.com/groupware',
  loginId: 'admin_pentaware',
  bizRegNo: '123-45-67890',
  mgrNm: '김관리',
  mgrEmail: 'admin@pentaware.com',
  mgrTel: '010-1234-5678',
  telNo: '02-1234-5678',
  addr: '서울 강서구 양천로 532',
  addrDetail: '더미빌딩 10층',
  logoFileDtlId: 'dummy-logo-1',
  logoOrgFileNm: 'company_logo.png',
  licenseFileDtlId: 'dummy-license-1',
  licenseOrgFileNm: 'business_license.pdf',
  meta: {
    permissions: ['edit']
  }
};
