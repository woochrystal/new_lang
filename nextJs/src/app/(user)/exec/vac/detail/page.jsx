/**
 * 휴가결재현황 상세 페이지 (읽기 전용)
 * @description 휴가결재현황에서 조회한 결재 문서의 상세 정보 (읽기 전용)
 * @route /exec/vac/detail?id={결재ID}
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ApprovalDraft, aprvApi, VacationDraftForm, ApprovalLineBox, ApprovalInfoField } from '@/features/aprv';
import { ContentLayout, Button, Content, Select } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { APRV_CONSTANTS } from '@/features/aprv';

const VacationStatusDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get('id'); // 결재 ID
  const ty = 'VCT'; // 휴가결재로 고정

  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState(null);
  const [empList, setEmpList] = useState([]); // 대무자 목록

  // 초기 데이터 로드 (상세 조회 + 대무자 목록)
  const fetchInitialData = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 상세 조회와 대무자 목록 동시 호출
    const [detailResult, empListResult] = await Promise.all([
      aprvApi.getBoxDetail({ aprvId: id, aprvTy: ty }),
      aprvApi.getEmployeeList()
    ]);

    // 상세 조회 결과 처리
    if (detailResult) {
      const detail = ApprovalDraft.fromVacationDetailApi(detailResult);
      setDetailData(detail);
    } else {
      setDetailData(null);
    }

    // 대무자 목록 처리
    if (empListResult && Array.isArray(empListResult)) {
      const empOptions = empListResult.map((emp) => ({
        label: `${emp.usrNm} (${emp.posNm})`,
        value: emp.usrId
      }));
      setEmpList([...empOptions]);
    }

    setLoading(false);
  };

  // 목록으로 이동
  const handleBackToList = () => {
    router.push(createDynamicPath('/exec/vac'));
  };

  // 최초 마운트 시 초기 데이터 로드
  useEffect(() => {
    void fetchInitialData();
  }, [id]);

  if (loading) {
    return (
      <ContentLayout>
        <ContentLayout.Header
          title="휴가결재 상세"
          subtitle="휴가결재 문서 상세 정보를 조회합니다"
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
        <ContentLayout.Header title="휴가결재 상세" subtitle="휴가결재 문서 상세 정보를 조회합니다">
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
      <ContentLayout.Header title="휴가결재 상세" subtitle="휴가결재 문서 상세 정보를 조회합니다">
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
            <VacationDraftForm
              data={{
                createdBy: detailData.createdBy,
                vacTy: detailData.vacTy,
                vacStaDt: detailData.vacStaDt,
                vacEndDt: detailData.vacEndDt,
                vacDays: detailData.vacDays,
                vacRsn: detailData.vacRsn,
                emgTel: detailData.emgTel,
                subId: detailData.subId, // 대무자 ID
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
              empList={empList}
            />
          </Content.Body>
        </Content.Right>
      </Content.Split>
    </ContentLayout>
  );
};

export default VacationStatusDetailPage;
