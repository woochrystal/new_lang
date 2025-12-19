import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale'; //한국어
import 'react-datepicker/dist/react-datepicker.css'; //기본스타일
import styles from './datepicker.module.scss';
import Label from '../input/Label'; // Label 컴포넌트 import
import inputStyles from '../input/input.module.scss'; // Input 컴포넌트 스타일

/**
 * Datepicker 컴포넌트
 *
 * react-datepicker 라이브러리를 기반으로 커스텀 스타일 및 기능이 적용된 날짜 선택 컴포넌트입니다.
 * `label` prop 제공 시, 내부적으로 `Label` 컴포넌트를 사용하여 렌더링합니다.
 *
 * @param {object} props - 컴포넌트에 전달되는 props 객체입니다.
 * @param {string} [props.label] - 입력 필드 위에 표시될 레이블 텍스트입니다.
 * @param {boolean} [props.required=false] - 필수 입력 여부입니다. `label`이 있을 때만 적용됩니다.
 * @param {string} props.id - `label`과 `input`을 연결하기 위한 id입니다. `label` prop 사용 시 필수적으로 제공해야 합니다.
 * @param {Date | null} props.selected - 현재 선택된 날짜 값입니다. `new Date()` 또는 `null` 등을 전달합니다.
 * @param {function(Date): void} props.onChange - 날짜가 변경될 때 호출되는 콜백 함수입니다. 변경된 `Date` 객체를 인자로 받습니다.
 * @param {string} [props.placeholder='사용일'] - 날짜가 선택되지 않았을 때 표시될 플레이스홀더 텍스트입니다.
 * @param {boolean} [props.disabled=false] - 비활성화 여부입니다. true일 경우 클릭 및 수정이 불가능합니다.
 * @param {object} [props....] - `react-datepicker`의 다른 모든 유효한 props를 전달할 수 있습니다.
 *
 * @example
 * <Datepicker
 *   id="birth-date"
 *   label="생년월일"
 *   required={true}
 *   selected={date}
 *   onChange={(newDate) => setDate(newDate)}
 *   disabled={false}
 * />
 */
export default function Datepicker({
  label,
  required = false,
  id,
  selected,
  onChange,
  placeholder = '사용일',
  disabled = false,
  clearButton = true,
  ...props
}) {
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

  // x 아이콘 커스텀
  const clearIcon = (
    // <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    //   <path d="M12 4L4 12" stroke="#999999" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    //   <path d="M4 4L12 12" stroke="#999999" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
    // </svg>
    <img src="/delete.png" alt="검색어 삭제" />
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

  // 달력 하나만 사용을 위한 인풋 커스텀
  function CustomInput({ value, onClick, id: inputId, disabled }, ref) {
    const handleClear = (e) => {
      e.stopPropagation(); // 달력 열림 방지
      onChange(null); // 날짜 초기화
    };

    return (
      <div
        className={`${styles.datepickerInput} ${disabled ? styles.disabled : ''}`}
        onClick={disabled ? undefined : onClick}
        ref={ref}
      >
        <input id={inputId} readOnly disabled={disabled} placeholder={placeholder} value={value || ''} />
        {value && !disabled && clearButton && (
          <span className={styles.clearBtn} onClick={handleClear}>
            {clearIcon}
          </span>
        )}
        <span className={styles.icon}>{calendarIcon}</span>
      </div>
    );
  }

  return (
    <div className={inputStyles.wrapper}>
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <div className={styles.datepickerWrap}>
        <DatePicker
          id={id}
          selected={selected}
          onChange={onChange} //날짜 선택 시 호출
          disabled={disabled} //비활성화 여부
          // 옵션
          locale={ko} //한국어 설정
          dateFormat="yyyy-MM-dd" //선택 날짜형식
          renderCustomHeader={renderHeader} //달력 헤드 커스텀
          customInput={<CustomInput />} //인풋 커스텀형식으로
          showPopperArrow={false} //달력 상단 디폴트 화살표 숨기기
          popperPlacement="bottom-start" //달력 하단 왼쪽 정렬
          {...props}
        />
      </div>
    </div>
  );
}
