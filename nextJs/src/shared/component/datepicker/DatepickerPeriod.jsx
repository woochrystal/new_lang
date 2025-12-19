import { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale'; //한국어
import 'react-datepicker/dist/react-datepicker.css'; //기본스타일
import styles from './datepicker.module.scss';
import Label from '../input/Label';
import inputStyles from '../input/input.module.scss';

/**
 * DatepickerPeriod 컴포넌트
 *
 * 시작일과 종료일을 선택할 수 있는 날짜 범위 선택 컴포넌트입니다.
 * `label` prop 제공 시, 내부적으로 `Label` 컴포넌트를 사용하여 렌더링합니다.
 *
 * @param {object} props - 컴포넌트에 전달되는 props 객체입니다.
 * @param {string} [props.label] - 입력 필드 위에 표시될 레이블 텍스트입니다.
 * @param {boolean} [props.required=false] - 필수 입력 여부입니다. `label`이 있을 때만 적용됩니다.
 * @param {string} props.id - `label`과 `input`을 연결하기 위한 id입니다. `label` prop 사용 시 필수적으로 제공해야 합니다.
 * @param {Date | null} props.startDate - 시작 날짜 값입니다. `new Date()` 또는 `null` 등을 전달합니다.
 * @param {Date | null} props.endDate - 종료 날짜 값입니다. `new Date()` 또는 `null` 등을 전달합니다.
 * @param {function(Date): void} props.onStartDateChange - 시작 날짜가 변경될 때 호출되는 콜백 함수입니다.
 * @param {function(Date): void} props.onEndDateChange - 종료 날짜가 변경될 때 호출되는 콜백 함수입니다.
 * @param {string} [props.startPlaceholder='시작일'] - 시작일 플레이스홀더 텍스트입니다.
 * @param {string} [props.endPlaceholder='종료일'] - 종료일 플레이스홀더 텍스트입니다.
 * @param {boolean} [props.disabled=false] - 비활성화 여부입니다. true일 경우 클릭 및 수정이 불가능합니다.
 *
 * @example
 * <DatepickerPeriod
 *   id="search-period"
 *   label="조회 기간"
 *   required={true}
 *   startDate={startDate}
 *   endDate={endDate}
 *   onStartDateChange={(date) => setStartDate(date)}
 *   onEndDateChange={(date) => setEndDate(date)}
 *   disabled={false}
 * />
 */
export const DatepickerPeriod = ({
  label,
  required = false,
  id,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startPlaceholder = '시작일',
  endPlaceholder = '종료일',
  disabled = false
}) => {
  const [isStartOpen, setIsStartOpen] = useState(false); // 시작일 달력 열림 상태
  const [isEndOpen, setIsEndOpen] = useState(false); // 종료일 달력 열림 상태

  //달력아이콘 커스텀
  const calendarIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M15.1071 6.04297H4.89286C4.1236 6.04297 3.5 6.66657 3.5 7.43583V15.3287C3.5 16.0979 4.1236 16.7215 4.89286 16.7215H15.1071C15.8764 16.7215 16.5 16.0979 16.5 15.3287V7.43583C16.5 6.66657 15.8764 6.04297 15.1071 6.04297Z"
        stroke="#333333"
        strokeWidth="1.11429"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.191 9.29297H3.81006"
        stroke="#333333"
        strokeWidth="1.11429"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.82153 4V5.85714"
        stroke="#333333"
        strokeWidth="1.11429"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1785 4V5.85714"
        stroke="#333333"
        strokeWidth="1.11429"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // 달력 헤더 커스텀
  const renderHeader = ({ date, decreaseMonth, increaseMonth, decreaseYear, increaseYear }) => (
    <div className={styles.customHeader}>
      <div className={`${styles.dateHeadBtn} ${styles.decreaseBtn}`}>
        <button type="button" onClick={decreaseYear}>
          <img src="/datepickerYear.png" alt="전년도 이동 버튼" />
        </button>
        <button type="button" onClick={decreaseMonth}>
          <img src="/datepickerMonth.png" alt="전월 이동 버튼" />
        </button>
      </div>

      <span className={styles.dateHeadTxt}>
        {date.getFullYear()}-{String(date.getMonth() + 1).padStart(2, '0')}
      </span>

      <div className={`${styles.dateHeadBtn} ${styles.increaseBtn}`}>
        <button type="button" onClick={increaseMonth}>
          <img src="/datepickerMonth.png" alt="다음월 이동 버튼" />
        </button>
        <button type="button" onClick={increaseYear}>
          <img src="/datepickerYear.png" alt="다음년도 이동 버튼" />
        </button>
      </div>
    </div>
  );

  // 커스텀 인풋 (단일)
  const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div
      className={`${styles.datepickerInput} ${disabled ? styles.disabled : ''}`}
      onClick={disabled ? undefined : onClick}
      ref={ref}
    >
      <input readOnly placeholder={placeholder} value={value || ''} disabled={disabled} />
      <span className={styles.icon}>{calendarIcon}</span>
    </div>
  ));

  const handleStartChange = (date) => {
    setIsStartOpen(false);
    if (onStartDateChange) {
      onStartDateChange(date);
    }
  };

  const handleEndChange = (date) => {
    setIsEndOpen(false);
    if (onEndDateChange) {
      onEndDateChange(date);
    }
  };

  const startInputId = id ? `${id}-start` : undefined;
  const endInputId = id ? `${id}-end` : undefined;

  return (
    <div className={inputStyles.wrapper}>
      {label && (
        <Label htmlFor={startInputId} required={required}>
          {label}
        </Label>
      )}
      <div className={`${styles.datepickerWrap} ${styles.datepickerGroupWrap}`}>
        <div className={styles.datepickerGroup}>
          <DatePicker
            id={startInputId}
            selected={startDate}
            onChange={handleStartChange} // 시작일 변경 시 호출
            open={isStartOpen}
            disabled={disabled}
            locale={ko} //한국어 설정
            dateFormat="yyyy-MM-dd" //선택 날짜형식
            onInputClick={() => {
              if (disabled) return;
              setIsEndOpen(false);
              setIsStartOpen(true);
            }} //시작일 클릭 시 열림
            onClickOutside={() => setIsStartOpen(false)} //바깥 클릭 시 닫기
            renderCustomHeader={renderHeader} //달력 헤드 커스텀
            customInput={<CustomInput placeholder={startPlaceholder} />} //인풋 커스텀형식으로
            shouldCloseOnSelect //선택시 자동 닫기
            showPopperArrow={false} //달력 상단 디폴트 화살표 숨기기
            popperPlacement="bottom-start" //달력 하단 왼쪽 정렬
            maxDate={endDate || undefined} // 종료일 이후 선택 방지
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
          <span className={styles.dateBridge}>~</span>
          <DatePicker
            id={endInputId}
            selected={endDate}
            onChange={handleEndChange} // 종료일 변경 시 호출
            open={isEndOpen}
            disabled={disabled}
            locale={ko} //한국어 설정
            dateFormat="yyyy-MM-dd" //선택 날짜형식
            onInputClick={() => {
              if (disabled) return;
              setIsStartOpen(false);
              setIsEndOpen(true);
            }} //종료일 클릭 시 열림
            onClickOutside={() => setIsEndOpen(false)} //바깥 클릭 시 닫기
            renderCustomHeader={renderHeader} //달력 헤드 커스텀
            customInput={<CustomInput placeholder={endPlaceholder} />} //인풋 커스텀형식으로
            shouldCloseOnSelect //선택시 자동 닫기
            showPopperArrow={false} //달력 상단 디폴트 화살표 숨기기
            popperPlacement="bottom-start" //달력 하단 왼쪽 정렬
            minDate={startDate || undefined} // 시작일 이전 선택 방지
            selectsEnd
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>
    </div>
  );
};

export default DatepickerPeriod;
