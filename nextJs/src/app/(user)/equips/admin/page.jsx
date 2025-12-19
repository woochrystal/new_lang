'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { equipApi, EquipSearch, EquipForm, DetailModal } from '@/features/equip';
import { DataTable, Pagination, Content, ContentLayout, Loading, Button, Modal, Tag, Input } from '@/shared/component';
import { useAlertStore, useAuthStore } from '@/shared/store';
import { EQUIP_STATUS_OPTIONS, EQUIP_CATEGORY_OPTIONS } from '@/features/equip/script/constants';
import layoutStyles from '@/shared/component/layout/layout.module.scss';
import modalStyles from '@/features/equip/ui/equip-modal.module.scss';

const codeToLabel = (options) => {
  return options.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});
};

const STATUS_LABELS = codeToLabel(EQUIP_STATUS_OPTIONS);
const CATEGORY_LABELS = codeToLabel(EQUIP_CATEGORY_OPTIONS);

// 자산 유형 관리 폼 컴포넌트
const TypeForm = React.forwardRef(({ initialData, onSubmit, onDelete }, ref) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      eqpTy: '',
      eqpTyNm: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ eqpTy: '', eqpTyNm: '' });
    }
  }, [initialData, reset]);

  React.useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit)
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {onDelete && (
        <div className={layoutStyles.tbBtnArea}>
          <Button type="button" variant="negative" size="sm" onClick={onDelete}>
            삭제
          </Button>
        </div>
      )}
      <Controller
        name="eqpTy"
        control={control}
        rules={{ required: '유형 코드는 필수입니다.' }}
        render={({ field }) => (
          <Input
            {...field}
            label="유형 코드"
            error={errors.eqpTy?.message}
            placeholder="예: NB, MON"
            disabled={!!initialData}
          />
        )}
      />
      <Controller
        name="eqpTyNm"
        control={control}
        rules={{ required: '유형 이름은 필수입니다.' }}
        render={({ field }) => (
          <Input {...field} label="유형 이름" error={errors.eqpTyNm?.message} placeholder="예: 노트북, 모니터" />
        )}
      />
    </form>
  );
});
TypeForm.displayName = 'TypeForm';

