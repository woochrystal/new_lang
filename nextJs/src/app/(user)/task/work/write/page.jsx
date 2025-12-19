/**
 * @fileoverview 프로젝트관리 등록 페이지
 * @description 새로운 프로젝트 등록
 */

'use client';

import { useRouter } from 'next/navigation';

import { Form } from '@/features/groupware/task/work';
import { Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib/routing';

const TaskWorkWritePage = function () {
  const router = useRouter();

  const handleSuccess = function () {
    router.push(createDynamicPath('/task/work'));
  };

  const handleCancel = function () {
    router.back();
  };

  return (
    <ContentLayout>
      <ContentLayout.Header title="프로젝트 등록" subtitle="새로운 프로젝트를 등록합니다" />

      <Content.Full className="flex flex-col gap-4 pt-10">
        <Form mode="create" onSuccess={handleSuccess} onCancel={handleCancel} />
      </Content.Full>
    </ContentLayout>
  );
};

export default TaskWorkWritePage;
