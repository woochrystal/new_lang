'use client';

// ============================================================================
// Imports
// ============================================================================
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { BoardForm } from '@/features/example';
import Button from '@/shared/ui/Button/Button';
import Alert from '@/shared/ui/Popup/Alert';
import { RenderGuard } from '@/shared/ui/Guards/RenderGuard';
import Content from '@/shared/ui/Layout/Content';
import Editor from '@/shared/ui/Editor/Editor';
import { EnhancedErrorHandler } from '@/features/example/script/errorHandler';
import { sampleApi } from '@/features/example/script/sampleApi';
import { LoggerFactory } from '@/shared/lib/logger';
import { createDynamicPath } from '@/shared/lib/routing';

import styles from './page.module.scss';

const logger = LoggerFactory.getLogger('BoardWritePage');

// ============================================================================
// API Methods (API 호출)
// ============================================================================

const saveBoard = (router, setAlertConfig, setLoading, setHasChanges) => async (saveData) => {
  setLoading(true);
  try {
    const createdId = await sampleApi.create({
      title: saveData.title,
      content: saveData.content
    });

    logger.info('게시글 생성 성공:', createdId);

    setHasChanges(false);
    router.push(createDynamicPath('/example'));
  } catch (error) {
    const errorInfo = EnhancedErrorHandler.handleApiError(error);
    setAlertConfig({
      isOpen: true,
      title: errorInfo.title,
      message: errorInfo.message,
      variant: 'error'
    });
  } finally {
    setLoading(false);
  }
};

// ============================================================================
// Event Handlers (이벤트 핸들러)
// ============================================================================

const cancelHandler = (hasChanges, setCancelModalOpen) => () => {
  if (hasChanges) {
    setCancelModalOpen(true);
  } else {
    window.history.back();
  }
};

const confirmCancelHandler = (setCancelModalOpen) => () => {
  setCancelModalOpen(false);
  window.history.back();
};

// ============================================================================
// Component
// ============================================================================

export default function BoardWritePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const [formData, setFormData] = useState({ title: '' });
  const [hasChanges, setHasChanges] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'error'
  });

  // 핸들러 생성
  const handleSave = saveBoard(router, setAlertConfig, setLoading, setHasChanges);
  const handleCancel = cancelHandler(hasChanges, setCancelModalOpen);
  const confirmCancel = confirmCancelHandler(setCancelModalOpen);
  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  return (
    <>
      {/* 페이지 헤더 */}
      <Content.PageHeader title="새 게시글 작성" subtitle="게시글을 작성하여 공유하세요">
        <div className={styles.headerActions}>
          <Button variant="secondary" onClick={handleCancel} disabled={loading}>
            취소
          </Button>
          <RenderGuard requiredPermissions={['board.write']}>
            <Button
              variant="primary"
              onClick={() => handleSave({ title: formData.title, content })}
              disabled={loading || !formData.title.trim() || !content.trim()}
              loading={loading}
            >
              작성하기
            </Button>
          </RenderGuard>
        </div>
      </Content.PageHeader>

      {/* 메인 컨텐츠 */}
      <Content.Full className="flex flex-col gap-4 pt-10">
        {/* 게시글 폼 */}
        <BoardForm
          mode="create"
          onSave={handleSave}
          loading={loading}
          content={content}
          initialData={formData}
          onFormDataChange={setFormData}
        />

        {/* 에디터 영역 */}
        <div className={styles.editorSection}>
          <label className={styles.label}>
            내용 <span className={styles.required}>*</span>
          </label>
          <Editor
            content={content}
            onChange={(newContent) => {
              setContent(newContent);
              setHasChanges(true);
            }}
            placeholder="게시글 내용을 마크다운으로 작성하세요"
          />
        </div>
      </Content.Full>

      {/* 취소 확인 모달 */}
      {cancelModalOpen ? (
        <Alert
          title="작성 취소"
          message="작성 중인 내용이 있습니다. 정말로 취소하시겠습니까?"
          confirmText="취소"
          cancelText="계속 작성"
          onConfirm={confirmCancel}
          onCancel={() => setCancelModalOpen(false)}
          variant="warning"
        />
      ) : null}

      {/* 에러 Alert */}
      {alertConfig.isOpen ? (
        <Alert
          title={alertConfig.title}
          message={alertConfig.message}
          variant={alertConfig.variant}
          onClose={closeAlert}
        />
      ) : null}
    </>
  );
}
