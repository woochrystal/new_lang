'use client';

import { useState, useEffect } from 'react';
import { Input, Select, Datepicker } from '@/shared/component';
import { LoggerFactory } from '@/shared/lib/logger';
import { EDUCATION_LEVELS } from '../script/constants';
import { formatPhoneNumber } from '../script/utils';
import { empApi } from '@/features/groupware/sys/emp';

import styles from './MyInfo.module.scss';

const logger = LoggerFactory.getLogger('InfoForm');

/**
 * 내정보 입력 폼 - 상단 (기본 정보 6개 필드)
 * 이름, 영어이름, 연락처, 부서, 직급, 이메일
 */
export const InfoFormTop = ({ formData, errors = {}, onChange }) => {
  // 옵션 데이터
  const [options, setOptions] = useState({
    departments: [],
    positions: []
  });

  // 옵션 로딩
  useEffect(() => {
    const fetchFormOptions = async () => {
      const result = await empApi.getFormOptions();

      if (result) {
        setOptions({
          departments: result.departments.map((dept) => ({
            value: String(dept.deptId),
            label: dept.deptNm
          })),
          positions: result.positions.map((pos) => ({
            value: String(pos.posId),
            label: pos.posNm
          }))
        });
        logger.info('[fetchFormOptions] 옵션 로드 완료:', result);
      }
    };

    fetchFormOptions();
  }, []);

  const handleChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  // 전화번호 자동 포맷팅 핸들러
  const handlePhoneChange = (field) => (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(field, formatted);
  };

  const handleSelectChange = (field) => (value) => {
    // 부서/직급 변경 시 name도 함께 업데이트
    if (field === 'department') {
      const selectedDept = options.departments.find((dept) => dept.value === value);
      onChange(field, value);
      if (selectedDept) {
        onChange('departmentName', selectedDept.label);
      }
    } else if (field === 'position') {
      const selectedPos = options.positions.find((pos) => pos.value === value);
      onChange(field, value);
      if (selectedPos) {
        onChange('positionName', selectedPos.label);
      }
    } else {
      onChange(field, value);
    }
  };

  return (
    <div className={styles.formArea}>
      <div className={styles.allFieldsGrid}>
        {/* 이름 */}
        <Input
          label="이름"
          required
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="이름을 입력하세요"
        />

        {/* 영어 이름 */}
        <Input
          label="영어 이름"
          value={formData.englishName}
          onChange={handleChange('englishName')}
          error={errors.englishName}
          placeholder="English Name"
          maxLength={100}
        />

        {/* 연락처 */}
        <Input
          label="연락처"
          variant="tel"
          value={formData.phone}
          onChange={handlePhoneChange('phone')}
          error={errors.phone}
          placeholder="010-1234-5678"
          maxLength={13}
        />

        {/* 부서 */}
        <Select
          label="부서"
          value={formData.department}
          onChange={handleSelectChange('department')}
          options={options.departments}
          placeholder="부서를 선택하세요"
        />

        {/* 직급 */}
        <Select
          label="직급"
          value={formData.position}
          onChange={handleSelectChange('position')}
          options={options.positions}
          placeholder="직급을 선택하세요"
        />

        {/* 이메일 */}
        <Input
          label="이메일"
          variant="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          placeholder="email@example.com"
        />
      </div>
    </div>
  );
};

/**
 * 내정보 입력 폼 - 하단 (추가 정보 9개 필드)
 * ID, 생년월일, 비상연락처, 학력, 주소, 상세주소, 내선번호, 입사일, 퇴사일, 비고
 */
