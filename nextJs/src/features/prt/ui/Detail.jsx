'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button, Label } from '@/shared/component';
import { api } from '../script/api';
import { validateExampleForm, validateField } from '../script/schema';
import { Partner } from '@/features/prt';
import { createDynamicPath } from '@/shared/lib/routing';
import { useAlertStore } from '@/shared/store/alertStore';
import Datepicker from '@/shared/ui/Input/Datepicker';
import FileInput from './FileInput';

import styles from '@/shared/component/popup/popup.module.scss';
import inputStyles from '@/shared/ui/Input/inputTxt.module.scss';

const PartnerDetail = function (props) {
  const { partnerId, onBack, onDelete, showActions = true, onEditModeChange, onUpdateSuccess } = props;

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const [formData, setFormData] = useState({
    ptnrNm: '',
    ceoNm: '',
    mainSvc: '',
    cntrtStaDt: null,
    bsnsRegNo: '',
    mainMgr: '',
    mgrTel: '',
    note: '',
    fileState: {
      fileId: null,
      existing: [],
      new: [],
      deletedIds: []
    }
  });
  const [errors, setErrors] = useState({});

  const fetchDetail = async function () {
    setLoading(true);
    const result = await api.get(partnerId);

    if (result) {
      const partner = Partner.fromApi(result);
      setPartnerData({
        ptnrNm: partner.ptnrNm || '',
        ceoNm: partner.ceoNm || '',
        mainSvc: partner.mainSvc || '',
        cntrtStaDt: partner.cntrtStaDt || null,
        bsnsRegNo: partner.bsnsRegNo || '',
        mainMgr: partner.mainMgr || '',
        mgrTel: partner.mgrTel || '',
        note: partner.note || '',
        fileState: {
          fileId: partner.fileId || null,
          existing: partner.fileList || [],
          new: [],
          deletedIds: []
        }
      });
      setFormData({
        ptnrNm: partner.ptnrNm || '',
        ceoNm: partner.ceoNm || '',
        mainSvc: partner.mainSvc || '',
        cntrtStaDt: partner.cntrtStaDt || null,
        bsnsRegNo: partner.bsnsRegNo || '',
        mainMgr: partner.mainMgr || '',
        mgrTel: partner.mgrTel || '',
        note: partner.note || '',
        fileState: {
          fileId: partner.fileId || null,
          existing: partner.fileList || [],
          new: [],
          deletedIds: []
        }
      });
    }
    setLoading(false);
  };

  const handleDelete = async function () {
    const success = await api.delete(partnerId);
    if (success) {
      onDelete?.() || onBack?.() || router.push(createDynamicPath('/prt'));
    }
  };

  const handleBack = function () {
    onBack?.() || router.back();
  };

  const handleEditMode = function () {
    setIsEditMode(true);
    if (onEditModeChange) onEditModeChange(true);
  };

  const handleCancelEdit = function () {
    setIsEditMode(false);
    if (onEditModeChange) onEditModeChange(false);
    // 원래 데이터로 복원
    setFormData({
      ptnrNm: partnerData.ptnrNm || '',
      ceoNm: partnerData.ceoNm || '',
      mainSvc: partnerData.mainSvc || '',
      cntrtStaDt: partnerData.cntrtStaDt || null,
      bsnsRegNo: partnerData.bsnsRegNo || '',
      mainMgr: partnerData.mainMgr || '',
      mgrTel: partnerData.mgrTel || '',
      note: partnerData.note || '',
      fileState: {
        fileId: partnerData.fileId || null,
        existing: partnerData.fileList || [],
        new: [],
        deletedIds: []
      }
    });
    setErrors({});
  };

  const handleSave = async function () {
    if (!formData) {
      console.error('저장 실패: 폼 데이터가 준비되지 않았습니다.');
      setSaving(false);
      return;
    }
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
      const result = await api.update(partnerId, formData, formData.fileState);

      if (result) {
        setIsEditMode(false);
        if (onEditModeChange) onEditModeChange(false);
        await fetchDetail();

        if (onUpdateSuccess) onUpdateSuccess();
      }
    } catch (error) {
      console.error('협력사 저장 중 오류 발생:', error);
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
    const validation = validateField(field, value);
    if (validation.success) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: validation.error }));
    }
  };

  const confirmDelete = function () {
    const { showConfirm } = useAlertStore.getState();
    showConfirm({
      title: '협력사 삭제',
      message: `"${partnerData?.ptnrNm || '이 협력사를'}" 정말로 삭제하시겠습니까?`,
      onConfirm: handleDelete,
      variant: 'warning',
      confirmText: '삭제',
      cancelText: '취소'
    });
  };

  useEffect(
    function () {
      if (partnerId) fetchDetail();
    },
    [partnerId]
  );
  useEffect(() => {
    if (props.onSaveHandlerReady) {
      if (formData) {
        props.onSaveHandlerReady(handleSave);
      } else {
        props.onSaveHandlerReady(null);
      }
    }
  }, [formData, props.onSaveHandlerReady]);

  if (loading) {
    return <div className={styles.loadingContainer}>로딩 중...</div>;
  }

  if (!partnerData || !formData) {
    return (
      <div className={styles.errorContainer}>
        <h2>협력사를 찾을 수 없습니다</h2>
        <Button variant="primary" onClick={handleBack}>
          목록으로
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* 상단 버튼 영역 */}
      {showActions && (
        <div className={styles.modalTopBtnArea}>
          {isEditMode ? (
            <Button variant="secondary" onClick={handleCancelEdit} disabled={saving}>
              취소
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={handleEditMode}>
                수정
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                삭제
              </Button>
            </>
          )}
        </div>
      )}
      <div className={`${styles.modalContent}`}>
        {isEditMode ? (
          // 수정 모드
          <>
            <ul className={`${styles.modalInfoBlock} ${styles.modalInfoUl} hasItem02`}>
              <li>
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
              </li>

              <li>
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
              </li>

              <li>
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
              </li>

              <li>
                <Label>계약시작일</Label>
                <Datepicker
                  selectedDate={formData.cntrtStaDt}
                  onChange={(date) => handleInputChange('cntrtStaDt', date)}
                  disabled={saving}
                  placeholder="계약시작일 선택"
                />
                {errors.cntrtStaDt && <div className={styles.fieldError}>{errors.cntrtStaDt}</div>}
              </li>

              <li>
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
              </li>

              <li>
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
              </li>

              <li>
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
              </li>

              <li>
                <FileInput
                  label={'첨부파일'}
                  fileState={formData.fileState}
                  onChange={handleFilesChange}
                  multiple={true}
                  disabled={saving}
                  placeholder="파일을 첨부해주세요."
                />
              </li>
            </ul>

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
          </>
        ) : (
          // 읽기 모드
          <>
            <ul className={`${styles.modalInfoBlock} ${styles.modalInfoUl} hasItem02`}>
              <li>
                <Label>협력사명</Label>
                <p className={styles.modalInfoLi}>{partnerData.ptnrNm}</p>
              </li>

              <li>
                <Label>대표자명</Label>
                <p className={styles.modalInfoLi}>{partnerData.ceoNm || ''}</p>
              </li>

              <li>
                <Label>주요서비스</Label>
                <p className={styles.modalInfoLi}>{partnerData.mainSvc || ''}</p>
              </li>

              <li>
                <Label>계약시작일</Label>
                <p className={styles.modalInfoLi}>{partnerData.cntrtStaDt || ''}</p>
              </li>

              <li>
                <Label>사업자번호</Label>
                <p className={styles.modalInfoLi}>{partnerData.bsnsRegNo || ''}</p>
              </li>

              <li>
                <Label>담당자</Label>
                <p className={styles.modalInfoLi}>{partnerData.mainMgr || ''}</p>
              </li>

              <li>
                <Label>연락처</Label>
                <p className={styles.modalInfoLi}>{partnerData.mgrTel || ''}</p>
              </li>

              <li>
                <FileInput
                  label={'첨부파일'}
                  fileState={partnerData.fileState}
                  multiple={true}
                  disabled={true}
                  placeholder=""
                />
              </li>
            </ul>
            <div className={styles.formRow}>
              <Label>비고</Label>
              <textarea className={inputStyles.textarea} value={partnerData.note || ''} disabled rows={3} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PartnerDetail;
