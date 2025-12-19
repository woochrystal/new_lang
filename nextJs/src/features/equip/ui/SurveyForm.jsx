'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Input, Datepicker } from '@/shared/component';
import layoutStyles from '@/shared/component/layout/layout.module.scss';

const SurveyForm = React.forwardRef(({ initialData, onSubmit }, ref) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      survDesc: '',
      survStaDt: new Date(),
      survEndDt: null
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        survStaDt: initialData.survStaDt ? new Date(initialData.survStaDt) : null,
        survEndDt: initialData.survEndDt ? new Date(initialData.survEndDt) : null
      });
    }
  }, [initialData, reset]);

  React.useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit)
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={layoutStyles.hasItem02}>
        <div className="gridFull">
          <Controller
            name="survDesc"
            control={control}
            rules={{ required: '실사명은 필수입니다.' }}
            render={({ field }) => <Input {...field} label="실사명" error={errors.survDesc?.message} />}
          />
        </div>
        <Controller
          name="survStaDt"
          control={control}
          rules={{ required: '시작일은 필수입니다.' }}
          render={({ field }) => (
            <Datepicker
              label="시작일"
              selected={field.value}
              onChange={field.onChange}
              error={errors.survStaDt?.message}
              disabled={!!initialData}
            />
          )}
        />
        <Controller
          name="survEndDt"
          control={control}
          rules={{ required: '종료일은 필수입니다.' }}
          render={({ field }) => (
            <Datepicker
              label="종료일"
              selected={field.value}
              onChange={field.onChange}
              error={errors.survEndDt?.message}
            />
          )}
        />
      </div>
    </form>
  );
});

SurveyForm.displayName = 'SurveyForm';

SurveyForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
};

export default SurveyForm;
