// http://localhost:3000/groupware/aprv/draft
'use client';

import { useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { DraftForm } from '@/features/aprv';
import { createDynamicPath } from '@/shared/lib/routing';
import { ContentLayout, Button, Alert } from '@/shared/component';

/**
 * 결재 상신 페이지
 * 결재 문서를 작성하고 상신하는 페이지
 */
const ApprovalDraftPage = () => {
  const router = useRouter();
  const draftFormRef = useRef();
  const [showAlert, setShowAlert] = useState(null);

  const handleSuccess = useCallback(() => {
    // 결재 상신 성공 후 내결재함으로 이동
    router.push(createDynamicPath('/aprv/myBox'));
  }, [router]);

  const handleSubmit = useCallback(async () => {
    if (draftFormRef.current) {
      await draftFormRef.current.submit();
    }
  }, []);

  const handleSaveTemp = useCallback(async () => {
    if (draftFormRef.current) {
      await draftFormRef.current.saveTemp();
    }
  }, []);

  const handleShowAlert = useCallback((alertConfig) => {
    setShowAlert(alertConfig);
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (showAlert?.type === 'confirm' && draftFormRef.current) {
      setShowAlert(null);
      await draftFormRef.current.executeSave(showAlert.aprvSts);
    } else {
      setShowAlert(null);
    }
  }, [showAlert]);

  return (
    <ContentLayout>
      <ContentLayout.Header title="결재 작성" subtitle="결재 문서를 작성하고 상신합니다">
        <Button variant="secondary" onClick={handleSaveTemp}>
          임시저장
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          상신
        </Button>
      </ContentLayout.Header>
      <DraftForm ref={draftFormRef} onShowAlert={handleShowAlert} />

      {/* Alert 모달 */}
      {showAlert && (
        <Alert
          key={`${showAlert.type}-${Date.now()}`}
          title={showAlert.type === 'validation' ? '필수입력' : showAlert.type === 'success' ? '결재상신' : undefined}
          message={showAlert.message}
          variant={showAlert.variant}
          showCloseButton={false}
          // confirm 타입일 때만 cancelText, onConfirm, onCancel 전달 (확인/취소 버튼 모두 표시)
          {...(showAlert.type === 'confirm' && {
            cancelText: '취소',
            onConfirm: handleConfirmAction,
            onCancel: () => setShowAlert(null)
          })}
          // validation, success 타입일 때는 onConfirm 전달하지 않음 (확인 버튼만 표시)
          onClose={() => {
            setShowAlert(null);
            // success일 때는 myBox로 이동
            if (showAlert.type === 'success') {
              handleSuccess();
            }
          }}
        />
      )}
    </ContentLayout>
  );
};

export default ApprovalDraftPage;
