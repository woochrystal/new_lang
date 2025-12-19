'use client';

import styles from './ApprovalLine.module.scss';
import Tag from '@/shared/ui/Tag/Tag';
import { formatApprovalDateTime } from '@/features/aprv/script/utils';

/**
 * 읽기 전용 결재자 표시 컴포넌트
 * 진행중 상태 등에서 수정 불가능할 때 사용
 * @param {Object} props
 * @param {Object} props.approver - 결재자 정보
 */
const ApprovalLineItemReadOnly = (props) => {
  const { approver } = props;

  // 결재 상태에 따른 Tag status 매핑
  const getTagStatus = (aprvSt) => {
    switch (aprvSt) {
      case 'CMPL':
        return 'approve';
      case 'RJCT':
        return 'reject';
      case 'REQ':
      default:
        return 'pending';
    }
  };

  const { date, time } = formatApprovalDateTime(approver.aprvDtm, true);
  const tagStatus = getTagStatus(approver.aprvSt);

  return (
    <div className={`${styles.uploadBox} ${styles.statusBox}`}>
      <div className={`${styles.plusWrap} ${styles.hasDate}`}>
        <Tag variant="text" status={tagStatus} />
        <div className={styles.upBoxDates}>
          <span>{date}</span>
          {time && <span>{time}</span>}
        </div>
      </div>
      <div className={styles.uploadBoxName}>
        <span className={styles.checkName}>{approver.usrNm || '결재자 없음'}</span>
      </div>
    </div>
  );
};

export default ApprovalLineItemReadOnly;
