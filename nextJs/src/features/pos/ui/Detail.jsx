import React from 'react';
import { Button, Label, RadioGroup, Input } from '@/shared/component';
import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 직급 상세 정보 컴포넌트
 * @param {Object} props
 * @param {Object|null} props.position - 선택된 직급 정보
 * @param {Function} props.onUpdate - 수정 버튼 클릭 핸들러
 * @param {Function} props.onDelete - 삭제 버튼 클릭 핸들러
 * @param {Function} props.onChange - 필드 변경 핸들러
 */
const PositionDetail = function ({ position, onUpdate, onDelete, onChange }) {
  return (
    <>
      <div className={`${styles.titleSection} ${styles.titleWithButtonSection}`}>
        <div className={styles.sectionTitle}>
          <h3>직급 상세 정보</h3>
          <div className={styles.actionButtonContainer}>
            <Button variant="secondary" disabled={!position} onClick={onUpdate}>
              수정
            </Button>
            <Button variant="danger" disabled={!position} onClick={onDelete}>
              삭제
            </Button>
          </div>
        </div>
        <Label required disabled>
          필수 입력 정보입니다.
        </Label>
      </div>

      <div className={`hasItem02 ${styles.depthSection}`}>
        <div>
          <Input
            label="직급명"
            value={position?.posNm || ''}
            onChange={(e) => onChange && onChange('posNm', e.target.value)}
            required
            disabled={!position}
          />
        </div>
        <div>
          <Input
            label="정렬 순서"
            type="number"
            value={position?.posOrd !== undefined ? String(position.posOrd) : ''}
            onChange={(e) => onChange && onChange('posOrd', e.target.value)}
            required
            disabled={!position}
          />
        </div>
        <div>
          <Input label="생성일시" value={position?.createdAt || ''} onChange={() => {}} disabled={true} />
        </div>
        <div>
          <Input label="수정일시" value={position?.updatedAt || ''} onChange={() => {}} disabled={true} />
        </div>
      </div>
    </>
  );
};

export default PositionDetail;
