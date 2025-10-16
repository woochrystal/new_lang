'use client';

// ============================================================================
// Imports
// ============================================================================
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { BoardForm } from '@/features/example';
import { Alert, Content, RenderGuard } from '@/shared/ui';
import Button from '@/shared/ui/Button/Button';
import Editor from '@/shared/ui/Editor/Editor';
import { EnhancedErrorHandler } from '@/features/example/script/errorHandler';
import { sampleApi } from '@/features/example/script/sampleApi';
import { LoggerFactory } from '@/shared/lib/logger';
import { createDynamicPath } from '@/shared/lib/routing';

import styles from './page.module.scss';

const logger = LoggerFactory.getLogger('BoardEditPage');

// ============================================================================
// Utils / Helpers (순수 함수)
// ============================================================================

const transformBoardData = (result) => ({
  id: result.smpId,
  boardId: result.smpId,
  title: result.title || `게시글 ${result.smpId}`,
  content: result.content || '',
  author: `사용자${result.regId}`,
  viewCount: Math.floor(Math.random() * 100) + 1,
  createdAt: result.regDtm || new Date().toISOString(),
  updatedAt: result.updDtm || result.regDtm || new Date().toISOString(),
  status: result.delYn === 'N' ? 'published' : 'deleted',
  fileId: result.fileId
});

// ============================================================================
// API Methods (API 호출)
// ============================================================================

const createFetchBoardData = (boardId, setAlertConfig, setLoading, setBoardData, setContent) => async () => {
  setLoading(true);
  try {
    const result = await sampleApi.get(boardId);
    const transformedData = transformBoardData(result);

    setBoardData(transformedData);
    setContent(transformedData.content || '');
  } catch (error) {
    const errorInfo = EnhancedErrorHandler.handleApiError(error);
    setAlertConfig({
      isOpen: true,
      title: errorInfo.title,
      message: errorInfo.message,
      variant: 'error'
    });
    setBoardData(null);
  } finally {
    setLoading(false);
  }
};

const createUpdateBoard = (boardId, router, setAlertConfig, setSaving, setHasChanges) => async (formData) => {
  setSaving(true);
  try {
    await sampleApi.update(boardId, {
      title: formData.title,
      content: formData.content
    });

    setHasChanges(false);
    router.push(createDynamicPath(`/example?view=${boardId}`));
  } catch (error) {
    const errorInfo = EnhancedErrorHandler.handleApiError(error);
    setAlertConfig({
      isOpen: true,
      title: errorInfo.title,
      message: errorInfo.message,
      variant: 'error'
    });
  } finally {
    setSaving(false);
  }
};

// ============================================================================
// Event Handlers (이벤트 핸들러)
// ============================================================================

const createCancelHandler = (hasChanges) => () => {
  if (hasChanges) {
    if (window.confirm('수정 중인 내용이 있습니다. 정말로 취소하시겠습니까?')) {
      window.history.back();
    }
  } else {
    window.history.back();
  }
};

// ============================================================================
// Component
// ============================================================================

export default function BoardEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const boardId = Number(id);

  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'error'
  });

  // 핸들러 생성
  const fetchBoardData = createFetchBoardData(boardId, setAlertConfig, setLoading, setBoardData, setContent);
  const handleSave = createUpdateBoard(boardId, router, setAlertConfig, setSaving, setHasChanges);
  const handleCancel = createCancelHandler(hasChanges);
  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // 게시글 데이터 로드
  useEffect(() => {
    if (!boardId) return;
    void fetchBoardData();
  }, [boardId]);

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  if (!boardId) {
    return (
      <>
        <Content.PageHeader title="게시글 수정" subtitle="오류가 발생했습니다" />
        <Content.Full>
          <div>게시글 ID가 필요합니다.</div>
        </Content.Full>
      </>
    );
  }

  return (
    <>
      {/* 페이지 헤더 */}
      <Content.PageHeader
        title="게시글 수정"
        subtitle={boardData?.title ? `"${boardData.title}" 수정하기` : '게시글을 수정하세요'}
      >
        <Button variant="secondary" onClick={handleCancel} disabled={loading || saving}>
          취소
        </Button>
        <RenderGuard requiredPermissions={['board.write']}>
          <Button
            variant="primary"
            onClick={() => boardData && handleSave({ title: boardData.title, content, author: boardData.author })}
            disabled={loading || saving || !boardData?.title?.trim() || !content.trim()}
            loading={saving}
          >
            수정하기
          </Button>
        </RenderGuard>
      </Content.PageHeader>

      {/* 메인 컨텐츠 */}
      <Content.Full className="flex flex-col gap-4 pt-10">
        {/* 게시글 폼 */}
        <BoardForm
          mode="edit"
          boardId={boardId}
          initialData={boardData}
          loading={loading || saving}
          onSave={handleSave}
          content={content}
        />

        {/* 에디터 영역 */}
        {boardData ? (
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
        ) : null}
      </Content.Full>

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
