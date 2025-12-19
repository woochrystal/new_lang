/**
 * 비용결재현황 상세 페이지 (읽기 전용)
 * @description 비용결재현황에서 조회한 결재 문서의 상세 정보 (읽기 전용)
 * @route /exec/expense/detail?id={결재ID}
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ApprovalDraft, aprvApi, ExpenseDraftForm, ApprovalLineBox, ApprovalInfoField } from '@/features/aprv';
import { ContentLayout, Button, Content, Select } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { APRV_CONSTANTS } from '@/features/aprv';

const ExpenseStatusDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get('id'); // 결재 ID
  const ty = 'EXPN'; // 비용결재로 고정

  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState(null);

  // 초기 데이터 로드 (상세 조회만)
  const fetchInitialData = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 상세 조회 (읽기 전용이므로 empList 불필요)
    const detailResult = await aprvApi.getBoxDetail({ aprvId: id, aprvTy: ty });

    // 상세 조회 결과 처리
    if (detailResult) {
      const detail = ApprovalDraft.fromExpenseDetailApi(detailResult);
      setDetailData(detail);
    } else {
      setDetailData(null);
    }

    setLoading(false);
  };

  // 목록으로 이동
  const handleBackToList = () => {
    router.push(createDynamicPath('/exec/expense'));
  };

  // 최초 마운트 시 초기 데이터 로드
  useEffect(() => {
    void fetchInitialData();
  }, [id]);

  if (loading) {
    return (
      <ContentLayout>
        <ContentLayout.Header
          title="비용결재 상세"
          subtitle="비용결재 문서 상세 정보를 조회합니다"
        ></ContentLayout.Header>
        <Content.Split>
          <Content.Left>
            <div style={{ padding: '40px', textAlign: 'center' }}>로딩 중...</div>
          </Content.Left>
          <Content.Right></Content.Right>
        </Content.Split>
      </ContentLayout>
    );
  }

  if (!detailData) {
    return (
      <ContentLayout>
        <ContentLayout.Header title="비용결재 상세" subtitle="비용결재 문서 상세 정보를 조회합니다">
          <Button variant="secondary" onClick={handleBackToList}>
            목록
          </Button>
        </ContentLayout.Header>
        <Content.Split>
          <Content.Left>
            <p>결재 문서를 찾을 수 없습니다.</p>
          </Content.Left>
          <Content.Right></Content.Right>
        </Content.Split>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <ContentLayout.Header title="비용결재 상세" subtitle="비용결재 문서 상세 정보를 조회합니다">
        <Button variant="secondary" onClick={handleBackToList}>
          목록
        </Button>
      </ContentLayout.Header>

      <Content.Split>
        {/* 왼쪽 영역: 결재선 + 기안정보 */}
        <Content.Left>
          <Content.Body>
            {/* 결재선 (읽기 전용) */}
            <ApprovalLineBox
              approvalLine={detailData.approvalLine || []}
              onAdd={undefined}
              onRemove={undefined}
              disabled={true}
              maxCount={3}
            />

            <Select
              label="결재유형"
              options={APRV_CONSTANTS.APPROVAL_TYPE_OPTIONS.filter((option) => option.value !== 'all')}
              value={ty}
              onChange={() => {}}
              disabled={true}
            />

            <ApprovalInfoField title="문서번호" value={detailData.docNo} />
            <ApprovalInfoField title="기안자" value={detailData.createdBy} />
            <ApprovalInfoField title="기안부서" value={detailData.createdByDept} />
            <ApprovalInfoField title="기안일시" value={detailData.draftDt} />
            <ApprovalInfoField title="진행상태" value={detailData.statusLabel} />
          </Content.Body>
        </Content.Left>

        {/* 오른쪽 영역: 기안 내용 */}
        <Content.Right>
          <Content.RightHeader>
            <h3>기안 내용</h3>
          </Content.RightHeader>
          <Content.Body>
            <ExpenseDraftForm
              data={{
                expnTy: detailData.expnTy,
                expnDt: detailData.expnDt,
                cardNo: detailData.cardNo,
                payAmt: detailData.payAmt,
                expnRsn: detailData.expnRsn,
                fileState: {
                  fileId: detailData.fileId || null,
                  existing: detailData.fileList || [],
                  new: [],
                  deletedIds: []
                }
              }}
              onChange={() => {}}
              disabled={true}
            />
          </Content.Body>
        </Content.Right>
      </Content.Split>
    </ContentLayout>
  );
};

export default ExpenseStatusDetailPage;
