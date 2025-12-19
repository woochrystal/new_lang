'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { ExampleForm } from '@/features/example';
import { Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';

const BoardEditPage = function () {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');
  const boardId = id ? Number(id) : null;

  const handleSuccess = function () {
    if (boardId) {
      router.push(createDynamicPath(`/example?view=${boardId}`));
    } else {
      router.push(createDynamicPath('/example'));
    }
  };

  const handleCancel = function () {
    router.back();
  };

  // boardId가 없으면 에러 표시
  if (!boardId) {
    return (
      <ContentLayout>
        <Content.Full>
          <div>게시글 ID가 필요합니다.</div>
        </Content.Full>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <ContentLayout.Header title="게시글 수정" />

      <Content.Full className="flex flex-col gap-4 pt-10">
        <ExampleForm mode="edit" boardId={boardId} onSuccess={handleSuccess} onCancel={handleCancel} />
      </Content.Full>
    </ContentLayout>
  );
};

export default BoardEditPage;
