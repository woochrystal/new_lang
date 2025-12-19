/*
 * path           : app/groupware/(member)/sys/emp/edit
 * fileName       : page.jsx
 * author         : Claude Code
 * date           : 25.11.13
 * description    : 직원 정보 수정 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.11.13        Claude Code       최초 생성
 */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { EmpForm } from '@/features/groupware/sys/emp';
import { Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib/routing';

const EmpEditPage = function () {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get('id');

  const handleSuccess = function () {
    router.replace(createDynamicPath('/sys/emp'));
  };

  const handleCancel = function () {
    router.replace(createDynamicPath('/sys/emp'));
  };

  if (!id) {
    return (
      <ContentLayout>
        <Content.Full>
          <div className="flex items-center justify-center p-10 text-gray-500">직원 사번이 필요합니다.</div>
        </Content.Full>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <ContentLayout.Header title="직원 정보 수정" subtitle="직원 정보를 수정합니다" />
      <Content.Full className="flex flex-col gap-4 pt-10">
        <EmpForm mode="edit" empNo={id} onSuccess={handleSuccess} onCancel={handleCancel} />
      </Content.Full>
    </ContentLayout>
  );
};

export default EmpEditPage;
