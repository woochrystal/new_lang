/*
 * path           : app/groupware/(member)/archive/notice/sysadmin/write
 * fileName       : page.jsx
 * author         : 자동 생성
 * date           : 2024-07-29
 * description    : 시스템 공지사항 작성 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 2024-07-29        자동 생성       최초 생성
 */

'use client';

import { useRouter } from 'next/navigation';

import { NoticeForm } from '@/features/notice';
import { Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';

const SysNoticeWritePage = function () {
  const router = useRouter();

  const handleSuccess = function () {
    const { showSuccess } = useAlertStore.getState();
    showSuccess('시스템 공지가 성공적으로 등록되었습니다.');
    router.push(createDynamicPath('/archive/notice/sysadmin'));
  };

  const handleCancel = function () {
    router.back();
  };

  return (
    <ContentLayout>
      <ContentLayout.Header title="새 시스템 공지 작성" />

      <Content.Full className="flex flex-col gap-4 pt-10">
        <NoticeForm mode="create" boardTy="SYSNOTICE" onSuccess={handleSuccess} onCancel={handleCancel} />
      </Content.Full>
    </ContentLayout>
  );
};

export default SysNoticeWritePage;
