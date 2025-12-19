'use client';

import { useRouter } from 'next/navigation';
import { BoardForm } from '@/features/board';
import { Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';

const BoardWritePage = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.push(createDynamicPath('/archive/board'));
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ContentLayout>
      <ContentLayout.Header title="게시글 작성" />
      <Content.Full>
        <BoardForm mode="create" onSuccess={handleSuccess} onCancel={handleCancel} />
      </Content.Full>
    </ContentLayout>
  );
};

export default BoardWritePage;
