'use client';

import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { equipApi } from '@/features/equip';
import { Loading, DataTable, Button, Tag } from '@/shared/component';
import { useAlertStore } from '@/shared/store/alertStore';
import { EQUIP_STATUS_OPTIONS } from '@/features/equip/script/constants';

import styles from '@/shared/component/popup/popup.module.scss';
import scrollbarStyles from './hide-scrollbar.module.scss';

const codeToLabel = (options) => {
  return options.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});
};

const STATUS_LABELS = codeToLabel(EQUIP_STATUS_OPTIONS);

const InfoItem = ({ label, value }) => (
  <li>
    <p className={styles.infoTitBasic}>{label}</p>
    <p className={styles.modalInfoLi}>{value || '-'}</p>
  </li>
);

const EquipDetailModal = ({
  equipId,
  onClose,
  onEdit,
  onDelete,
  api = equipApi.getDetail,
  editButtonText = '자산 이관'
}) => {
  const { showError } = useAlertStore();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const result = await api(equipId);
      if (result && result.data) {
        setDetail(result.data);
      } else {
        showError('자산 상세 정보를 불러오는데 실패했습니다.');
        onClose();
      }
      setLoading(false);
    };

    if (equipId) {
      fetchDetail();
    }
  }, [equipId, onClose, showError, api]);

  const ownershipText = useMemo(() => {
    if (!detail?.owner) return '-';
    if (detail.owner === '1') return '회사';
    if (detail.owner === '2') return '기타';
    return detail.owner;
  }, [detail?.owner]);

  const statusText = useMemo(() => {
    if (!detail?.eqpSt) {
      return (
        <Tag variant="danger" size="txtOnly">
          이관(확인필요)
        </Tag>
      );
    }
    return STATUS_LABELS[detail.eqpSt] || detail.eqpSt;
  }, [detail?.eqpSt]);

  const historyColumns = [
    { key: 'chgDtm', label: '변경일' },
    { key: 'recNm', label: '인수자' },
    { key: 'trfNm', label: '인계자' },
    { key: 'equipSt', label: '상태' }
  ];

  const historyRenderers = {
    chgDtm: (value) => (value ? format(new Date(value), 'yy-MM-dd') : '-'),
    recNm: (value) => value || '-',
    trfNm: (value, row) => {
      if (!row.trfId && row.recId) return '최초 지급';
      return value || '-';
    },
    equipSt: (value, row) => {
      if (!row.trfId && !row.recId)
        return (
          <Tag variant="info" size="txtOnly">
            신규 등록
          </Tag>
        );
      if (!row.trfId && row.recId)
        return (
          <Tag variant="success" size="txtOnly">
            지급
          </Tag>
        );
      if (row.trfId && row.recId)
        return (
          <Tag variant="primary" size="txtOnly">
            이관
          </Tag>
        );
      if (row.trfId && !row.recId)
        return (
          <Tag variant="danger" size="txtOnly">
            반납
          </Tag>
        );
      return STATUS_LABELS[value] || '알수없음';
    }
  };

  if (loading) {
    return <Loading message="상세 정보를 불러오는 중..." />;
  }

  if (!detail) {
    return <div className={styles.modalData}>상세 정보가 없습니다.</div>;
  }

  return (
    <>
      {(onEdit || onDelete) && (
        <div className={styles.modalTopBtnArea}>
          {onEdit && (
            <Button variant="secondary" onClick={onEdit}>
              {editButtonText}
            </Button>
          )}
          {onDelete && (
            <Button variant="negative" onClick={onDelete}>
              삭제
            </Button>
          )}
        </div>
      )}

      <div className={`${styles.modalContent} ${scrollbarStyles.noScrollbar}`}>
        <ul className={`${styles.modalInfoBlock} ${styles.modalInfoUl} hasItem02`}>
          <InfoItem label="자산번호" value={detail.assetNo} />
          <InfoItem label="자산명" value={detail.eqpNm} />
          <InfoItem label="종류" value={detail.eqpTy} />
          <InfoItem label="구매일" value={detail.buyDtm ? format(new Date(detail.buyDtm), 'yyyy-MM-dd') : '-'} />
          <InfoItem label="일련번호" value={detail.serialNo} />
          <InfoItem label="현재상태" value={statusText} />
          <InfoItem label="소유구분" value={ownershipText} />
          <InfoItem label="사용자" value={detail.usrNm} />
        </ul>

        <div className={styles.modalInfoBlock}>
          <h4>비고</h4>
          <div className={styles.modalData}>{detail.note || '작성된 비고가 없습니다.'}</div>
        </div>

        <div className={styles.modalInfoBlock}>
          <h4>사용 이력</h4>
          <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
            <DataTable
              columns={historyColumns}
              data={detail.history || []}
              renderers={historyRenderers}
              keyField="histId"
              emptyMessage="사용 이력이 없습니다."
            />
          </div>
        </div>
      </div>
    </>
  );
};

EquipDetailModal.propTypes = {
  equipId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  api: PropTypes.func,
  editButtonText: PropTypes.string
};

export default EquipDetailModal;
