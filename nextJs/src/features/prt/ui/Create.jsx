'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '../script/api';
import { validateField, validateExampleForm } from '../script/schema';
import { Label } from '@/shared/component';
import Datepicker from '@/shared/ui/Input/Datepicker';
import FileInput from './FileInput';

import styles from './Partner.module.scss';
import inputStyles from '@/shared/ui/Input/inputTxt.module.scss';

const PartnerCreate = function (props) {
  const { onCreateSuccess, onSaveHandlerReady } = props;

  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    ptnrNm: '',
    ceoNm: '',
    mainSvc: '',
    cntrtStaDt: null,
    bsnsRegNo: '',
    mainMgr: '',
    mgrTel: '',
    fileId: null,
    note: '',
    fileState: {
      fileId: null,
      existing: [],
      new: [],
      deletedIds: []
    }
  });
  const [errors, setErrors] = useState({});

  const handleSave = async function () {
    // API 전송 전 날짜 필드 변환
    const dataToValidate = { ...formData };

    // 날짜 필드가 비어있지 않으면 Date 객체로 변환
    if (formData.cntrtStaDt && formData.cntrtStaDt.trim() !== '') {
      dataToValidate.cntrtStaDt = new Date(formData.cntrtStaDt);
    } else {
      // 빈 값이면 undefined로 처리 (optional)
      delete dataToValidate.cntrtStaDt;
    }

    // 전체 폼 유효성 검증
    const validation = validateExampleForm(dataToValidate);

    if (!validation.success) {
      setErrors(validation.errors);
      console.error('유효성 검증 실패:', validation.errors);
      return;
    }

    setSaving(true);

    try {
      // API 전송 데이터 준비 (빈 날짜는 null로 변환)
      const dataToSubmit = {
        ...formData,
        cntrtStaDt: formData.cntrtStaDt && formData.cntrtStaDt.trim() !== '' ? formData.cntrtStaDt : null
      };

      const result = await api.create(dataToSubmit, formData.fileState);

      if (result) {
        if (onCreateSuccess) onCreateSuccess();
      }
    } catch (error) {
      console.error('협력사 등록 중 오류 발생:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFilesChange = (newFileState) => {
    setFormData((prev) => ({
      ...prev,
      fileState: newFileState
    }));
  };

  const handleInputChange = function (field, value) {
    setFormData({ ...formData, [field]: value });
    // 날짜 필드 실시간 검증 처리
    if (field === 'cntrtStaDt') {
      if (!value) {
        // 빈 값은 optional이므로 에러 제거
        setErrors((prev) => ({ ...prev, [field]: null }));
        return;
      }
      // 값이 있으면 Date 객체로 변환하여 검증
      const validation = validateField(field, new Date(value));
      if (validation.success) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: validation.error }));
      }
      return;
    }

    // 다른 필드는 일반 검증
    const validation = validateField(field, value);
    if (validation.success) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: validation.error }));
    }
  };

  // 저장 핸들러를 부모에게 전달
  useEffect(() => {
    if (onSaveHandlerReady) {
      onSaveHandlerReady(handleSave);
    }
  }, [formData, onSaveHandlerReady]);

  return (
    <div className={styles.detailModal}>
      <div className="pageScroll">
        <div className={styles.formGrid}>
          <div className={styles.formRow}>
            <Label required>협력사명</Label>
            <div className={inputStyles.inputTxt}>
              <input
                type="text"
                placeholder="협력사명 입력"
                value={formData.ptnrNm}
                onChange={(e) => handleInputChange('ptnrNm', e.target.value)}
                disabled={saving}
              />
            </div>
            {errors.ptnrNm && <div className={styles.fieldError}>{errors.ptnrNm}</div>}
          </div>

          <div className={styles.formRow}>
            <Label required>대표자명</Label>
            <div className={inputStyles.inputTxt}>
              <input
                type="text"
                placeholder="대표자명 입력"
                value={formData.ceoNm}
                onChange={(e) => handleInputChange('ceoNm', e.target.value)}
                disabled={saving}
              />
            </div>
            {errors.ceoNm && <div className={styles.fieldError}>{errors.ceoNm}</div>}
          </div>

          <div className={styles.formRow}>
            <Label>주요서비스</Label>
            <div className={inputStyles.inputTxt}>
              <input
                type="text"
                placeholder="주요서비스 입력"
                value={formData.mainSvc}
                onChange={(e) => handleInputChange('mainSvc', e.target.value)}
                disabled={saving}
              />
            </div>
            {errors.mainSvc && <div className={styles.fieldError}>{errors.mainSvc}</div>}
          </div>

          <div className={styles.formRow}>
            <Label>계약시작일</Label>
            <Datepicker
              selectedDate={formData.cntrtStaDt}
              onChange={(date) => handleInputChange('cntrtStaDt', date)}
              disabled={saving}
              placeholder="계약시작일 선택"
            />
            {errors.cntrtStaDt && <div className={styles.fieldError}>{errors.cntrtStaDt}</div>}
          </div>

          <div className={styles.formRow}>
            <Label>사업자번호</Label>
            <div className={inputStyles.inputTxt}>
              <input
                type="text"
                placeholder="000-00-00000"
                value={formData.bsnsRegNo}
                onChange={(e) => handleInputChange('bsnsRegNo', e.target.value)}
                disabled={saving}
              />
            </div>
            {errors.bsnsRegNo && <div className={styles.fieldError}>{errors.bsnsRegNo}</div>}
          </div>

          <div className={styles.formRow}>
            <Label>담당자</Label>
            <div className={inputStyles.inputTxt}>
              <input
                type="text"
                placeholder="담당자명 입력"
                value={formData.mainMgr}
                onChange={(e) => handleInputChange('mainMgr', e.target.value)}
                disabled={saving}
              />
            </div>
            {errors.mainMgr && <div className={styles.fieldError}>{errors.mainMgr}</div>}
          </div>

          <div className={styles.formRow}>
            <Label>연락처</Label>
            <div className={inputStyles.inputTxt}>
              <input
                type="tel"
                placeholder="연락처 입력"
                value={formData.mgrTel}
                onChange={(e) => handleInputChange('mgrTel', e.target.value)}
                disabled={saving}
              />
            </div>
            {errors.mgrTel && <div className={styles.fieldError}>{errors.mgrTel}</div>}
          </div>

          <div className={styles.formRow}>
            <FileInput
              label={'첨부파일'}
              fileState={formData.fileState}
              onChange={handleFilesChange}
              multiple={true}
              disabled={saving}
              placeholder="파일을 첨부해주세요."
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <Label>비고</Label>
          <textarea
            className={inputStyles.textarea}
            value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            disabled={saving}
            rows={3}
          />
          {errors.note && <div className={styles.fieldError}>{errors.note}</div>}
        </div>
      </div>
    </div>
  );
};

export default PartnerCreate;
