'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from '@/shared/component';
import { SURVEY_STATUS_OPTIONS } from '@/features/equip/script/constants';
import layoutStyles from '@/shared/component/layout/layout.module.scss';

const SurveyCheckSearch = ({
  searchFilters,
  onFilterChange,
  onSearch,
  disabled,
  surveyOptions = [],
  showFields = []
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const shouldShow = (field) => showFields.includes(field);

  return (
    <>
      {shouldShow('survId') && (
        <Select
          label="실사회차"
          options={surveyOptions}
          value={searchFilters.survId}
          onChange={(value) => onFilterChange('survId', value)}
          disabled={disabled}
        />
      )}
      {shouldShow('survChkYn') && (
        <Select
          label="실사상태"
          options={SURVEY_STATUS_OPTIONS}
          value={searchFilters.survChkYn}
          onChange={(value) => onFilterChange('survChkYn', value)}
          disabled={disabled}
        />
      )}
      {shouldShow('usrNm') && (
        <Input
          label="사용자"
          value={searchFilters.usrNm}
          onChange={(e) => onFilterChange('usrNm', e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      )}
      {shouldShow('eqpNm') && (
        <Input
          label="자산명"
          value={searchFilters.eqpNm}
          onChange={(e) => onFilterChange('eqpNm', e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      )}
    </>
  );
};

SurveyCheckSearch.propTypes = {
  searchFilters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  surveyOptions: PropTypes.array,
  showFields: PropTypes.arrayOf(PropTypes.string)
};

SurveyCheckSearch.defaultProps = {
  showFields: ['survId', 'survChkYn', 'usrNm', 'eqpNm']
};

export default SurveyCheckSearch;