export const InfoFormBottom = ({ formData, errors = {}, onChange }) => {
  // 옵션 데이터
  const [options, setOptions] = useState({
    educations: []
  });

  // 옵션 로딩
  useEffect(() => {
    const fetchFormOptions = async () => {
      const result = await empApi.getFormOptions();

      if (result) {
        setOptions({
          // 백엔드에서 educations를 제공하지 않으면 하드코딩된 옵션 사용
          educations:
            result.educations && result.educations.length > 0
              ? result.educations.map((edu) => ({
                  value: edu.value,
                  label: edu.label
                }))
              : EDUCATION_LEVELS
        });
        logger.info('[fetchFormOptions] 옵션 로드 완료:', result);
      }
    };

    fetchFormOptions();
  }, []);

  const handleChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  // 전화번호 자동 포맷팅 핸들러
  const handlePhoneChange = (field) => (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(field, formatted);
  };

  const handleSelectChange = (field) => (value) => {
    onChange(field, value);
  };

  const handleDateChange = (field) => (date) => {
    const dateStr = date ? date.toISOString().split('T')[0] : '';
    onChange(field, dateStr);
  };

  const handleAddressSearch = () => {
    // 다음 주소 검색 API 로드 및 실행
    const loadAndOpenPostcode = () => {
      if (!window?.daum?.Postcode) {
        logger.warn('다음 주소 API가 로드되지 않았습니다.');
        // 스크립트 로드
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
          onChange('roadAddress', address);
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
        {/* ID */}
        <Input label="ID" value={formData.id} readOnly disabled placeholder="로그인 ID" />

        {/* 생년월일 */}
        <Datepicker
          id="birthDate"
          label="생년월일"
          selected={formData.birthDate ? new Date(formData.birthDate) : null}
          onChange={handleDateChange('birthDate')}
          placeholder="생년월일 선택"
          maxDate={new Date()}
        />

        {/* 비상연락처 */}
        <Input
          label="비상연락처"
          variant="tel"
          value={formData.emergencyContact}
          onChange={handlePhoneChange('emergencyContact')}
          error={errors.emergencyContact}
          placeholder="010-1234-5678"
          maxLength={13}
        />

        {/* 학력 */}
        <Select
          label="학력"
          value={formData.education}
          onChange={handleSelectChange('education')}
          options={options.educations}
          placeholder="학력을 선택하세요"
        />

        {/* 주소 (도로명주소, 검색 버튼으로 채움) */}
        <Input
          label="주소"
          variant="search"
          value={formData.roadAddress}
          onChange={handleChange('roadAddress')}
          onSearch={handleAddressSearch}
          onClear={() => onChange('roadAddress', '')}
          readOnly
          placeholder="검색 버튼을 클릭해주세요"
          className={styles.addressInput}
        />

        {/* 상세주소 (사용자 직접 입력) */}
        <Input
          label="상세주소"
          value={formData.addressDetail}
          onChange={handleChange('addressDetail')}
          error={errors.addressDetail}
          maxLength={100}
          placeholder="상세 주소를 입력해주세요"
        />

        {/* 내선번호 */}
        <Input
          label="내선번호"
          variant="tel"
          value={formData.extension}
          onChange={handlePhoneChange('extension')}
          error={errors.extension}
          placeholder="02-1234-5678"
          maxLength={13}
          readOnly
          disabled
        />

        {/* 입사일 */}
        <Datepicker
          id="joinDate"
          label="입사일"
          selected={formData.joinDate ? new Date(formData.joinDate) : null}
          onChange={handleDateChange('joinDate')}
          placeholder="입사일 선택"
          maxDate={new Date()}
        />

        {/* 퇴사일 */}
        <Datepicker
          id="leaveDate"
          label="퇴사일"
          selected={formData.leaveDate ? new Date(formData.leaveDate) : null}
          onChange={handleDateChange('leaveDate')}
          placeholder="퇴사일 선택"
          minDate={formData.joinDate ? new Date(formData.joinDate) : null}
        />

        {/* 비고 */}
        <div className={styles.colFull}>
          <Input
            label="비고"
            value={formData.note}
            onChange={handleChange('note')}
            error={errors.note}
            placeholder="비상 연락처 등 메모"
            maxLength={500}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * 내정보 입력 폼 (전체 - 하위 호환성)
 * - 주소는 다음 주소 검색으로 도로명주소를 채우고, 상세주소는 직접 입력합니다.
 */
const InfoForm = ({ formData, errors = {}, onChange }) => {
  // 옵션 데이터
  const [options, setOptions] = useState({
    departments: [],
    positions: [],
    educations: []
  });

  // 옵션 로딩
  useEffect(() => {
    const fetchFormOptions = async () => {
      const result = await empApi.getFormOptions();

      if (result) {
        setOptions({
          departments: result.departments.map((dept) => ({
            value: String(dept.deptId),
            label: dept.deptNm
          })),
          positions: result.positions.map((pos) => ({
            value: String(pos.posId),
            label: pos.posNm
          })),
          // 백엔드에서 educations를 제공하지 않으면 하드코딩된 옵션 사용
          educations:
            result.educations && result.educations.length > 0
              ? result.educations.map((edu) => ({
                  value: edu.value,
                  label: edu.label
                }))
              : EDUCATION_LEVELS
        });
        logger.info('[fetchFormOptions] 옵션 로드 완료:', result);
      }
    };

    fetchFormOptions();
  }, []);

  const handleChange = (field) => (e) => {
    onChange(field, e.target.value);
  };

  // 전화번호 자동 포맷팅 핸들러
  const handlePhoneChange = (field) => (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(field, formatted);
  };

  const handleSelectChange = (field) => (value) => {
    // 부서/직급 변경 시 name도 함께 업데이트
    if (field === 'department') {
      const selectedDept = options.departments.find((dept) => dept.value === value);
      onChange(field, value);
      if (selectedDept) {
        onChange('departmentName', selectedDept.label);
      }
    } else if (field === 'position') {
      const selectedPos = options.positions.find((pos) => pos.value === value);
      onChange(field, value);
      if (selectedPos) {
        onChange('positionName', selectedPos.label);
      }
    } else {
      onChange(field, value);
    }
  };

  const handleDateChange = (field) => (date) => {
    const dateStr = date ? date.toISOString().split('T')[0] : '';
    onChange(field, dateStr);
  };

  const handleAddressSearch = () => {
    // 다음 주소 검색 API 로드 및 실행
    const loadAndOpenPostcode = () => {
      if (!window?.daum?.Postcode) {
        logger.warn('다음 주소 API가 로드되지 않았습니다.');
        // 스크립트 로드
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
          onChange('roadAddress', address);
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
        {/* 이름 */}
        <Input
          label="이름"
          required
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          placeholder="이름을 입력하세요"
        />

        {/* 영어 이름 */}
        <Input
          label="영어 이름"
          value={formData.englishName}
          onChange={handleChange('englishName')}
          error={errors.englishName}
          placeholder="English Name"
          maxLength={100}
        />

        {/* 연락처 */}
        <Input
          label="연락처"
          variant="tel"
          value={formData.phone}
          onChange={handlePhoneChange('phone')}
          error={errors.phone}
          placeholder="010-1234-5678"
          maxLength={13}
        />

        {/* 부서 */}
        <Select
          label="부서"
          value={formData.department}
          onChange={handleSelectChange('department')}
          options={options.departments}
          placeholder="부서를 선택하세요"
        />

        {/* 직급 */}
        <Select
          label="직급"
          value={formData.position}
          onChange={handleSelectChange('position')}
          options={options.positions}
          placeholder="직급을 선택하세요"
        />

        {/* 이메일 */}
        <Input
          label="이메일"
          variant="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          placeholder="email@example.com"
        />
      </div>

      <div className={styles.allFieldsGrid}>
        {/* ID */}
        <Input label="ID" value={formData.id} readOnly disabled placeholder="로그인 ID" />

        {/* 생년월일 */}
        <Datepicker
          id="birthDate"
          label="생년월일"
          selected={formData.birthDate ? new Date(formData.birthDate) : null}
          onChange={handleDateChange('birthDate')}
          placeholder="생년월일 선택"
          maxDate={new Date()}
        />

        {/* 비상연락처 */}
        <Input
          label="비상연락처"
          variant="tel"
          value={formData.emergencyContact}
          onChange={handlePhoneChange('emergencyContact')}
          error={errors.emergencyContact}
          placeholder="010-1234-5678"
          maxLength={13}
        />

        {/* 학력 */}
        <Select
          label="학력"
          value={formData.education}
          onChange={handleSelectChange('education')}
          options={options.educations}
          placeholder="학력을 선택하세요"
        />

        {/* 주소 (도로명주소, 검색 버튼으로 채움) */}
        <Input
          label="주소"
          variant="search"
          value={formData.roadAddress}
          onChange={handleChange('roadAddress')}
          onSearch={handleAddressSearch}
          onClear={() => onChange('roadAddress', '')}
          readOnly
          placeholder="검색 버튼을 클릭해주세요"
          className={styles.addressInput}
        />

        {/* 상세주소 (사용자 직접 입력) */}
        <Input
          label="상세주소"
          value={formData.addressDetail}
          onChange={handleChange('addressDetail')}
          error={errors.addressDetail}
          maxLength={100}
          placeholder="상세 주소를 입력해주세요"
        />

        {/* 내선번호 */}
        <Input
          label="내선번호"
          variant="tel"
          value={formData.extension}
          onChange={handlePhoneChange('extension')}
          error={errors.extension}
          placeholder="02-1234-5678"
          maxLength={13}
          readOnly
          disabled
        />

        {/* 입사일 */}
        <Datepicker
          id="joinDate"
          label="입사일"
          selected={formData.joinDate ? new Date(formData.joinDate) : null}
          onChange={handleDateChange('joinDate')}
          placeholder="입사일 선택"
          maxDate={new Date()}
        />

        {/* 퇴사일 */}
        <Datepicker
          id="leaveDate"
          label="퇴사일"
          selected={formData.leaveDate ? new Date(formData.leaveDate) : null}
          onChange={handleDateChange('leaveDate')}
          placeholder="퇴사일 선택"
          minDate={formData.joinDate ? new Date(formData.joinDate) : null}
        />

        {/* 비고 */}
        <div className={styles.colFull}>
          <Input
            label="비고"
            value={formData.note}
            onChange={handleChange('note')}
            error={errors.note}
            placeholder="비상 연락처 등 메모"
            maxLength={500}
          />
        </div>
      </div>
    </div>
  );
};

export default InfoForm;
