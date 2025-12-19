/**
 * 결재 현황 상세 페이지 (읽기 전용)
 * @description 결재 현황에서 조회한 결재 문서의 상세 정보 (읽기 전용)
 * @route /aprv/status/detail?ty={결재유형}&id={결재ID}
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  ApprovalDraft,
  aprvApi,
  VacationDraftForm,
  GeneralDraftForm,
  ExpenseDraftForm,
  ApprovalLineBox,
  ApprovalInfoField
} from '@/features/aprv';
import { ContentLayout, Button, Content, Select } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { APRV_CONSTANTS } from '@/features/aprv';

const StatusDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ty = searchParams.get('ty'); // 결재 유형 (VCT, GENE, EXPN)
  const id = searchParams.get('id'); // 결재 ID
  const from = searchParams.get('from'); // 이동 경로 (myBox, status 등)

  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState(null);

  // 초기 데이터 로드 (상세 조회만)
  const fetchInitialData = async () => {
    if (!id || !ty) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 상세 조회 (읽기 전용이므로 empList 불필요)
    const detailResult = await aprvApi.getBoxDetail({ aprvId: id, aprvTy: ty });

    // 상세 조회 결과 처리
    if (detailResult) {
      // ty에 따라 적절한 Entity 메서드로 변환
      let detail = null;
      if (ty === 'VCT') {
        detail = ApprovalDraft.fromVacationDetailApi(detailResult);
      } else if (ty === 'GENE') {
        detail = ApprovalDraft.fromGeneralDetailApi(detailResult);
      } else if (ty === 'EXPN') {
        detail = ApprovalDraft.fromExpenseDetailApi(detailResult);
      }
      setDetailData(detail);
    } else {
      setDetailData(null);
    }

    setLoading(false);
  };

  // 목록으로 이동( from 파라미터에 따라 이동 경로 결정)
  const handleBackToList = () => {
    // 임원업무관리 메뉴에서 온 경우(휴가현황/비용현황)
    if (from === 'exec') {
      ty === 'VCT' ? router.push(createDynamicPath('/exec/vac')) : router.push(createDynamicPath('/exec/expense'));
    } else {
      // 결재현황 화면에서 온 경우
      router.push(createDynamicPath('/aprv/status'));
    }
  };

  // 최초 마운트 시 초기 데이터 로드
  useEffect(() => {
    void fetchInitialData();
  }, [id, ty]);

  // ty에 따라 우측 컴포넌트 렌더링 (읽기 전용)
  const renderDetailComponent = () => {
    if (!detailData) return null;

    switch (ty) {
      case 'VCT':
        return (
          <VacationDraftForm
            data={{
              createdBy: detailData.createdBy,
              vacTy: detailData.vacTy,
              vacStaDt: detailData.vacStaDt,
              vacEndDt: detailData.vacEndDt,
              vacDays: detailData.vacDays,
              vacRsn: detailData.vacRsn,
              emgTel: detailData.emgTel,
              subId: detailData.subNm, // 대무자는 이름만 표시
              trfNote: detailData.trfNote,
              status: detailData.status,
              approverNm:
                detailData.status === 'CMPL' && detailData.approvalLine && detailData.approvalLine.length > 0
                  ? detailData.approvalLine[detailData.approvalLine.length - 1].usrNm
                  : null,
              approverDt:
                detailData.status === 'CMPL' && detailData.approvalLine && detailData.approvalLine.length > 0
                  ? detailData.approvalLine[detailData.approvalLine.length - 1].aprvDtm
                  : null
            }}
            onChange={() => {}}
            disabled={true}
            empList={[]}
          />
        );
      case 'GENE':
        return (
          <GeneralDraftForm
            data={{
              tmplCd: '-',
              aprvTitle: detailData.aprvTitle,
              aprvCtt: detailData.aprvCtt,
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
        );
      case 'EXPN':
        return (
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
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <ContentLayout>
        <ContentLayout.Header title="결재 상세" subtitle="결재 문서 상세 정보를 조회합니다"></ContentLayout.Header>
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
        <ContentLayout.Header title="결재 상세" subtitle="결재 문서 상세 정보를 조회합니다">
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
      <ContentLayout.Header title="결재 상세" subtitle="결재 문서 상세 정보를 조회합니다">
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
          <Content.Body>{renderDetailComponent()}</Content.Body>
        </Content.Right>
      </Content.Split>
    </ContentLayout>
  );
};

export default StatusDetailPage;
