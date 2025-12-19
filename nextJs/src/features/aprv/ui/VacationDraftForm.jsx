'use client';

import { memo, useCallback, useEffect } from 'react';
import { Datepicker, Input, Select, Textarea, Label } from '@/shared/component';
import ConTit from '@/shared/ui/Title/ConTit';
import InnerWrap from '@/shared/ui/Wrapper/InnerWrap';
import { APRV_CONSTANTS } from '@/features/aprv';
import { formatPhoneNumber, formatApprovalDateTime } from '@/features/aprv/script/utils';
import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 휴가 결재 정보 입력 컴포넌트
 * @param {Object} props
 * @param {Object} props.data - 휴가 상신 정보 (vctDraftInfo)
 * @param {number} props.data.subId - 대무자 ID
 * @param {Date} props.data.vacStaDt - 휴가 시작일
 * @param {Date} props.data.vacEndDt - 휴가 종료일
 * @param {Function} props.onChange - 데이터 변경 핸들러
 * @param {Object} props.user - 로그인 사용자 정보
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 * @param {Array} [props.empList=[]] - 대무자 선택 목록
 */
const VacationDraftForm = memo((props) => {
  const { data, onChange, user, disabled = false, empList = [] } = props;

  const handleChange = useCallback(
    (field, value) => {
      onChange((prev) => ({
        ...prev,
        [field]: value
      }));
    },
    [onChange]
  );

  // 휴가종류 변경 시 사용휴가일수 자동 설정
  useEffect(() => {
    if (data.vacTy === 'HALF' && data.vacDays !== 0.5) {
      // 반차: 0.5일로 고정
      onChange((prev) => ({
        ...prev,
        vacDays: 0.5
      }));
    } else if ((data.vacTy === 'EVT' || data.vacTy === 'OTHER') && data.vacDays !== 0) {
      // 경조사, 기타: 0일로 고정
      onChange((prev) => ({
        ...prev,
        vacDays: 0
      }));
    }
  }, [data.vacTy, data.vacDays, onChange]);

  return (
    <>
      <InnerWrap className={'conTitWrap'}>
        <div className={styles.sectionTitle}>
          <h3>휴가 품의서 작성</h3>
        </div>
        <Label required>필수 입력 정보입니다.</Label>
      </InnerWrap>

      {/* depthSection에 배경색만 없을 때 ${styles.noBg}, 선만 없을 때 ${styles.noBd}, 둘 다 ${styles.noBgBd} 추가*/}
      <div className={`${styles.depthSection} ${styles.noBgBd} hasItem03`}>
        {/* 좌측영역에 기안자,기안부서,기안일시가 존재하기에 불필요한듯하여 주석처리 */}
        {/*<Input label={'기안자'} disabled={true} value={user?.usrNm || data.createdBy || '-'} />*/}
        {/*<Datepicker label={'상신일'} disabled={true} selected={data.draftDt || new Date()} />*/}

        {/* 결재 최종 완료시 승인자 정보 보여주기 */}
        {data.status === 'CMPL' && (
          <>
            <Input label={'승인자'} className={'itemCol1'} disabled={true} value={data.approverNm || '-'} />
            <Input
              label={'승인일'}
              className={'itemCol1'}
              disabled={true}
              value={formatApprovalDateTime(data.approverDt)}
            />
          </>
        )}

        <Select
          label="휴가종류"
          required={true}
          options={APRV_CONSTANTS.VACATION_TYPE_OPTIONS}
          value={data.vacTy || '-'}
          onChange={(value) => handleChange('vacTy', value)}
          placeholder="선택"
          disabled={disabled}
        />

        <Datepicker
          label={'휴가시작일'}
          required={true}
          selected={data.vacStaDt || new Date()}
          onChange={(date) => {
            handleChange('vacStaDt', date);
          }}
          disabled={disabled}
        />
        <Datepicker
          label={'휴가종료일'}
          required={true}
          selected={data.vacEndDt || new Date()}
          onChange={(date) => {
            handleChange('vacEndDt', date);
          }}
          disabled={disabled}
        />
        <Input
          label={'사용휴가일수'}
          required={true}
          type={'number'}
          min={0}
          step={1}
          value={data.vacDays || 0}
          onChange={(e) => handleChange('vacDays', Number(e.target.value))}
          disabled={disabled || data.vacTy === 'HALF' || data.vacTy === 'EVT' || data.vacTy === 'OTHER'}
        />

        <Select
          className={'itemCol1'}
          label="대무자"
          required={true}
          options={empList}
          value={data.subId === null ? '-' : data.subId}
          onChange={(value) => handleChange('subId', value === '-' ? null : Number(value))}
          placeholder="선택"
          disabled={disabled}
        />

        <Input
          label={'비상연락처'}
          // className={`${styles.gridFull}`}
          className={'itemCol1'} /* 20251128 기안자 정보 보이지않도록 처리하면서 className 변경 */
          variant={'TEL'}
          required={true}
          value={data.emgTel || ''}
          onChange={(e) => handleChange('emgTel', formatPhoneNumber(e.target.value))}
          disabled={disabled}
          placeholder={'비상연락처를 입력해주세요.'}
          maxLength={13}
        />

        <Textarea
          label={'휴가사유'}
          className={`${styles.gridFull}`}
          required={true}
          value={data.vacRsn || ''}
          onChange={(e) => handleChange('vacRsn', e.target.value)}
          disabled={disabled}
        />
        <Textarea
          label={'업무 인계사항'}
          className={`${styles.gridFull}`}
          required={true}
          value={data.trfNote || ''}
          onChange={(e) => handleChange('trfNote', e.target.value)}
          disabled={disabled}
        />
      </div>
    </>
  );
});

VacationDraftForm.displayName = 'VacationDraftForm';

export default VacationDraftForm;
