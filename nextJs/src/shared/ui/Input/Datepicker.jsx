// 기간 설정 datepicker
import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale'; //한국어
import 'react-datepicker/dist/react-datepicker.css'; //기본스타일
import styles from './datepicker.module.scss';

export default function Datepicker({ selectedDate, onChange, disabled, placeholder = '날짜 선택' }) {
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
        <button onClick={decreaseYear}>
          <img src="/datepickerYear.png" alt="전년도 이동 버튼" />
        </button>
        <button onClick={decreaseMonth}>
          <img src="/datepickerMonth.png" alt="전월 이동 버튼" />
        </button>
      </div>

      <span className={styles.dateHeadTxt}>
        {date.getFullYear()}-{String(date.getMonth() + 1).padStart(2, '0')}
      </span>

      <div className={`${styles.dateHeadBtn} ${styles.increaseBtn}`}>
        <button onClick={increaseMonth}>
          <img src="/datepickerMonth.png" alt="다음월 이동 버튼" />
        </button>
        <button onClick={increaseYear}>
          <img src="/datepickerYear.png" alt="다음년도 이동 버튼" />
        </button>
      </div>
    </div>
  );

  // 달력 하나만 사용을 위한 인풋 커스텀
  const CustomInput = forwardRef(({ value, onClick }, ref) => {
    return (
      <div className={styles.datepickerInput} onClick={onClick} ref={ref}>
        <input readOnly placeholder={placeholder} value={value || ''} />
        <span className={styles.icon}>{calendarIcon}</span>
      </div>
    );
  });

  const handleChange = (date) => {
    if (onChange) {
      // Date 객체를 YYYY-MM-DD 형식으로 변환
      const formatDate = (d) => {
        if (!d) return '';
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      onChange(formatDate(date));
    }
  };

  return (
    <div className={`${styles.datepickerWrap}`}>
      {/* 종료일 */}
      <DatePicker
        selected={selectedDate ? new Date(selectedDate) : null}
        onChange={handleChange} //날짜 선택 시 호출
        // 옵션
        locale={ko} //한국어 설정
        dateFormat="yyyy-MM-dd" //선택 날짜형식
        renderCustomHeader={renderHeader} //달력 헤드 커스텀
        customInput={<CustomInput />} //인풋 커스텀형식으로
        showPopperArrow={false} //달력 상단 디폴트 화살표 숨기기
        popperPlacement="bottom-start" //달력 하단 왼쪽 정렬
        disabled={disabled}
      />
    </div>
  );
}
