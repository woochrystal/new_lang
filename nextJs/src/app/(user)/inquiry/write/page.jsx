/*
 * path           : app/groupware/(member)/inquiry/write
 * fileName       : page.jsx
 * author         : 박재민
 * date           : 25. 11. 5.
 * description    : 문의 작성 페이지
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25. 11. 5.        박재민       최초 생성
 */
'use client';

import { useRouter } from 'next/navigation';

import InquiryForm from '@/features/inquiry/ui/Form';
import { Content, ContentLayout } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';

const InquiryWritePage = () => {
  const router = useRouter();
  const { showSuccess } = useAlertStore();

  const handleSuccess = () => {
    showSuccess('문의가 성공적으로 등록되었습니다.');
    router.push(createDynamicPath('/inquiry'));
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <ContentLayout>
      <ContentLayout.Header title="문의하기" subtitle="궁금한 점을 문의하시면 답변해드립니다." />
      <Content.Full>
        <InquiryForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </Content.Full>
    </ContentLayout>
  );
};

export default InquiryWritePage;
