'use client';

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { equipApi, DetailModal, EquipSearch, EquipForm, ClaimForm } from '@/features/equip';
import { EQUIP_STATUS_OPTIONS, EQUIP_CATEGORY_OPTIONS } from '@/features/equip/script/constants';
import { DataTable, Content, ContentLayout, Loading, Button, Modal, Tag } from '@/shared/component';
import { useAlertStore } from '@/shared/store/alertStore';
import layoutStyles from '@/shared/component/layout/layout.module.scss';

const codeToLabel = (options) => {
  return options.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});
};

const STATUS_LABELS = codeToLabel(EQUIP_STATUS_OPTIONS);
const CATEGORY_LABELS = codeToLabel(EQUIP_CATEGORY_OPTIONS);

export default function MyEquipListPage() {
  const { showSuccess, showError } = useAlertStore();
  const [loading, setLoading] = useState(true);
  const [myEquips, setMyEquips] = useState([]);
  const [selectedEquip, setSelectedEquip] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const claimFormRef = useRef(null);
  const editFormRef = useRef(null);

  const initialFilters = { eqpTy: 'all', eqpSt: 'all', eqpNm: '' };
  const [searchFilters, setSearchFilters] = useState(initialFilters);
  const [searchParams, setSearchParams] = useState(initialFilters);

  const fetchMyEquips = async () => {
    setLoading(true);
    const paramsForApi = { ...searchParams };
    Object.keys(paramsForApi).forEach((key) => {
      if (paramsForApi[key] === 'all' || paramsForApi[key] === '') {
        delete paramsForApi[key];
      }
    });

    const result = await equipApi.getMyList({ params: paramsForApi });
    if (result && result.data) {
      setMyEquips(result.data);
    } else {
      showError('내 자산 목록을 불러오는데 실패했습니다.');
      setMyEquips([]);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    const result = await equipApi.getTenantUsers();
    if (result && result.data) {
      setUserOptions(
        result.data.map((u) => ({
          value: u.usrId,
          label: `${u.usrNm} ${u.posNm || ''} (${u.deptNm || '부서없음'})`
        }))
      );
    }
  };

  useEffect(() => {
    fetchMyEquips();
    fetchUsers();
  }, [searchParams]);

  const handleFilterChange = (field, value) => {
    setSearchFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setSearchParams(searchFilters);
  };

  const handleClear = () => {
    setSearchFilters(initialFilters);
  };

  const openDetailModal = (equip) => {
    setSelectedEquip(equip);
    setIsDetailModalOpen(true);
  };

  const openClaimModal = () => {
    setIsClaimModalOpen(true);
  };

  const openEditModal = (equip) => {
    setSelectedEquip(equip);
    setIsEditModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const closeModals = () => {
    setIsDetailModalOpen(false);
    setIsClaimModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedEquip(null);
  };

  const triggerClaimSubmit = () => claimFormRef.current?.submit();
  const triggerEditSubmit = () => editFormRef.current?.submit();

  const handleClaimSubmit = async (formData) => {
    const result = await equipApi.claimEquip(formData);
    if (result) {
      showSuccess('자산을 성공적으로 추가했습니다.');
      closeModals();
      fetchMyEquips();
    } else {
      showError('자산 추가에 실패했습니다. 자산 번호를 확인해주세요.');
    }
  };

  const handleEditSubmit = async (formData) => {
    const result = await equipApi.update(selectedEquip.id, formData);
    if (result && !result.error) {
      showSuccess('자산이 이관되었습니다.');
      closeModals();
      fetchMyEquips();
    } else {
      showError(result.error?.message || '자산 이관에 실패했습니다.');
    }
  };

  const columns = [
    { key: 'assetNo', label: '자산번호' },
    { key: 'eqpTy', label: '종류' },
    { key: 'eqpNm', label: '자산명' },
    { key: 'eqpSt', label: '상태' },
    { key: 'buyDtm', label: '구매일' }
  ];

  const renderers = {
    buyDtm: (value) => (value ? format(new Date(value), 'yyyy-MM-dd') : '-'),
    eqpSt: (value) => {
      if (!value) {
        return (
          <Tag variant="danger" size="txtOnly">
            이관(확인필요)
          </Tag>
        );
      }
      return value === 'PENDING_ACCEPTANCE' ? (
        <Tag variant="warning">{STATUS_LABELS[value]}</Tag>
      ) : (
        STATUS_LABELS[value] || value
      );
    },
    eqpTy: (value) => CATEGORY_LABELS[value] || '기타'
  };

  return (
    <>
      <ContentLayout>
        <ContentLayout.Header title="보유 자산 현황" subtitle="현재 나에게 할당된 자산 목록을 확인합니다.">
          <Button variant="primary" onClick={handleSearch} disabled={loading}>
            조회
          </Button>
          <Button variant="secondary" onClick={handleClear} disabled={loading}>
            초기화
          </Button>
        </ContentLayout.Header>
        <Content.Full>
          <div className={layoutStyles.boardWrap}>
            <div className={layoutStyles.hasItem03}>
              <EquipSearch
                searchFilters={searchFilters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                disabled={loading}
                hideFields={['usrNm']}
              />
            </div>
            <div className={layoutStyles.hasTbBtn}>
              <div className={`${layoutStyles.tbBtnArea} ${layoutStyles.tbBtnAreaFull}`}>
                <Button variant="primary" onClick={openClaimModal}>
                  + 자산 추가
                </Button>
              </div>
              {loading ? (
                <Loading message="자산 목록을 불러오는 중..." />
              ) : (
                <DataTable
                  columns={columns}
                  data={myEquips}
                  keyField="id"
                  onRowClick={openDetailModal}
                  renderers={renderers}
                  emptyMessage="보유한 자산이 없습니다."
                />
              )}
            </div>
          </div>
        </Content.Full>
      </ContentLayout>

      <Modal isOpen={isDetailModalOpen} onClose={closeModals} title="자산 상세 정보" variant="large">
        {selectedEquip && (
          <DetailModal
            equipId={selectedEquip.id}
            onClose={closeModals}
            onEdit={() => openEditModal(selectedEquip)}
            api={equipApi.getDetail}
          />
        )}
      </Modal>

      <Modal
        isOpen={isClaimModalOpen}
        onClose={closeModals}
        title="자산 추가"
        variant="large"
        confirmText="추가"
        cancelText="취소"
        onConfirm={triggerClaimSubmit}
        onCancel={closeModals}
      >
        <ClaimForm ref={claimFormRef} onSubmit={handleClaimSubmit} />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        title="자산 이관"
        variant="large"
        confirmText="이관"
        cancelText="취소"
        onConfirm={triggerEditSubmit}
        onCancel={closeModals}
      >
        <EquipForm
          ref={editFormRef}
          initialData={selectedEquip}
          onSubmit={handleEditSubmit}
          userOptions={userOptions}
          isEditMode={true}
          disabledFields={['assetNo', 'eqpNm', 'serialNo', 'buyDtm', 'owner', 'eqpTy']}
        />
      </Modal>
    </>
  );
}
