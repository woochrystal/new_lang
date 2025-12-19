'use client';

import { Input, Label } from '@/shared/component';
import styles from '@/shared/component/layout/layout.module.scss';

const CustSearch = function (props) {
  const { tenantName, onTenantNameChange, onSearch } = props;

  const handleClear = function () {
    onTenantNameChange({ target: { value: '' } });
  };

  return (
    <div className={`${styles.hasItem02}`}>
      <div>
        <Label>고객사명</Label>
        <Input
          variant="search"
          value={tenantName}
          onChange={onTenantNameChange}
          onSearch={onSearch}
          onClear={handleClear}
          placeholder="고객사명을 입력하세요"
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default CustSearch;
