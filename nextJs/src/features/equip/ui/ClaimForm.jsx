'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Input, Select, Datepicker } from '@/shared/component';
import { equipApi } from '@/features/equip';
import { EQUIP_CATEGORY_OPTIONS, OWNERSHIP_TYPE_OPTIONS } from '../script/constants';
import layoutStyles from '@/shared/component/layout/layout.module.scss';

const ClaimForm = React.forwardRef(({ onSubmit }, ref) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      eqpTy: '',
      eqpNm: '',
      assetNo: '',
      serialNo: '',
      buyDtm: null,
      owner: '',
      usrNm: ''
    }
  });

  const [models, setModels] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(false);

  const selectedEqpTy = watch('eqpTy');
  const selectedEqpNm = watch('eqpNm');
  const selectedAssetNo = watch('assetNo');

  useEffect(() => {
    if (selectedEqpTy) {
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
  }, [selectedEqpTy, setValue]);

  useEffect(() => {
    if (selectedEqpNm) {
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
  }, [selectedEqpNm, setValue]);

  useEffect(() => {
    if (selectedAssetNo) {
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
  }, [selectedAssetNo, setValue]);

  React.useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit)
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={layoutStyles.boardWrap}>
      <div className={layoutStyles.hasItem02}>
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
      </div>
      <div className={layoutStyles.hasItem01}>
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
      <div className={layoutStyles.hasItem02}>
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
      </div>
      <div className={layoutStyles.hasItem02}>
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
      </div>
    </form>
  );
});

ClaimForm.displayName = 'ClaimForm';

ClaimForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default ClaimForm;
