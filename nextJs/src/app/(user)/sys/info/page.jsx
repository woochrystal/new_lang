/*
 * path           : app/(user)/sys/info
 * fileName       : page.jsx
 * author         : Park ChangHyeon
 * date           : 25.12.16
 * description    : 회사 정보 조회 및 수정 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.12.16        Park ChangHyeon       최초 생성
 */
'use client';

import { useState, useEffect } from 'react';

import { ContentLayout, Content, Button, Loading } from '@/shared/component';
import { useAlertStore } from '@/shared/store';
import { useApi } from '@/shared/hooks';
import {
  CompanyInfoForm,
  companyInfoApi,
  validateCompanyInfo,
  splitAddress,
  combineAddress,
  createFileState
} from '@/features/groupware/sys/info';

/**
 * 파일 업로드 필터
 */
const FILE_CONSTRAINTS = {
  MAX_NAME_LENGTH: 30,
  ACCEPT_TYPES: '.pdf,.jpg,.jpeg,.png'
};

const CompanyInfoPage = () => {
  const { data: companyInfo, isLoading } = useApi(() => companyInfoApi.get(), []);

  const [formData, setFormData] = useState({
    tenantName: '',
    domainPath: '',
    loginId: '',
    bizRegNo: '',
    mgrNm: '',
    mgrEmail: '',
    mgrTel: '',
    telNo: '',
    addr: '',
    addrDetail: '',
    logoImage: { saved: null, new: null, deleted: false },
    businessLicense: { saved: null, new: null, deleted: false }
  });

  const [errors, setErrors] = useState({});
  const [, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!companyInfo) return;

    const { roadAddress, addressDetail } = splitAddress(companyInfo.addr || '');

    setFormData({
      ...companyInfo,
      addr: roadAddress,
      addrDetail: addressDetail,
      logoImage: createFileState(companyInfo.logoFileDtlId, companyInfo.logoOrgFileNm),
      businessLicense: createFileState(companyInfo.licenseFileDtlId, companyInfo.licenseOrgFileNm)
    });
  }, [companyInfo]);

  const handleUpdate = () => {
    const plainData = {
      tenantName: formData.tenantName,
      bizRegNo: formData.bizRegNo,
      mgrNm: formData.mgrNm,
      mgrEmail: formData.mgrEmail,
      mgrTel: formData.mgrTel,
      telNo: formData.telNo,
      addr: formData.addr,
      addrDetail: formData.addrDetail
    };

    const validation = validateCompanyInfo(plainData);

    // 검증 실패 시 에러 알림 표시
    if (!validation.success) {
      setErrors(validation.errors);

      // 첫 번째 에러 메시지만 알림으로 표시
      const errorKeys = Object.keys(validation.errors || {});
      const firstErrorKey = errorKeys[0];
      const errorMessage = firstErrorKey ? validation.errors[firstErrorKey] : '입력값을 확인해주세요.';

      const { showError } = useAlertStore.getState();
      showError(errorMessage);
      return;
    }

    const { showConfirm } = useAlertStore.getState();
    showConfirm({
      title: '회사 정보 수정',
      message: '회사 정보를 수정하시겠습니까?',
      onConfirm: performUpdate,
      variant: 'info'
    });
  };

  const performUpdate = async () => {
    setIsSaving(true);

    const formDataToSend = new FormData();

    const composedAddr = combineAddress(formData.addr, formData.addrDetail);

    const companyData = {
      tenantName: formData.tenantName,
      domainPath: formData.domainPath,
      loginId: formData.loginId,
      bizRegNo: formData.bizRegNo,
      mgrNm: formData.mgrNm,
      mgrEmail: formData.mgrEmail,
      mgrTel: formData.mgrTel,
      telNo: formData.telNo,
      addr: composedAddr
    };

    formDataToSend.append('companyData', new Blob([JSON.stringify(companyData)], { type: 'application/json' }));

    if (formData.logoImage.new) {
      formDataToSend.append('logoFile', formData.logoImage.new);
    }
    if (formData.businessLicense.new) {
      formDataToSend.append('licenseFile', formData.businessLicense.new);
    }

    const deletedFiles = [];

    if (
      (formData.logoImage.deleted && formData.logoImage.saved) ||
      (formData.logoImage.saved && formData.logoImage.new)
    ) {
      deletedFiles.push('logoFile');
    }
    if (
      (formData.businessLicense.deleted && formData.businessLicense.saved) ||
      (formData.businessLicense.saved && formData.businessLicense.new)
    ) {
      deletedFiles.push('licenseFile');
    }

    if (deletedFiles.length > 0) {
      formDataToSend.append('deletedFiles', new Blob([JSON.stringify(deletedFiles)], { type: 'application/json' }));
    }

    const { error: updateError } = await companyInfoApi.update(formDataToSend);

    if (updateError) {
      setIsSaving(false);
      return;
    }

    const data = await companyInfoApi.get();
    if (data) {
      const { roadAddress, addressDetail } = splitAddress(data.addr || '');

      setFormData({
        ...data,
        addr: roadAddress,
        addrDetail: addressDetail,
        logoImage: createFileState(data.logoFileDtlId, data.logoOrgFileNm),
        businessLicense: createFileState(data.licenseFileDtlId, data.licenseOrgFileNm)
      });
    }
    setErrors({});
    setHasChanges(false);

    setIsSaving(false);

    const { showSuccess } = useAlertStore.getState();
    showSuccess('회사 정보가 성공적으로 저장되었습니다.');
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleFileUpload = (fileType, file) => {
    if (file.name.length > FILE_CONSTRAINTS.MAX_NAME_LENGTH) {
      const { showError } = useAlertStore.getState();
      showError({
        title: '파일명 길이 초과',
        message: `파일명은 최대 ${FILE_CONSTRAINTS.MAX_NAME_LENGTH}자까지 가능합니다.\n파일명을 변경한 후 다시 시도해주세요.\n파일명: ${file.name} (${file.name.length}자)`
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [fileType]: {
        saved: prev[fileType].saved,
        new: file,
        deleted: false
      }
    }));
    setHasChanges(true);
  };

  const handleFileDelete = (fileType) => {
    setFormData((prev) => ({
      ...prev,
      [fileType]: {
        saved: prev[fileType].saved,
        new: null,
        deleted: !!prev[fileType].saved
      }
    }));
    setHasChanges(true);
  };

  return (
    <ContentLayout>
      <ContentLayout.Header title="회사 정보" subtitle="회사 정보를 등록하고 관리할 수 있습니다.">
        <Button variant="primary" onClick={handleUpdate} disabled={isLoading || isSaving}>
          수정
        </Button>
      </ContentLayout.Header>

      <Content.Full>
        {isLoading ? (
          <Loading fullscreen={false} message="회사 정보를 불러오는 중..." />
        ) : (
          <CompanyInfoForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onFileUpload={handleFileUpload}
            onFileDelete={handleFileDelete}
          />
        )}
      </Content.Full>
    </ContentLayout>
  );
};

export default CompanyInfoPage;
