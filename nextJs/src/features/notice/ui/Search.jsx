'use client';

import { DatepickerPeriod, Input, Button } from '@/shared/component';
import layoutStyles from '@/shared/component/layout/layout.module.scss';

const NoticeSearch = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  title,
  onTitleChange,
  writerName,
  onWriterNameChange,
  onSearch,
  onClear,
  disabled = false
}) => {
  return (
    <div className={layoutStyles.hasItem03}>
      <DatepickerPeriod
        label="조회 기간"
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        startPlaceholder="시작일"
        endPlaceholder="종료일"
        disabled={disabled}
      />
      <div className={layoutStyles.itemCol1}>
        <Input label="제목" value={title} onChange={onTitleChange} placeholder="제목으로 검색..." disabled={disabled} />
      </div>
      <div className={layoutStyles.itemCol1}>
        <Input
          label="작성자"
          value={writerName}
          onChange={onWriterNameChange}
          placeholder="작성자명으로 검색..."
          disabled={disabled}
        />
      </div>
      <div className={layoutStyles.itemCol2}>
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

export default NoticeSearch;
