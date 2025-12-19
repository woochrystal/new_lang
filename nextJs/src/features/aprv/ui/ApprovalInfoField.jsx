'use client';

import styles from './ApprovalInfoField.module.scss';

/**
 * 결재 정보 표시 필드 (읽기 전용)
 * 결재 작성/상세 화면에서 문서번호, 기안자, 기안부서, 기안일시 등의 정보를 표시
 *
 * @param {Object} props
 * @param {string} props.title - 필드 라벨
 * @param {string|number} props.value - 표시할 값
 * @param {boolean} [props.required=false] - 필수 표시 여부
 * @param {string} [props.placeholder='-'] - 값이 없을 때 표시할 텍스트
 */
const ApprovalInfoField = (props) => {
  const { title, value, required = false, placeholder = '-' } = props;

  const displayValue = value || placeholder;
  const isEmpty = !value;

  return (
    <div>
      <label className={styles.label}>
        <span className={required ? styles.required : ''}>{title}</span>
      </label>
      <div className={styles.valueWrap}>
        <p className={isEmpty ? styles.placeholder : ''}>{displayValue}</p>
      </div>
    </div>
  );
};

export default ApprovalInfoField;
