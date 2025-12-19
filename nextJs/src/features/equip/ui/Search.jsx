'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from '@/shared/component';
import { EQUIP_CATEGORY_OPTIONS, EQUIP_STATUS_OPTIONS } from '@/features/equip/script/constants';
import layoutStyles from '@/shared/component/layout/layout.module.scss';

const EquipSearch = ({ searchFilters, onFilterChange, onSearch, disabled, hideFields = [] }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const isFieldHidden = (fieldName) => hideFields.includes(fieldName);

  return (
    <>
      {!isFieldHidden('eqpTy') && (
        <Select
          label="구분"
          options={EQUIP_CATEGORY_OPTIONS}
          value={searchFilters.eqpTy}
          onChange={(value) => onFilterChange('eqpTy', value)}
          disabled={disabled}
        />
      )}
      {!isFieldHidden('eqpNm') && (
        <Input
          label="모델명"
          value={searchFilters.eqpNm}
          onChange={(e) => onFilterChange('eqpNm', e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="모델명을 입력하세요"
          disabled={disabled}
        />
      )}
      {!isFieldHidden('usrNm') && (
        <Input
          label="직원명"
          value={searchFilters.usrNm}
          onChange={(e) => onFilterChange('usrNm', e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="직원명을 입력하세요"
          disabled={disabled}
        />
      )}
      {!isFieldHidden('eqpSt') && (
        <Select
          label="사용 여부"
          options={EQUIP_STATUS_OPTIONS}
          value={searchFilters.eqpSt}
          onChange={(value) => onFilterChange('eqpSt', value)}
          disabled={disabled}
        />
      )}
    </>
  );
};

EquipSearch.propTypes = {
  searchFilters: PropTypes.shape({
    eqpTy: PropTypes.string,
    eqpNm: PropTypes.string,
    usrNm: PropTypes.string,
    eqpSt: PropTypes.string
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  hideFields: PropTypes.arrayOf(PropTypes.string)
};

export default EquipSearch;
