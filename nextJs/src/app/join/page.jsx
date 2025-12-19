/**
 * <pre>
 * path           : app/(user)/join
 * fileName       : JoinPage
 * author         : hmlee
 * date           : 25. 11. 20.
 * description    : 기업 회원가입 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 20.        hmlee       최초 생성
 * </pre>
 */
'use client';

import React, { useState } from 'react';
import styles from './page.module.scss';

import { JOIN_CONSTANTS, JoinApi, JoinDetail } from '@/features/join';
import { validateJoinField, validateJoinForm } from '@/features/join/script/schema';
import { FileUpload } from '@/features/groupware/myInfo';

import { Button, ContentLayout, Input } from '@/shared/component';
import { useAlertStore } from '@/shared/store/alertStore';

const composeAddress = function (address, addressDetail) {
  const base = address?.trim() || '';
  const detail = addressDetail?.trim() || '';

  if (!base) {
    return '';
  }

  return detail ? `${base}|${detail}` : base;
};

const JoinPage = function () {
  const { showError, showConfirm, showSuccess } = useAlertStore();

  const [formData, setFormData] = useState({
    domainPath: '',
    tenantNm: '',
    loginId: '',
    bsnsRegNo: '',
    tenantTel: '',
    addr: '',
    addrDetail: '',
    mgrEmail: '',
    mgrNm: '',
    mgrTel: ''
  });

  const [fileState, setFileState] = useState({
    bsnsFile: { saved: null, new: null, deleted: false },
    logoFile: { saved: null, new: null, deleted: false }
  });

  const [isDomainChecked, setIsDomainChecked] = useState(false);
  const [isDomainDuplicated, setIsDomainDuplicated] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [fileValidationErrors, setFileValidationErrors] = useState({});

  // 약관 동의 상태
  const [agreements, setAgreements] = useState({
    privacy: false,
    marketing: false,
    terms: false
  });

  const validatableFields = [
    'domainPath',
    'tenantNm',
    'loginId',
    'bsnsRegNo',
    'tenantTel',
    'addr',
    'mgrEmail',
    'mgrNm',
    'mgrTel'
  ];

  // 신규 등록 화면: new 파일만 체크 (saved는 항상 null)
  const isFileAttached = (fileObj) => !!fileObj?.new;

  const handleChange = function (field, value) {
    const newValue = value.trimStart();

    if (field === 'addr' || field === 'addrDetail') {
      setFormData((prev) => {
        const updated = { ...prev, [field]: newValue };
        const composedAddr = composeAddress(updated.addr, updated.addrDetail);
        const { error } = validateJoinField('addr', composedAddr);
        setValidationErrors((prevErrors) => ({ ...prevErrors, addr: error }));
        return updated;
      });
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: newValue }));

    if (field === 'domainPath') {
      setIsDomainChecked(false);
      setIsDomainDuplicated(true);
    }

    if (validatableFields.includes(field)) {
      const { error } = validateJoinField(field, newValue);
      setValidationErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleCheckDomain = async function () {
    const domainPath = formData.domainPath.trim();

    if (!domainPath || validationErrors.domainPath) {
      showError({
        title: '입력 오류',
        message: validationErrors.domainPath || '도메인 경로를 입력해주세요.'
      });
      return;
    }

    setLoading(true);
    try {
      const result = await JoinApi.checkDomainPathDuplication(domainPath);
      const isDuplicated = result?.isDuplicated || false;

      setIsDomainDuplicated(isDuplicated);
      setIsDomainChecked(true);

      if (isDuplicated) {
        showError({
          title: '중복',
          message: `이미 사용 중인 도메인 경로입니다: ${domainPath}`
        });
      } else {
        showSuccess('사용 가능한 도메인 경로입니다.');
      }
    } catch (error) {
      showError({
        title: '오류',
        message: '도메인 중복 확인에 실패했습니다.'
      });
      setIsDomainChecked(false);
      setIsDomainDuplicated(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSearch = function () {
    const loadAndOpenPostcode = function () {
      if (!window?.daum?.Postcode) {
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.onload = function () {
          openPostcode();
        };
        script.onerror = function () {
          showError({
            title: '오류',
            message: '주소 검색 서비스를 이용할 수 없습니다.'
          });
        };
        document.head.appendChild(script);
      } else {
        openPostcode();
      }
    };

    const openPostcode = function () {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const address = data.roadAddress || data.address || '';
          handleChange('addr', address);
        },
        theme: {
          bgColor: '#FFFFFF',
          searchBgColor: '#F8F9FA',
          contentBgColor: '#FFFFFF',
          pageBgColor: '#FFFFFF',
          textColor: '#333333',
          queryTextColor: '#222222',
          postcodeTextColor: '#4A90E2',
          emphTextColor: '#4A90E2',
          outlineColor: '#E0E0E0'
        }
      }).open();
    };

    loadAndOpenPostcode();
  };

  // 약관 동의 체크박스 핸들러
  const handleAgreementChange = function (type) {
    setAgreements((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const validateRequiredFiles = function () {
    const errors = {};

    if (!isFileAttached(fileState.bsnsFile)) {
      errors.bsnsFile = '사업자등록증 파일을 첨부해주세요.';
    }

    return errors;
  };

  const handleFileUpload = function (fileType, file) {
    if (file.name.length > 30) {
      const message = `파일명은 최대 30자까지 가능합니다.\n파일명을 변경한 후 다시 시도해주세요.\n파일명: ${file.name} (${file.name.length}자)`;
      showError({
        title: '파일명 길이 초과',
        message
      });
      setFileValidationErrors((prev) => ({ ...prev, [fileType]: '파일명을 30자 이하로 변경해 주세요.' }));
      return;
    }

    setFileState((prev) => ({
      ...prev,
      [fileType]: {
        saved: prev[fileType]?.saved || null,
        new: file,
        deleted: false
      }
    }));

    setFileValidationErrors((prev) => ({ ...prev, [fileType]: null }));
  };

  const handleFileDelete = function (fileType) {
    setFileState((prev) => ({
      ...prev,
      [fileType]: {
        saved: null,
        new: null,
        deleted: false
      }
    }));

    // 삭제 시 에러 초기화 (제출 시점에 검증)
    setFileValidationErrors((prev) => ({
      ...prev,
      [fileType]: null
    }));
  };

  const handleSubmitJoin = function () {
    // 약관 동의 검증
    if (!agreements.privacy || !agreements.marketing || !agreements.terms) {
      showError({
        title: '약관 동의 필요',
        message: '모든 약관에 동의해주세요.'
      });
      return;
    }

    const composedAddr = composeAddress(formData.addr, formData.addrDetail);
    const validationPayload = { ...formData, addr: composedAddr };
    const { success, errors, data: validatedData } = validateJoinForm(validationPayload);
    const fileErrors = validateRequiredFiles();

    setValidationErrors(errors);
    setFileValidationErrors(fileErrors);

    if (!success || Object.keys(fileErrors).length > 0) {
      showError({
        title: '입력 오류',
        message: '입력된 정보와 필수 첨부파일을 다시 확인해주세요.'
      });
      return;
    }

    if (!isDomainChecked || isDomainDuplicated) {
      showError({
        title: '확인 필요',
        message: '도메인 경로 중복 확인을 완료하고 사용 가능한 경로인지 확인해주세요.'
      });
      return;
    }

    showConfirm({
      title: '가입 신청',
      message: '기업 회원으로 가입을 신청하시겠습니까?',
      variant: 'confirm',
      confirmText: '신청',
      cancelText: '취소',
      onConfirm: () => confirmRegisterTenant(validatedData)
    });
  };

  const confirmRegisterTenant = async function (data) {
    setLoading(true);
    try {
      const buildFormDataPayload = () => {
        const formDataPayload = new FormData();

        // JSON 데이터를 Blob으로 변환하여 추가
        const joinData = {
          domainPath: data.domainPath,
          tenantNm: data.tenantNm,
          loginId: data.loginId,
          bsnsRegNo: data.bsnsRegNo,
          tenantTel: data.tenantTel,
          addr: data.addr,
          mgrEmail: data.mgrEmail,
          mgrNm: data.mgrNm,
          mgrTel: data.mgrTel
        };

        formDataPayload.append('joinData', new Blob([JSON.stringify(joinData)], { type: 'application/json' }));

        // 파일은 그대로 추가
        if (fileState.bsnsFile?.new) {
          formDataPayload.append('bsnsFile', fileState.bsnsFile.new);
        }
        if (fileState.logoFile?.new) {
          formDataPayload.append('logoFile', fileState.logoFile.new);
        }

        return formDataPayload;
      };

      const joinId = await JoinApi.create(buildFormDataPayload());

      if (joinId) {
        showSuccess('가입 신청이 완료되었습니다. 승인 후 이용 가능합니다.');
        // ======= TODO: 추후 가입 완료 후 처리를 초기화 -> 페이지 이동 로직으로 변경 (시작) =======

        // 폼 초기화
        setFormData({
          domainPath: '',
          tenantNm: '',
          loginId: '',
          bsnsRegNo: '',
          tenantTel: '',
          addr: '',
          addrDetail: '',
          mgrEmail: '',
          mgrNm: '',
          mgrTel: ''
        });

        setFileState({
          bsnsFile: { saved: null, new: null, deleted: false },
          logoFile: { saved: null, new: null, deleted: false }
        });

        // 도메인 중복 확인 상태 초기화
        setIsDomainChecked(false);
        setIsDomainDuplicated(true);

        // 검증 에러 초기화
        setValidationErrors({});
        setFileValidationErrors({});

        // 약관 동의 초기화
        setAgreements({
          privacy: false,
          marketing: false,
          terms: false
        });
        // ======= 추후 가입 완료 후 처리를 초기화 -> 페이지 이동 로직으로 변경 (끝)=======
      } else {
        showError({
          title: '등록 오류',
          message: '가입 신청에 실패했습니다. 관리자에게 문의해주세요.'
        });
      }
    } catch (error) {
      showError({
        title: '등록 오류',
        message: '가입 신청 중 예상치 못한 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (field) => validationErrors[field];

  const hasBsnsFile = isFileAttached(fileState.bsnsFile);

  return (
    <ContentLayout>
      <ContentLayout.Header title="기업 회원가입 신청" subtitle="SaaS 그룹웨어 사용을 위해 기업 정보를 등록해주세요." />

      <div className={styles.joinContainer}>
        <div className="hasItem02">
          <div className={styles.formGroup}>
            <Input
              label={'기업명'}
              required={true}
              type="text"
              value={formData.tenantNm}
              onChange={(e) => handleChange('tenantNm', e.target.value)}
              placeholder={`기업명을 입력해주세요 (최대 ${JOIN_CONSTANTS.MAX_TENANT_NM_LENGTH}자)`}
            />
            {getErrorMessage('tenantNm') && <p className={styles.errorMessage}>{getErrorMessage('tenantNm')}</p>}
          </div>

          <div className={`${styles.formGroup} ${styles.domainGroup}`}>
            <div className={styles.domainInputArea}>
              <div className="inputBtnArea">
                <Input
                  label={'도메인 경로 (URL)'}
                  required={true}
                  type="text"
                  value={formData.domainPath}
                  onChange={(e) => handleChange('domainPath', e.target.value)}
                  placeholder={`예: mycompany (영문 소문자, 숫자, 하이픈만, 최대 ${JOIN_CONSTANTS.MAX_DOMAIN_PATH_LENGTH}자)`}
                />
                <Button
                  variant="secondary"
                  onClick={handleCheckDomain}
                  disabled={loading || !formData.domainPath.trim() || !!getErrorMessage('domainPath')}
                  className={styles.domainCheckButton}
                >
                  중복 확인
                </Button>
              </div>

              {getErrorMessage('domainPath') && <p className={styles.errorMessage}>{getErrorMessage('domainPath')}</p>}
              {isDomainChecked && !getErrorMessage('domainPath') && (
                <p
                  className={`${styles.domainResultMessage} ${isDomainDuplicated ? styles.resultError : styles.resultSuccess}`}
                >
                  {isDomainDuplicated ? '❌ 사용 불가능한 경로입니다.' : '✅ 사용 가능한 경로입니다.'}
                </p>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <Input
              label={'관리자 로그인 아이디'}
              required={true}
              type="text"
              value={formData.loginId}
              onChange={(e) => handleChange('loginId', e.target.value)}
              placeholder={`관리자 로그인 아이디를 입력해주세요 (최대 ${JOIN_CONSTANTS.MAX_TENANT_NM_LENGTH}자)`}
            />
            {getErrorMessage('loginId') && <p className={styles.errorMessage}>{getErrorMessage('loginId')}</p>}
          </div>

          <div className={styles.formGroup}>
            <Input
              label={'관리자 이름'}
              type="text"
              value={formData.mgrNm}
              onChange={(e) => handleChange('mgrNm', e.target.value)}
              placeholder={`관리자 이름을 입력해주세요 (최대 ${JOIN_CONSTANTS.MAX_MGR_NM_LENGTH}자)`}
            />
            {getErrorMessage('mgrNm') && <p className={styles.errorMessage}>{getErrorMessage('mgrNm')}</p>}
          </div>

          <div className={styles.formGroup}>
            <Input
              label={'관리자 이메일'}
              type="email"
              value={formData.mgrEmail}
              onChange={(e) => handleChange('mgrEmail', e.target.value)}
              placeholder={`관리자 이메일을 입력해주세요 (최대 ${JOIN_CONSTANTS.MAX_MGR_EMAIL_LENGTH}자)`}
            />
            {getErrorMessage('mgrEmail') && <p className={styles.errorMessage}>{getErrorMessage('mgrEmail')}</p>}
          </div>

          <div className={styles.formGroup}>
            <Input
              label={'관리자 전화번호'}
              type="text"
              value={formData.mgrTel}
              onChange={(e) => handleChange('mgrTel', e.target.value)}
              placeholder={`관리자 전화번호를 입력해주세요 (최대 ${JOIN_CONSTANTS.MAX_MGR_TEL_LENGTH}자)`}
            />
            {getErrorMessage('mgrTel') && <p className={styles.errorMessage}>{getErrorMessage('mgrTel')}</p>}
          </div>

          <div className={styles.formGroup}>
            <Input
              label={'사업자등록번호'}
              required={true}
              type="text"
              value={formData.bsnsRegNo}
              onChange={(e) => handleChange('bsnsRegNo', e.target.value)}
              placeholder="예: 000-00-00000"
            />
            {getErrorMessage('bsnsRegNo') && <p className={styles.errorMessage}>{getErrorMessage('bsnsRegNo')}</p>}
          </div>

          <div className={styles.formGroup}>
            <FileUpload
              label="사업자등록증"
              required={true}
              fileType="bsnsFile"
              fileState={fileState.bsnsFile}
              onUpload={handleFileUpload}
              onDelete={handleFileDelete}
            />
            {fileValidationErrors.bsnsFile && <p className={styles.errorMessage}>{fileValidationErrors.bsnsFile}</p>}
          </div>

          <div className={styles.formGroup}>
            <Input
              label={'주소'}
              variant="search"
              value={formData.addr}
              onChange={(e) => handleChange('addr', e.target.value)}
              onSearch={handleAddressSearch}
              onClear={() => handleChange('addr', '')}
              placeholder="주소를 검색해주세요"
              readOnly
              className={styles.addressInput}
            />
            {getErrorMessage('addr') && <p className={styles.errorMessage}>{getErrorMessage('addr')}</p>}
          </div>

          <div className={styles.formGroup}>
            <Input
              label={'상세주소'}
              type="text"
              value={formData.addrDetail}
              onChange={(e) => handleChange('addrDetail', e.target.value)}
              placeholder="상세주소를 입력해주세요 (최대 50자)"
              maxLength={50}
            />
          </div>

          <div className={styles.formGroup}>
            <Input
              label={'기업 전화번호'}
              type="text"
              value={formData.tenantTel}
              onChange={(e) => handleChange('tenantTel', e.target.value)}
              placeholder={`기업 전화번호를 입력해주세요 (최대 ${JOIN_CONSTANTS.MAX_TENANT_TEL_LENGTH}자)`}
            />
            {getErrorMessage('tenantTel') && <p className={styles.errorMessage}>{getErrorMessage('tenantTel')}</p>}
          </div>

          <div className={styles.formGroup}>
            <FileUpload
              label="기업로고이미지"
              fileType="logoFile"
              fileState={fileState.logoFile}
              onUpload={handleFileUpload}
              onDelete={handleFileDelete}
            />
            {fileValidationErrors.logoFile && <p className={styles.errorMessage}>{fileValidationErrors.logoFile}</p>}
          </div>
        </div>

        {/* 약관 동의 영역 */}
        <div className={styles.formGroup}>
          <JoinDetail agreements={agreements} onAgreementChange={handleAgreementChange} />
        </div>

        <div className={styles.buttonContainer}>
          <Button
            variant="primary"
            onClick={handleSubmitJoin}
            disabled={
              loading ||
              !isDomainChecked ||
              isDomainDuplicated ||
              Object.values(validationErrors).some((e) => e) ||
              !hasBsnsFile
            }
          >
            가입 신청
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
};

export default JoinPage;
