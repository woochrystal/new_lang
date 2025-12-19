'use client';

import { memo, useCallback } from 'react';
import ConTit from '@/shared/ui/Title/ConTit';
import InnerWrap from '@/shared/ui/Wrapper/InnerWrap';
import { Datepicker, Input, Label, Select, Textarea } from '@/shared/component';
import { APRV_CONSTANTS, FileInput } from '@/features/aprv';
import { formatCardNumber, formatCurrency } from '@/features/aprv/script/utils';
import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 비용 결재 정보 입력 컴포넌트
 * @param {Object} props
 * @param {Object} props.data - 비용결재 상신 정보 (expnDraftInfo)
 * @param {Object} props.data.fileState - 파일 상태
 * @param {number|null} props.data.fileState.fileId - FILE_ID
 * @param {Array} props.data.fileState.existing - 기존 파일 목록
 * @param {Array} props.data.fileState.new - 신규 파일 목록
 * @param {Array} props.data.fileState.deletedIds - 삭제된 파일 ID
 * @param {Function} props.onChange - 데이터 변경 핸들러
 * @param {Object} props.user - 로그인 사용자 정보
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 */
const ExpenseDraftForm = memo((props) => {
  const { data, disabled, onChange } = props;

  const handleChange = useCallback(
    (field, value) => {
      onChange((prev) => ({
        ...prev,
        [field]: value
      }));
    },
    [onChange]
  );

  const handleFilesChange = useCallback(
    (newFileState) => {
      onChange((prev) => ({
        ...prev,
        fileState: newFileState
      }));
    },
    [onChange]
  );

  return (
    <>
      <InnerWrap className={'conTitWrap'}>
        <ConTit>
          <h3>지출 결의서 작성</h3>
        </ConTit>
        <Label required>필수 입력 정보입니다.</Label>
      </InnerWrap>

      <div className={`${styles.depthSection} ${styles.noBgBd} hasItem03`}>
        <Select
          label={'결제수단'}
          required={true}
          options={APRV_CONSTANTS.EXPENSE_TYPE_OPTIONS}
          value={data.expnTy || '-'}
          onChange={(value) => handleChange('expnTy', value)}
          disabled={disabled}
        />
        <Input
          label={'카드번호'}
          required={true}
          value={data.cardNo || ''}
          onChange={(e) => handleChange('cardNo', formatCardNumber(e.target.value))}
          disabled={disabled || data.expnTy === 'CASH'}
          placeholder={'카드번호를 입력해주세요.'}
          maxLength={19}
        />
        <div className={'itemCol1'}>
          <Datepicker
            label={'사용일자'}
            required={true}
            disabled={disabled}
            id="expnDt"
            selected={data.expnDt || new Date()}
            onChange={(date) => {
              handleChange('expnDt', date);
            }}
          />
        </div>
        <Input
          className={'itemCol1'}
          label={'사용금액'}
          required={true}
          value={formatCurrency(data.payAmt)}
          onChange={(e) => handleChange('payAmt', formatCurrency(e.target.value))}
          placeholder={'10,000'}
          disabled={disabled}
        />
        <div className={'itemCol1'}>
          <FileInput
            label={'영수증 첨부'}
            required={true}
            fileState={data.fileState}
            onChange={handleFilesChange}
            multiple={true}
            disabled={disabled}
            accept="image/*,.pdf"
            placeholder="영수증을 첨부해주세요."
          />
        </div>
        <Textarea
          label={'지출사유'}
          className={`${styles.gridFull}`}
          required={true}
          value={data.expnRsn || ''}
          onChange={(e) => handleChange('expnRsn', e.target.value)}
          maxLength={300}
          disabled={disabled}
        />
      </div>
    </>
  );
});

ExpenseDraftForm.displayName = 'ExpenseDraftForm';

export default ExpenseDraftForm;
