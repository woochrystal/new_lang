'use client';

import { useState, useEffect } from 'react';

import { Input, Button, Label, Drawer, Section, Footer } from '@/shared/component';
import { validateVacCntForm } from '../script/schema';

/**
 * 휴가일수 등록/수정 폼 컴포넌트 (드로워)
 * @param {Object} props
 * @param {boolean} props.isOpen - 드로워 오픈 여부
 * @param {Object} [props.initialData] - 초기 데이터(수정 모드)
 * @param {Function} props.onSubmit - 폼 제출 핸들러
 * @param {Function} props.onClose - 드로워 닫기 핸들러
 * @param {boolean} [props.isEditMode=false] - 수정 모드 여부
 * @param {Array} props.yearOptions - 연도 옵션 목록 (미사용)
 * @param {boolean} [props.isSubmitting=false] - 제출 상태
 */
const VacCntForm = function (props) {
  const { isOpen, initialData, onSubmit, onClose, isEditMode = false, yearOptions = [], isSubmitting = false } = props;

  const [formData, setFormData] = useState({
    empName: '',
    year: new Date().getFullYear(),
    usedVacationDays: 0,
    totalVacationDays: 0
  });

  const [errors, setErrors] = useState({});

  // 초기 데이터 설정
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        console.log('[DEBUG Form] initialData:', initialData);
        setFormData({
          empName: initialData.empName ?? '',
          year: Number(initialData.year ?? new Date().getFullYear()),
          usedVacationDays: Number(initialData.usedVacationDays ?? 0),
          totalVacationDays: Number(initialData.totalVacationDays ?? 0)
        });
      } else {
        setFormData({
          empName: '',
          year: new Date().getFullYear(),
          usedVacationDays: 0,
          totalVacationDays: 0
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (field) => (arg) => {
    // Input: (e) => e.target.value, (Select는 값 자체)
    const rawValue = arg && typeof arg === 'object' && 'target' in arg ? arg.target.value : arg;

    // 숫자 필드 처리
    if (field === 'year' || field === 'usedVacationDays' || field === 'totalVacationDays') {
      const numValue = rawValue === '' || rawValue === undefined || rawValue === null ? 0 : Number(rawValue);
      setFormData((prev) => ({
        ...prev,
        [field]: numValue
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: rawValue
      }));
    }

    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성검사
    const validation = validateVacCntForm(formData);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={isEditMode ? '휴가일수 관리' : '휴가일수 등록'}>
      <form onSubmit={handleSubmit}>
        <Section className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="empName">
              직원명 <span className="text-blue-600"></span>
            </Label>
            <Input
              id="empName"
              value={formData.empName}
              onChange={handleChange('empName')}
              placeholder="직원명을 입력하세요"
              required
              disabled={isEditMode}
            />
            {errors.empName && <span className="text-red-600 text-xs">{errors.empName}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="year">
              기준년도 <span className="text-blue-600"></span>
            </Label>
            {isEditMode ? (
              <div id="year" className="py-2 px-3 rounded border border-gray-200 bg-gray-50">
                {formData.year}
              </div>
            ) : (
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={handleChange('year')}
                placeholder="예: 2025"
                required
              />
            )}
            {errors.year && <span className="text-red-600 text-xs">{errors.year}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="usedVacationDays">
              휴가 사용일수 <span className="text-blue-600"></span>
            </Label>
            <Input
              id="usedVacationDays"
              type="number"
              step="1"
              value={formData.usedVacationDays}
              onChange={handleChange('usedVacationDays')}
              placeholder="0.0"
              required
            />
            {errors.usedVacationDays && <span className="text-red-600 text-xs">{errors.usedVacationDays}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="totalVacationDays">
              총 휴가일수 <span className="text-blue-600"></span>
            </Label>
            <Input
              id="totalVacationDays"
              type="number"
              step="1"
              value={formData.totalVacationDays}
              onChange={handleChange('totalVacationDays')}
              placeholder="0.0"
              required
            />
            {errors.totalVacationDays && <span className="text-red-600 text-xs">{errors.totalVacationDays}</span>}
          </div>
        </Section>

        <Footer className="flex items-center justify-center gap-3 pt-4 border-t border-gray-200">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? '처리 중…' : isEditMode ? '수정' : '추가'}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
        </Footer>
      </form>
    </Drawer>
  );
};

export default VacCntForm;