export default function EquipAdminPage() {
  const router = useRouter();
  const { showSuccess, showError, showConfirm } = useAlertStore();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [equips, setEquips] = useState({ list: [], pagination: {} });
  const [searchFilters, setSearchFilters] = useState({ eqpTy: 'all', eqpSt: 'all', usrNm: '', eqpNm: '' });
  const [searchParams, setSearchParams] = useState({ page: 1, size: 10, ...searchFilters });

  // 모달 상태 관리
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isTypeManageModalOpen, setIsTypeManageModalOpen] = useState(false);
  const [isTypeFormModalOpen, setIsTypeFormModalOpen] = useState(false);

  const [selectedEquip, setSelectedEquip] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userOptions, setUserOptions] = useState([]);

  const [equipTypes, setEquipTypes] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const formRef = useRef(null);
  const typeFormRef = useRef(null);

  useEffect(() => {
    if (!isAuthLoading && user && !['ADM', 'SYSADM'].includes(user.usrRole)) {
      showError('이 페이지에 접근할 권한이 없습니다.');
      router.replace('/');
    }
  }, [user, isAuthLoading, router, showError]);

  const hasPermission = user && ['ADM', 'SYSADM'].includes(user.usrRole);

  const fetchEquips = async () => {
    if (!hasPermission) return;
    setLoading(true);
    const paramsForApi = { ...searchParams };
    Object.keys(paramsForApi).forEach((key) => {
      if (paramsForApi[key] === 'all' || paramsForApi[key] === '') {
        delete paramsForApi[key];
      }
    });

    const result = await equipApi.getAdminList({ params: paramsForApi });
    if (result && result.data) {
      setEquips({ list: result.data.content, pagination: { ...result.data, content: null } });
    } else {
      showError('자산 목록을 불러오는데 실패했습니다.');
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    if (!hasPermission) return;
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

  const fetchEquipTypes = async () => {
    const result = await equipApi.getEquipTypes();
    if (result && result.data) {
      setEquipTypes(result.data);
    }
  };

  useEffect(() => {
    if (hasPermission) {
      fetchEquips();
      fetchUsers();
    }
  }, [searchParams, hasPermission]);

  const handleFilterChange = (field, value) => setSearchFilters((prev) => ({ ...prev, [field]: value }));
  const handleSearch = () => {
    setSearchParams((prev) => ({ ...prev, page: 1, ...searchFilters }));
  };
  const handleClear = () => {
    const initialFilters = { eqpTy: 'all', eqpSt: 'all', usrNm: '', eqpNm: '' };
    setSearchFilters(initialFilters);
  };
  const handlePageChange = (page) => setSearchParams((prev) => ({ ...prev, page }));

  const openDetailModal = (equip) => {
    setSelectedEquip(equip);
    setIsDetailModalOpen(true);
  };

  const openFormModal = (equip = null) => {
    setSelectedEquip(equip);
    setIsEditMode(!!equip);
    setIsFormModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const openTypeManageModal = () => {
    fetchEquipTypes();
    setIsTypeManageModalOpen(true);
  };

  const openTypeFormModal = (type = null) => {
    setSelectedType(type);
    setIsTypeFormModalOpen(true);
  };

  const closeModals = () => {
    setIsFormModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedEquip(null);
  };

  const handleFormSubmit = async (formData) => {
    const apiCall = selectedEquip ? equipApi.update(selectedEquip.id, formData) : equipApi.createByAdmin(formData);

    const result = await apiCall;
    if (result && !result.error) {
      showSuccess(selectedEquip ? '자산 정보가 수정되었습니다.' : '새 자산이 등록되었습니다.');
      closeModals();
      fetchEquips();
    } else {
      showError(result.error?.message || '작업에 실패했습니다.');
    }
  };

  const handleDelete = () => {
    if (!selectedEquip) return;
    showConfirm({
      title: '자산 삭제 확인',
      message: '정말로 이 자산을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      variant: 'warning',
      onConfirm: async () => {
        const result = await equipApi.delete(selectedEquip.id);
        if (result && !result.error) {
          showSuccess('자산이 삭제되었습니다.');
          closeModals();
          fetchEquips();
        } else {
          showError('자산 삭제에 실패했습니다.');
        }
      }
    });
  };

  const handleTypeFormSubmit = async (formData) => {
    const apiCall = selectedType
      ? equipApi.updateEquipType(selectedType.eqpTyId, formData)
      : equipApi.createEquipType(formData);

    const result = await apiCall;
    if (result) {
      showSuccess(selectedType ? '유형이 수정되었습니다.' : '유형이 생성되었습니다.');
      setIsTypeFormModalOpen(false);
      fetchEquipTypes();
    } else {
      showError(selectedType ? '수정에 실패했습니다.' : '생성에 실패했습니다.');
    }
  };

  const handleDeleteType = () => {
    if (!selectedType) return;
    showConfirm({
      title: '유형 삭제 확인',
      message: `'${selectedType.eqpTyNm}' 유형을 삭제하시겠습니까?`,
      variant: 'warning',
      onConfirm: async () => {
        const result = await equipApi.deleteEquipType(selectedType.eqpTyId);
        if (result) {
          showSuccess('유형이 삭제되었습니다.');
          setIsTypeFormModalOpen(false);
          fetchEquipTypes();
        } else {
          showError('삭제에 실패했습니다.');
        }
      }
    });
  };

  const triggerFormSubmit = () => formRef.current?.submit();
  const triggerTypeFormSubmit = () => typeFormRef.current?.submit();

  const columns = [
    { key: 'assetNo', label: '자산번호' },
    { key: 'eqpTy', label: '종류' },
    { key: 'eqpNm', label: '자산명' },
    { key: 'usrNm', label: '사용자' },
    { key: 'eqpSt', label: '상태' },
    { key: 'buyDtm', label: '구매일' }
  ];

  const renderers = {
    eqpTy: (value) => CATEGORY_LABELS[value] || value,
    eqpSt: (value) => {
      if (!value) {
        return (
          <Tag variant="danger" size="txtOnly">
            이관(확인필요)
          </Tag>
        );
      }
      return STATUS_LABELS[value] || value;
    },

    buyDtm: (value) => (value ? format(new Date(value), 'yyyy-MM-dd') : '-')
  };

  const typeColumns = [
    { key: 'eqpTy', label: '유형 코드' },
    { key: 'eqpTyNm', label: '유형 이름' }
  ];

  if (!hasPermission) {
    return <Loading message="권한을 확인 중입니다..." />;
  }

  return (
    <>
      <ContentLayout>
        <ContentLayout.Header title="자산 관리" subtitle="전체 자산을 검색하고 관리합니다.">
          <Button variant="primary" onClick={handleSearch} disabled={loading}>
            조회
          </Button>
          <Button variant="secondary" onClick={handleClear} disabled={loading}>
            초기화
          </Button>
        </ContentLayout.Header>
        <Content.Full>
          <div className={layoutStyles.boardWrap}>
            <div className={layoutStyles.hasItem04}>
              <EquipSearch
                searchFilters={searchFilters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                disabled={loading}
              />
            </div>
            <div className={layoutStyles.hasTbBtn}>
              <div className={`${layoutStyles.tbBtnArea} ${layoutStyles.tbBtnAreaFull}`}>
                <Button variant="secondary" onClick={openTypeManageModal}>
                  자산 유형 관리
                </Button>
                <Button variant="primary" onClick={() => openFormModal()}>
                  + 신규 자산 등록
                </Button>
              </div>
              {loading ? (
                <Loading message="자산 목록을 불러오는 중..." />
              ) : (
                <DataTable
                  columns={columns}
                  data={equips.list}
                  keyField="id"
                  onRowClick={openDetailModal}
                  renderers={renderers}
                  emptyMessage="검색 결과가 없습니다."
                />
              )}
            </div>
            <Pagination
              currentPage={equips.pagination.number + 1}
              totalPages={equips.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </Content.Full>
      </ContentLayout>

      {/* 상세 정보 모달 */}
      <Modal isOpen={isDetailModalOpen} onClose={closeModals} title="자산 상세 정보" variant="large">
        {selectedEquip && (
          <DetailModal
            equipId={selectedEquip.id}
            api={equipApi.getAdminDetail}
            onClose={closeModals}
            onEdit={() => openFormModal(selectedEquip)}
            onDelete={handleDelete}
            editButtonText="수정"
          />
        )}
      </Modal>

      {/* 등록/수정 폼 모달 */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={closeModals}
        title={isEditMode ? '자산 정보 수정' : '신규 자산 등록'}
        onConfirm={triggerFormSubmit}
        confirmText={isEditMode ? '수정' : '등록'}
        cancelText="취소"
        variant="large"
      >
        <EquipForm
          ref={formRef}
          initialData={selectedEquip}
          onSubmit={handleFormSubmit}
          userOptions={userOptions}
          isEditMode={isEditMode}
        />
      </Modal>

      {/* 자산 유형 관리 모달 */}
      <Modal
        isOpen={isTypeManageModalOpen}
        onClose={() => setIsTypeManageModalOpen(false)}
        title="자산 유형 관리"
        variant="large"
        confirmText="닫기"
        onConfirm={() => setIsTypeManageModalOpen(false)}
      >
        <div className={layoutStyles.tbBtnArea}>
          <Button variant="primary" size="sm" onClick={() => openTypeFormModal()}>
            + 새 유형 추가
          </Button>
        </div>
        <DataTable
          columns={typeColumns}
          data={equipTypes}
          keyField="eqpTyId"
          onRowClick={openTypeFormModal}
          emptyMessage="등록된 자산 유형이 없습니다."
        />
      </Modal>

      {/* 자산 유형 등록/수정 폼 모달 (중첩 모달) */}
      <Modal
        isOpen={isTypeFormModalOpen}
        onClose={() => setIsTypeFormModalOpen(false)}
        title={selectedType ? '유형 수정' : '새 유형 추가'}
        onConfirm={triggerTypeFormSubmit}
        confirmText={selectedType ? '수정' : '추가'}
        cancelText="취소"
      >
        <TypeForm
          ref={typeFormRef}
          initialData={selectedType}
          onSubmit={handleTypeFormSubmit}
          onDelete={selectedType ? handleDeleteType : null}
        />
      </Modal>
    </>
  );
}
