/*
 * path           : app/groupware/(member)/archive/notice/admin/edit
 * fileName       : page.jsx
 * author         : 박재민
 * date           : 25. 11. 5.
 * description    : 공지사항 관리 공지사항 수정 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 5.        박재민       최초 생성
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { NoticeForm } from '@/features/notice';
import { Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';

/**
 * 공지사항 수정 페이지 컴포넌트
 * @description 실제 폼 UI와 로직은 NoticeForm 컴포넌트에 위임하고,
 *              이 페이지는 수정 성공/취소 시의 동작만 정의하는 "껍데기" 역할을 합니다.
 */
const NoticeEditPage = function () {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noticeId = searchParams.get('id');

  /**
   * NoticeForm에서 수정이 성공적으로 완료되었을 때 호출되는 콜백 함수입니다.
   */
  const handleSuccess = function () {
    const { showError } = useAlertStore.getState();
    const { showSuccess } = useAlertStore.getState();
    showSuccess('공지사항이 성공적으로 수정되었습니다.');
    router.push(createDynamicPath('/archive/notice/admin'));
  };

  /**
   * NoticeForm에서 '취소' 버튼을 클릭했을 때 호출되는 콜백 함수입니다.
   */
  const handleCancel = function () {
    router.back();
  };

  return (
    <ContentLayout>
      <ContentLayout.Header title="공지사항 수정" />

      <Content.Full className="flex flex-col gap-4 pt-10">
        {/* 실제 폼 UI와 로직을 담당하는 컴포넌트 */}
        <NoticeForm mode="edit" noticeId={Number(noticeId)} onSuccess={handleSuccess} onCancel={handleCancel} />
      </Content.Full>
    </ContentLayout>
  );
};

export default NoticeEditPage;
