'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Select } from '@/shared/component';

const DeleteSurveyForm = React.forwardRef(({ onSubmit, surveyOptions }, ref) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      survId: ''
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit(data.survId);
  };

  React.useImperativeHandle(ref, () => ({
    submit: handleSubmit(handleFormSubmit)
  }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4">
      <Controller
        name="survId"
        control={control}
        rules={{ required: '삭제할 실사 회차를 선택해주세요.' }}
        render={({ field }) => (
          <Select
            {...field}
            label="삭제할 실사 선택"
            options={surveyOptions.filter((opt) => opt.value !== 'all')}
            error={errors.survId?.message}
            placeholder="-- 실사 회차 선택 --"
          />
        )}
      />
    </form>
  );
});

DeleteSurveyForm.displayName = 'DeleteSurveyForm';

DeleteSurveyForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  surveyOptions: PropTypes.array.isRequired
};

export default DeleteSurveyForm;
