'use client';

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { equipApi } from '@/features/equip';
import { Loading, DataTable, Tag } from '@/shared/component';
import { useAlertStore } from '@/shared/store/alertStore';
import { EQUIP_STATUS_OPTIONS } from '@/features/equip/script/constants';

import styles from '@/shared/component/popup/popup.module.scss';

const codeToLabel = (options) => {
  return options.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});
};

const STATUS_LABELS = {
  ...codeToLabel(EQUIP_STATUS_OPTIONS),
  NEWLY_ACQUIRED: '이관받음',
  TRANSFERRED_IN: '이관받음',
  TRANSFERRED_OUT: '반납(이관)',
  NEWLY_REGISTERED: '신규등록'
};

const InfoItem = ({ label, value }) => (
  <li>
    <p className={styles.infoTitBasic}>{label}</p>
    <p className={styles.modalInfoLi}>{value || '-'}</p>
  </li>
);

const SurveyDetailModal = ({ survChkId, onClose }) => {
  const { showError } = useAlertStore();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const result = await equipApi.getSurveyCheckDetail(survChkId);
      if (result && result.data) {
        setDetail(result.data);
      } else {
        showError('실사 상세 정보를 불러오는데 실패했습니다.');
        onClose();
      }
      setLoading(false);
    };

    if (survChkId) {
      fetchDetail();
    }
  }, [survChkId, onClose, showError]);

  const columns = [
    { key: 'assetNo', label: '자산번호' },
    { key: 'eqpNm', label: '장비명' },
    { key: 'status', label: '제출 상태' },
    { key: 'note', label: '특이사항' },
    { key: 'transferred', label: '이관 여부' }
  ];

  const renderers = {
    status: (value) => STATUS_LABELS[value] || '알수없음',
    note: (value) => value || '-',
    transferred: (value) =>
      value ? (
        <Tag variant="primary" size="txtOnly">
          이관됨
        </Tag>
      ) : (
        ''
      )
  };

  if (loading) {
    return <Loading message="상세 정보를 불러오는 중..." />;
  }

  if (!detail) {
    return <div className="p-4">상세 정보가 없습니다.</div>;
  }

  return (
    <div className={styles.modalContent}>
      <ul className={`${styles.modalInfoBlock} ${styles.modalInfoUl} hasItem02`}>
        <InfoItem label="직원명" value={detail.usrNm} />
        <InfoItem label="부서명" value={detail.deptNm} />
        <InfoItem label="실사 상태" value={detail.survChkYn === 'Y' ? '완료' : '미완료'} />
        <InfoItem label="확인일" value={detail.survChkDtm ? format(new Date(detail.survChkDtm), 'yyyy-MM-dd') : '-'} />
      </ul>

      <div className={styles.modalInfoBlock}>
        <h4>비고</h4>
        <div className={styles.modalData}>{detail.note || '작성된 비고가 없습니다.'}</div>
      </div>

      <div className={styles.modalInfoBlock}>
        <h4>제출된 장비 목록</h4>
        <DataTable
          columns={columns}
          data={detail.parsedEquipmentDetails || []}
          renderers={renderers}
          keyField="eqpId"
          emptyMessage="제출된 장비가 없습니다."
        />
      </div>
    </div>
  );
};

SurveyDetailModal.propTypes = {
  survChkId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired
};

export default SurveyDetailModal;
