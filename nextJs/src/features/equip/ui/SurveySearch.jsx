'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { Input, DatepickerPeriod, Select } from '@/shared/component';
import RadioButton from '@/features/prt/ui/RadioButton';

// 스타일도 PartnerPage와 맞추기 위해 inputStyles 사용
import layoutStyles from '@/shared/component/layout/layout.module.scss';
import inputStyles from '@/shared/component/Input/Input.module.scss';

const SurveySearch = ({ searchFilters, onFilterChange, disabled }) => {
  const completionOptions = [
    { value: 'all', label: '전체' },
    { value: 'true', label: '완료' },
    { value: 'false', label: '미완료' }
  ];

  // PartnerPage.jsx 에 있던 순수 JS 로직을 여기로 가져옴
  const handlePeriodChange = (period) => {
    // 1. 종료일은 오늘
    const endDate = new Date();
    // 2. 시작일 계산을 위한 객체 생성
    const startDate = new Date();

    // PartnerPage와 동일한 계산 방식 (라이브러리 X)
    switch (period) {
      case '1M':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        // 기간 선택이 아닐 경우(직접 선택 등) 처리가 필요 없다면 break
        return;
    }

    // 부모 컴포넌트(Page)의 상태를 변경하는 함수 호출
    onFilterChange('survStaDt', startDate);
    onFilterChange('survEndDt', endDate);
    onFilterChange('periodType', period);
  };

  return (
    <>
      {/* PartnerPage처럼 wrapper 클래스로 감싸서 날짜/버튼 정렬 */}
      <div className={inputStyles.wrapper}>
        <DatepickerPeriod
          label="조회 기간"
          startDate={searchFilters.survStaDt}
          endDate={searchFilters.survEndDt}
          onStartDateChange={(date) => onFilterChange('survStaDt', date)}
          onEndDateChange={(date) => onFilterChange('survEndDt', date)}
          startPlaceholder="시작일"
          endPlaceholder="종료일"
          disabled={disabled}
        />
        <div className={layoutStyles.dateRangeBtn}>
          <RadioButton value={searchFilters.periodType} onChange={handlePeriodChange} disabled={disabled} />
        </div>
      </div>

      <Input
        label="실사명"
        value={searchFilters.survDesc}
        onChange={(e) => onFilterChange('survDesc', e.target.value)}
        disabled={disabled}
        placeholder="실사명을 입력하세요"
      />

      <Select
        label="완료 여부"
        options={completionOptions}
        value={searchFilters.isCompleted}
        onChange={(value) => onFilterChange('isCompleted', value)}
        disabled={disabled}
      />
    </>
  );
};

SurveySearch.propTypes = {
  searchFilters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default SurveySearch;
