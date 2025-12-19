'use client';

import ApprovalLineItem from './ApprovalLineItem';
import ApprovalLineItemReadOnly from './ApprovalLineItemReadOnly';
import ApprovalLineEmptyBox from './ApprovalLineEmptyBox';
import styles from './ApprovalLine.module.scss';

/**
 * 결재선 설정 영역 컴포넌트
 * @param {Object} props
 * @param {Array} [props.approvalLine=[]] - 결재선 배열
 * @param {Function} props.onAdd - 결재자 추가 핸들러
 * @param {Function} props.onRemove - 결재자 삭제 핸들러
 * @param {number} [props.maxCount=3] - 최대 결재자 수
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 */
const ApprovalLineBox = (props) => {
  const { approvalLine = [], onAdd, onRemove, maxCount = 3, disabled = false } = props;
  const currentCount = approvalLine.length;
  const emptySlots = Math.max(0, maxCount - currentCount);

  return (
    <div className="hasItem03">
      {/* 기존 결재자 표시 */}
      {approvalLine.map((approver, index) => (
        <div key={`approver-${index}`} className="itemCol1">
          <label className={styles.inputTit}>
            <span>{approver.posNm}</span>
          </label>
          {disabled ? (
            <ApprovalLineItemReadOnly approver={approver} />
          ) : (
            <ApprovalLineItem approver={approver} onRemove={() => onRemove(index)} onAdd={onAdd} />
          )}
        </div>
      ))}

      {/* 빈 슬롯 표시 (수정 가능할 때만) */}
      {!disabled &&
        Array.from({ length: emptySlots }).map((_, index) => (
          <div key={`empty-${index}`} className="itemCol1">
            <label className={styles.inputTit}>
              <span></span>
            </label>
            <ApprovalLineEmptyBox onClick={onAdd} />
          </div>
        ))}
    </div>
  );
};

export default ApprovalLineBox;
