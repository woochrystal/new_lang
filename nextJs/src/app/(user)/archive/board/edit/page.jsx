'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { BoardForm } from '@/features/board';
import { Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';

const BoardEditPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boardId = searchParams.get('id');

  const handleSuccess = (isEdit) => {
    // isEdit이 true일 때만 수정 완료 팝업이 뜨도록 page.jsx에서 처리
    router.push(createDynamicPath(`/archive/board?refresh=${Date.now()}&isEdit=${isEdit}`));
  };

  const handleCancel = () => {
    router.back();
  };

  if (!boardId) {
    return <div>유효하지 않은 게시글 ID입니다.</div>;
  }

  return (
    <ContentLayout>
      <ContentLayout.Header title="게시글 수정" />
      <Content.Full>
        <BoardForm mode="edit" boardId={Number(boardId)} onSuccess={handleSuccess} onCancel={handleCancel} />
      </Content.Full>
    </ContentLayout>
  );
};

export default BoardEditPage;
