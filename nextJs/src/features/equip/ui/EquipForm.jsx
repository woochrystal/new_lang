'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Input, Select, Datepicker, Textarea, Button } from '@/shared/component';
import { equipApi } from '@/features/equip';
import { ADMIN_EQUIP_STATUS_OPTIONS, OWNERSHIP_TYPE_OPTIONS, EQUIP_CATEGORY_OPTIONS } from '../script/constants';
import { useAlertStore } from '@/shared/store/alertStore';

const EquipForm = React.forwardRef(
  ({ initialData, onSubmit, userOptions = [], isEditMode = false, disabledFields = [] }, ref) => {
    const {
      control,
      handleSubmit,
      watch,
      setValue,
      reset,
      formState: { errors }
    } = useForm({
      defaultValues: {
        eqpTy: '',
        eqpNm: '',
        assetNo: '',
        serialNo: '',
        buyDtm: null,
        owner: '',
        eqpSt: 'IN_USE',
        usrId: null,
        usrNm: '',
        note: ''
      }
    });

    const { showError } = useAlertStore();
    const [equipTypes, setEquipTypes] = useState([]);
    const [models, setModels] = useState([]);
    const [assets, setAssets] = useState([]);
    const [loadingTypes, setLoadingTypes] = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [isAssetNoChecked, setIsAssetNoChecked] = useState(false);
    const [assetNoError, setAssetNoError] = useState('');

    const selectedEqpTy = watch('eqpTy');
    const selectedEqpNm = watch('eqpNm');
    const selectedAssetNo = watch('assetNo');

    // 관리자 모드인지 확인 (userOptions가 있으면 관리자 모드로 간주)
    const isAdminMode = userOptions.length > 0;

    // Admin Mode: Fetch Equip Types
    useEffect(() => {
      const fetchEquipTypes = async () => {
        setLoadingTypes(true);
        const result = await equipApi.getEquipTypes();
        if (result && result.data) {
          setEquipTypes(result.data);
        } else {
          showError('장비 유형 목록을 불러오는데 실패했습니다.');
        }
        setLoadingTypes(false);
      };
      if (isAdminMode) {
        fetchEquipTypes();
      }
    }, [isAdminMode, showError]);

    useEffect(() => {
      reset(
        initialData || {
          eqpTy: '',
          eqpNm: '',
          assetNo: '',
          serialNo: '',
          buyDtm: null,
          owner: '',
          eqpSt: 'IN_USE',
          usrId: null,
          usrNm: '',
          note: ''
        }
      );
      if (initialData) {
        setIsAssetNoChecked(true);
      } else {
        setIsAssetNoChecked(false);
      }
      setAssetNoError('');
    }, [initialData, reset]);

    // Auto-prefix asset number in Admin mode
    useEffect(() => {
      if (isAdminMode && !initialData && selectedEqpTy) {
        const selectedType = equipTypes.find((type) => type.eqpTy === selectedEqpTy);
        if (selectedType) {
          setValue('assetNo', `${selectedType.eqpTy}-`);
        }
      }
    }, [isAdminMode, initialData, selectedEqpTy, equipTypes, setValue]);

    // User Mode: Cascading Selects (가져오기 모드일 때만)
    useEffect(() => {
      if (!isAdminMode && !isEditMode && selectedEqpTy) {
        const fetchModels = async () => {
          setLoadingModels(true);
          setModels([]);
          setAssets([]);
          setValue('eqpNm', '');
          setValue('assetNo', '');
          const result = await equipApi.getModelNamesByType(selectedEqpTy);
          if (result && result.data) setModels(result.data.map((name) => ({ value: name, label: name })));
          setLoadingModels(false);
        };
        fetchModels();
      }
    }, [isAdminMode, isEditMode, selectedEqpTy, setValue]);

    useEffect(() => {
      if (!isAdminMode && !isEditMode && selectedEqpNm) {
        const fetchAssets = async () => {
          setLoadingAssets(true);
          setAssets([]);
          setValue('assetNo', '');
          const result = await equipApi.getAssetsByModel(selectedEqpNm);
          if (result && result.data)
            setAssets(result.data.map((asset) => ({ value: asset.assetNo, label: asset.assetNo })));
          setLoadingAssets(false);
        };
        fetchAssets();
      }
    }, [isAdminMode, isEditMode, selectedEqpNm, setValue]);

    useEffect(() => {
      if (!isAdminMode && !isEditMode && selectedAssetNo) {
        const fetchDetails = async () => {
          const result = await equipApi.getEquipDetailByAssetNo(selectedAssetNo);
          if (result && result.data) {
            setValue('serialNo', result.data.serialNo);
            setValue('buyDtm', result.data.buyDtm ? new Date(result.data.buyDtm) : null);
            setValue('owner', result.data.owner);
            setValue('usrNm', result.data.usrNm);
          }
        };
        fetchDetails();
      }
    }, [isAdminMode, isEditMode, selectedAssetNo, setValue]);

    // Admin Mode: Asset No check
    const handleCheckAssetNo = async () => {
      const assetNo = watch('assetNo');
      if (!assetNo) {
        setAssetNoError('자산번호를 입력해주세요.');
        return;
      }
      const result = await equipApi.checkAssetNoExists(assetNo);
      if (result && result.data === true) {
        setAssetNoError('이미 사용 중인 자산번호입니다.');
        setIsAssetNoChecked(false);
      } else {
        setAssetNoError('사용 가능한 자산번호입니다.');
        setIsAssetNoChecked(true);
      }
    };

    const handleFormSubmit = (data) => {
      // 관리자 모드이고 신규 등록일 때만 중복 확인 체크
      if (isAdminMode && !initialData && !isAssetNoChecked) {
        showError('자산번호 중복 확인을 해주세요.');
        return;
      }
      onSubmit(data);
    };

    React.useImperativeHandle(ref, () => ({
      submit: handleSubmit(handleFormSubmit)
    }));

    const equipTypeOptions = equipTypes.map((type) => ({
      value: type.eqpTy,
      label: type.eqpTyNm
    }));

    return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 grid grid-cols-2 gap-x-8 gap-y-6">
        {/* --- 관리자 모드 (신규/수정) --- */}
        {isAdminMode && (
          <>
            <Controller
              name="eqpTy"
              control={control}
              rules={{ required: '종류는 필수입니다.' }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="종류"
                  options={equipTypeOptions}
                  error={errors.eqpTy?.message}
                  disabled={loadingTypes || !!initialData || disabledFields.includes('eqpTy')}
                  placeholder={loadingTypes ? '유형 불러오는 중...' : '장비 유형 선택'}
                />
              )}
            />
            <div className="col-span-2">
              <div className="grid grid-cols-5 gap-x-2">
                <div className="col-span-4">
                  <Controller
                    name="assetNo"
                    control={control}
                    rules={{ required: '자산번호는 필수입니다.' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="자산번호"
                        error={errors.assetNo?.message}
                        disabled={!!initialData || !selectedEqpTy || disabledFields.includes('assetNo')}
                        placeholder={!selectedEqpTy ? '종류를 먼저 선택하세요' : ''}
                      />
                    )}
                  />
                </div>
                {!initialData && (
                  <div className="flex items-end h-full">
                    <Button type="button" variant="secondary" onClick={handleCheckAssetNo} className="w-full">
                      중복확인
                    </Button>
                  </div>
                )}
              </div>
              <div className="min-h-[1.25rem] mt-1 text-sm">
                {assetNoError && <p className="text-red-500">{assetNoError}</p>}
              </div>
            </div>
            <Controller
              name="eqpNm"
              control={control}
              rules={{ required: '장비명은 필수입니다.' }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="장비명"
                  error={errors.eqpNm?.message}
                  disabled={disabledFields.includes('eqpNm')}
                />
              )}
            />
            <Controller
              name="serialNo"
              control={control}
              rules={{ required: '시리얼 번호는 필수입니다.' }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="시리얼 번호"
                  error={errors.serialNo?.message}
                  disabled={disabledFields.includes('serialNo')}
                />
              )}
            />
            <Controller
              name="buyDtm"
              control={control}
              render={({ field }) => (
                <Datepicker
                  label="구매일"
                  selected={field.value}
                  onChange={field.onChange}
                  disabled={disabledFields.includes('buyDtm')}
                />
              )}
            />
            <Controller
              name="owner"
              control={control}
              rules={{ required: '소유 구분은 필수입니다.' }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="소유 구분"
                  options={OWNERSHIP_TYPE_OPTIONS.filter((opt) => opt.value !== 'all')}
                  error={errors.owner?.message}
                  disabled={disabledFields.includes('owner')}
                />
              )}
            />
            <Controller
              name="eqpSt"
              control={control}
              rules={{ required: '상태는 필수입니다.' }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="상태"
                  options={ADMIN_EQUIP_STATUS_OPTIONS}
                  error={errors.eqpSt?.message}
                  disabled={disabledFields.includes('eqpSt')}
                />
              )}
            />
            <Controller
              name="usrId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="사용자"
                  options={userOptions}
                  placeholder="사용자 선택"
                  disabled={disabledFields.includes('usrId')}
                />
              )}
            />
            <div className="col-span-2">
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <Textarea {...field} label="비고" rows={3} disabled={disabledFields.includes('note')} />
                )}
              />
            </div>
          </>
        )}

        {/* --- 사용자 수정 모드 (이관) --- */}
        {!isAdminMode && isEditMode && (
          <>
            <Controller
              name="assetNo"
              control={control}
              render={({ field }) => (
                <Input {...field} label="자산번호" disabled={disabledFields.includes('assetNo')} />
              )}
            />
            <Controller
              name="eqpNm"
              control={control}
              render={({ field }) => <Input {...field} label="장비명" disabled={disabledFields.includes('eqpNm')} />}
            />
            <Controller
              name="serialNo"
              control={control}
              render={({ field }) => (
                <Input {...field} label="시리얼 번호" disabled={disabledFields.includes('serialNo')} />
              )}
            />
            <Controller
              name="buyDtm"
              control={control}
              render={({ field }) => (
                <Datepicker label="구매일" selected={field.value} disabled={disabledFields.includes('buyDtm')} />
              )}
            />
            <Controller
              name="owner"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="소유 구분"
                  options={OWNERSHIP_TYPE_OPTIONS}
                  disabled={disabledFields.includes('owner')}
                />
              )}
            />
            {/* 상태 필드: disabledFields에 포함되지 않으면 활성화 */}
            <Controller
              name="eqpSt"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="상태"
                  options={ADMIN_EQUIP_STATUS_OPTIONS}
                  disabled={disabledFields.includes('eqpSt')}
                />
              )}
            />
            {/* 사용자 필드: disabledFields에 포함되지 않으면 활성화 */}
            <Controller
              name="usrId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="사용자 (이관)"
                  options={userOptions}
                  placeholder="이관할 사용자 선택"
                  disabled={disabledFields.includes('usrId')}
                />
              )}
            />
            <div className="col-span-2">
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <Textarea {...field} label="비고" rows={3} disabled={disabledFields.includes('note')} />
                )}
              />
            </div>
          </>
        )}

        {/* --- 사용자 가져오기 모드 --- */}
        {!isAdminMode && !isEditMode && (
          <>
            <Controller
              name="eqpTy"
              control={control}
              rules={{ required: '종류를 먼저 선택해주세요.' }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="종류"
                  options={EQUIP_CATEGORY_OPTIONS.filter((opt) => opt.value !== 'all')}
                  error={errors.eqpTy?.message}
                />
              )}
            />
            <Controller
              name="eqpNm"
              control={control}
              rules={{ required: '장비명을 선택해주세요.' }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="장비명"
                  options={models}
                  disabled={!selectedEqpTy || loadingModels}
                  placeholder={loadingModels ? '불러오는 중...' : '종류 선택 후 선택'}
                  error={errors.eqpNm?.message}
                />
              )}
            />
            <div className="col-span-2">
              <Controller
                name="assetNo"
                control={control}
                rules={{ required: '자산번호를 선택해주세요.' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="자산번호"
                    options={assets}
                    disabled={!selectedEqpNm || loadingAssets}
                    placeholder={loadingAssets ? '불러오는 중...' : '장비명 선택 후 선택'}
                    error={errors.assetNo?.message}
                  />
                )}
              />
            </div>
            <Controller
              name="serialNo"
              control={control}
              render={({ field }) => <Input {...field} label="시리얼 번호" disabled />}
            />
            <Controller
              name="buyDtm"
              control={control}
              render={({ field }) => (
                <Datepicker label="구매일" selected={field.value} onChange={field.onChange} disabled />
              )}
            />
            <Controller
              name="owner"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="소유 구분"
                  options={OWNERSHIP_TYPE_OPTIONS.filter((opt) => opt.value !== 'all')}
                  disabled
                />
              )}
            />
            <Controller
              name="usrNm"
              control={control}
              render={({ field }) => <Input {...field} label="현재 사용자" disabled />}
            />
          </>
        )}
      </form>
    );
  }
);

EquipForm.displayName = 'EquipForm';

EquipForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  userOptions: PropTypes.array,
  isEditMode: PropTypes.bool,
  disabledFields: PropTypes.arrayOf(PropTypes.string)
};

export default EquipForm;
