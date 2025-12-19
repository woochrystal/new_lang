/*
 * path           : features/groupware/sys/info/ui
 * fileName       : page.jsx
 * author         : Park ChangHyeon
 * date           : 25.12.16
 * description    : 회사 정보 입력 폼
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.12.16        Park ChangHyeon       최초 생성
 */
'use client';

import { Input, FileUpload } from '@/shared/component';
import { LoggerFactory } from '@/shared/lib/logger';
import { formatPhoneNumber, formatBusinessNumber } from '../script/utils';

import styles from './CompanyInfo.module.scss';

const logger = LoggerFactory.getLogger('CompanyInfoForm');

const CompanyInfoForm = ({ formData, errors = {}, onChange, onFileUpload, onFileDelete }) => {
  const handleChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  const handlePhoneChange = (field) => (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(field, formatted);
  };

  const handleBusinessNumberChange = (field) => (e) => {
    const formatted = formatBusinessNumber(e.target.value);
    onChange(field, formatted);
  };

  const handleManagerPhoneChange = (field) => (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(field, formatted);
  };

  const handleAddressSearch = () => {
    const loadAndOpenPostcode = () => {
      if (!window?.daum?.Postcode) {
        logger.warn('다음 주소 API가 로드되지 않았습니다.');
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.onload = () => {
          logger.info('다음 주소 스크립트 로드 완료');
          openPostcode();
        };
        script.onerror = () => {
          logger.error('다음 주소 스크립트 로드 실패');
          alert('주소 검색 서비스를 이용할 수 없습니다.');
        };
        document.head.appendChild(script);
      } else {
        openPostcode();
      }
    };

    const openPostcode = () => {
      new window.daum.Postcode({
        oncomplete: (data) => {
          const address = data.roadAddress || data.address || '';
          logger.info('주소 선택 완료: {}', address);
          onChange('addr', address);
        },
        theme: {
          bgColor: '#FFFFFF',
          searchBgColor: '#F8F9FA',
          contentBgColor: '#FFFFFF',
          pageBgColor: '#FFFFFF',
          textColor: '#333333',
          queryTextColor: '#222222',
          postcodeTextColor: '#4A90E2',
          emphTextColor: '#4A90E2',
          outlineColor: '#E0E0E0'
        }
      }).open();
    };

    loadAndOpenPostcode();
  };

  return (
    <div className={styles.formArea}>
      <div className={styles.allFieldsGrid}>
        {/* 1. 기업명 */}
        <Input
          label="기업명"
          required
          value={formData.tenantName}
          onChange={handleChange('tenantName')}
          error={errors.tenantName}
          placeholder="기업명을 입력하세요"
          maxLength={100}
        />

        {/* 2. 도메인 경로 */}
        <Input label="도메인 경로 (URL)" value={formData.domainPath} readOnly disabled placeholder="도메인 경로" />

        {/* 3. 관리자 로그인 아이디 */}
        <Input
          label="관리자 로그인 아이디"
          value={formData.loginId}
          readOnly
          disabled
          placeholder="관리자 로그인 아이디"
        />

        {/* 4. 관리자 이름 */}
        <Input
          label="관리자 이름"
          value={formData.mgrNm}
          onChange={handleChange('mgrNm')}
          error={errors.mgrNm}
          placeholder="관리자 이름을 입력하세요"
          maxLength={50}
        />

        {/* 5. 관리자 이메일 */}
        <Input
          label="관리자 이메일"
          variant="email"
          value={formData.mgrEmail}
          onChange={handleChange('mgrEmail')}
          error={errors.mgrEmail}
          placeholder="admin@company.com"
          maxLength={100}
        />

        {/* 6. 관리자 전화번호 */}
        <Input
          label="관리자 전화번호"
          variant="tel"
          value={formData.mgrTel}
          onChange={handleManagerPhoneChange('mgrTel')}
          error={errors.mgrTel}
          placeholder="010-1234-5678"
          maxLength={13}
        />

        {/* 7. 사업자번호 */}
        <Input
          label="사업자번호"
          variant="tel"
          value={formData.bizRegNo}
          onChange={handleBusinessNumberChange('bizRegNo')}
          error={errors.bizRegNo}
          placeholder="123-45-67890"
          maxLength={12}
        />

        {/* 8. 사업자등록증 */}
        <FileUpload
          label="사업자등록증"
          fileType="businessLicense"
          fileState={formData.businessLicense}
          onUpload={onFileUpload}
          onDelete={onFileDelete}
          required={false}
        />

        {/* 9. 주소 (도로명주소, 검색 버튼으로 채움) */}
        <Input
          label="주소"
          variant="search"
          value={formData.addr}
          onChange={handleChange('addr')}
          onSearch={handleAddressSearch}
          onClear={() => onChange('addr', '')}
          readOnly
          placeholder="검색 버튼을 클릭해주세요"
          className={styles.addressInput}
        />

        {/* 10. 상세주소 (사용자 직접 입력) */}
        <Input
          label="상세주소"
          value={formData.addrDetail}
          onChange={handleChange('addrDetail')}
          error={errors.addrDetail}
          placeholder="상세주소를 입력하세요"
          maxLength={100}
        />

        {/* 11. 회사 전화번호 */}
        <Input
          label="회사 전화번호"
          variant="tel"
          value={formData.telNo}
          onChange={handlePhoneChange('telNo')}
          error={errors.telNo}
          placeholder="02-1234-5678"
          maxLength={13}
        />

        {/* 12. 기업로고이미지 */}
        <FileUpload
          label="기업로고이미지"
          fileType="logoImage"
          fileState={formData.logoImage}
          onUpload={onFileUpload}
          onDelete={onFileDelete}
          required={false}
        />
      </div>
    </div>
  );
};

export default CompanyInfoForm;
