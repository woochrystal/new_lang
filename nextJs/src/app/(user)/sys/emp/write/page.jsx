/*
 * path           : app/groupware/(member)/sys/emp/write
 * fileName       : page.jsx
 * author         : Claude Code
 * date           : 25.11.13
 * description    : 직원 등록 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.11.13        Claude Code       최초 생성
 */
'use client';

import { useRouter } from 'next/navigation';

import { EmpForm } from '@/features/groupware/sys/emp';
import { Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib/routing';

const EmpWritePage = function () {
  const router = useRouter();

  const handleSuccess = function () {
    router.replace(createDynamicPath('/sys/emp'));
  };

  const handleCancel = function () {
    router.replace(createDynamicPath('/sys/emp'));
  };

  return (
    <ContentLayout>
      <ContentLayout.Header title="직원 등록" subtitle="새로운 직원 정보를 등록합니다" />
      <Content.Full className="flex flex-col gap-4 pt-10">
        <EmpForm mode="create" onSuccess={handleSuccess} onCancel={handleCancel} />
      </Content.Full>
    </ContentLayout>
  );
};

export default EmpWritePage;
