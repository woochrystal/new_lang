'use client';

import { useRouter } from 'next/navigation';

import { ExampleForm } from '@/features/example';
import { Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';

const BoardWritePage = function () {
  const router = useRouter();

  const handleSuccess = function () {
    router.push(createDynamicPath('/example'));
  };

  const handleCancel = function () {
    router.back();
  };

  return (
    <ContentLayout>
      <ContentLayout.Header title="새 게시글 작성" />

      <Content.Full className="flex flex-col gap-4 pt-10">
        <ExampleForm mode="create" onSuccess={handleSuccess} onCancel={handleCancel} />
      </Content.Full>
    </ContentLayout>
  );
};

export default BoardWritePage;
