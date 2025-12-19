/**
 * @fileoverview 프로젝트관리 수정 페이지
 * @description 기존 프로젝트 정보 수정
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Form } from '@/features/groupware/task/work';
import { Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib/routing';

const TaskWorkEditPage = function () {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const handleSuccess = function () {
    router.push(createDynamicPath('/task/work'));
  };

  const handleCancel = function () {
    router.back();
  };

  if (!id) {
    return (
      <ContentLayout>
        <Content.Full>
          <div className="flex items-center justify-center p-10 text-gray-500">프로젝트 ID가 필요합니다.</div>
        </Content.Full>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <ContentLayout.Header title="프로젝트 수정" subtitle="프로젝트 정보를 수정합니다" />

      <Content.Full className="flex flex-col gap-4 pt-10">
        <Form mode="edit" prjId={Number(id)} onSuccess={handleSuccess} onCancel={handleCancel} />
      </Content.Full>
    </ContentLayout>
  );
};

export default TaskWorkEditPage;
