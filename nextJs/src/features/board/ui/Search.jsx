'use client';

import PropTypes from 'prop-types';
import { Button } from '@/shared/component';
import Input from '@/shared/component/input/Input';

const BoardSearch = ({ searchFilters, onFilterChange, onSearch, onClear, disabled }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative z-10 flex items-end gap-4 p-4 rounded-lg bg-gray-50">
      <div className="flex-1 min-w-0">
        <Input
          label="제목"
          value={searchFilters.title}
          onChange={(e) => onFilterChange('title', e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="제목으로 검색..."
          disabled={disabled}
        />
      </div>
      <div className="flex-1 min-w-0">
        <Input
          label="작성자"
          value={searchFilters.writerName}
          onChange={(e) => onFilterChange('writerName', e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="작성자명으로 검색..."
          disabled={disabled}
        />
      </div>
      <div className="flex-shrink-0 flex gap-2">
        <Button variant="primary" onClick={onSearch} disabled={disabled}>
          검색
        </Button>
        <Button variant="secondary" onClick={onClear} disabled={disabled}>
          초기화
        </Button>
      </div>
    </div>
  );
};

BoardSearch.propTypes = {
  searchFilters: PropTypes.shape({
    title: PropTypes.string,
    writerName: PropTypes.string
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

export default BoardSearch;
