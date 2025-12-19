/**
 * 결재진행함 상세 페이지
 * @description 내가 결재해야 하는 문서의 상세 정보 조회 및 승인/반려
 * @route /groupware/aprv/pendingBox/detail?ty={결재유형}&id={결재ID}
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  ApprovalDraft,
  aprvApi,
  VacationDraftForm,
  GeneralDraftForm,
  ExpenseDraftForm,
  ApprovalLineBox,
  ApprovalInfoField,
  ApprovalCommentModal
} from '@/features/aprv';
import { ContentLayout, Button, Alert, Content, Select } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { APRV_CONSTANTS } from '@/features/aprv';
import { useAuth } from '@/shared/auth';

const PendingBoxDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 로그인 사용자 정보
  const { user } = useAuth();
  console.log('user', user);

  const ty = searchParams.get('ty'); // 결재 유형 (VCT, GENE, EXPN)
  const id = searchParams.get('id'); // 결재 ID

  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'approve' | 'reject'
    isSubmitting: false
  });
  const [showAlert, setShowAlert] = useState(null);

  // 휴가 상신 정보 (읽기 전용)
  const [vctDraftInfo, setVctDraftInfo] = useState({
    vacDays: 0,
    subId: null,
    vacTy: '-',
    vacRsn: '',
    vacStaDt: new Date(),
    vacEndDt: new Date(),
    emgTel: '',
    trfNote: ''
  });

  // 비용 상신 정보 (읽기 전용)
  const [expnDraftInfo, setExpnDraftInfo] = useState({
    expnTy: '-',
    cardNo: '',
    expnDt: new Date(),
    payAmt: 0,
    expnRsn: '',
    fileState: { fileId: null, existing: [], new: [], deletedIds: [] }
  });

  // 일반결재 상신 정보 (읽기 전용)
  const [geneDraftInfo, setGeneDraftInfo] = useState({
    tmplCd: '-',
    aprvTitle: '',
    aprvCtt: '',
    fileState: { fileId: null, existing: [], new: [], deletedIds: [] }
  });

  // 상세 조회
  const fetchInitialData = async () => {
    if (!id || !ty) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const detailResult = await aprvApi.getBoxDetail({ aprvId: id, aprvTy: ty });
    console.log('상세 조회 결과:', detailResult);
    // 상세 조회 결과 처리
    if (detailResult) {
      // ty에 따라 적절한 Entity 메서드로 변환
      let detail = null;
      if (ty === 'VCT') {
        detail = ApprovalDraft.fromVacationDetailApi(detailResult);

        // 휴가 결재 상태 초기화 (읽기 전용)
        setVctDraftInfo({
          vacDays: detail.vacDays || 0,
          subId: detail.subId || null,
          vacTy: detail.vacTy || '-',
          vacRsn: detail.vacRsn || '',
          vacStaDt: detail.vacStaDt ? new Date(detail.vacStaDt) : new Date(),
          vacEndDt: detail.vacEndDt ? new Date(detail.vacEndDt) : new Date(),
          emgTel: detail.emgTel || '',
          trfNote: detail.trfNote || ''
        });
      } else if (ty === 'GENE') {
        detail = ApprovalDraft.fromGeneralDetailApi(detailResult);
        // 일반 결재 상태 초기화 (읽기 전용)
        setGeneDraftInfo({
          tmplCd: '-',
          aprvTitle: detail.aprvTitle || '',
          aprvCtt: detail.aprvCtt || '',
          fileState: {
            fileId: detail.fileId || null,
            existing: detail.fileList || [],
            new: [],
            deletedIds: []
          }
        });
      } else if (ty === 'EXPN') {
        detail = ApprovalDraft.fromExpenseDetailApi(detailResult);
        // 비용 결재 상태 초기화 (읽기 전용)
        setExpnDraftInfo({
          expnTy: detail.expnTy || '-',
          cardNo: detail.cardNo || '',
          expnDt: detail.expnDt ? new Date(detail.expnDt) : new Date(),
          payAmt: detail.payAmt || 0,
          expnRsn: detail.expnRsn || '',
          fileState: {
            fileId: detail.fileId || null,
            existing: detail.fileList || [],
            new: [],
            deletedIds: []
          }
        });
      }
      setDetailData(detail);
    } else {
      setDetailData(null);
    }

    setLoading(false);
  };

  // 최초 마운트 시 초기 데이터 로드
  useEffect(() => {
    void fetchInitialData();
  }, [id, ty]);

  // 승인 버튼 핸들러
  const handleApprove = useCallback(() => {
    setModalState({
      isOpen: true,
      type: 'approve',
      isSubmitting: false
    });
  }, []);

  // 반려 버튼 핸들러
  const handleReject = useCallback(() => {
    setModalState({
      isOpen: true,
      type: 'reject',
      isSubmitting: false
    });
  }, []);

  // Modal 제출 핸들러
  const handleModalSubmit = useCallback(
    async (comment) => {
      if (!detailData || !user) return;

      setModalState((prev) => ({ ...prev, isSubmitting: true }));

      try {
        // 현재 로그인한 사용자의 결재 단계 찾기
        console.log('detailData.approvalLine', detailData.approvalLine);
        const currentApprover = detailData.approvalLine?.find(
          (approver) => approver.aprvSt === 'REQ' && approver.usrId === user.usrId
        );

        if (!currentApprover) {
          console.error('결재 단계를 찾을 수 없습니다.');
          setModalState((prev) => ({ ...prev, isSubmitting: false }));
          return;
        }

        // 백엔드 UpdateAprvIDT DTO에 맞춰 요청 데이터 구성
        const requestData = {
          aprvId: Number(id),
          aprvTy: ty,
          aprvStep: currentApprover.aprvStep,
          comment: comment || ''
        };

        if (modalState.type === 'approve') {
          // 승인 API 호출
          const result = await aprvApi.approve(requestData);
          if (result) {
            // 모달 닫고 Alert 표시
            setModalState({ isOpen: false, type: null, isSubmitting: false });
            setShowAlert({
              type: 'success',
              message: '승인하였습니다.',
              variant: 'success'
            });
          }
        } else if (modalState.type === 'reject') {
          // 반려 API 호출
          const result = await aprvApi.reject(requestData);
          if (result) {
            // 모달 닫고 Alert 표시
            setModalState({ isOpen: false, type: null, isSubmitting: false });
            setShowAlert({
              type: 'success',
              message: '반려하였습니다.',
              variant: 'success'
            });
          }
        }
      } catch (error) {
        console.error('결재 처리 실패:', error);
        setModalState((prev) => ({ ...prev, isSubmitting: false }));
      }
    },
    [modalState.type, id, ty, detailData, user]
  );

  // Modal 닫기 핸들러
  const handleModalClose = useCallback(() => {
    setModalState({ isOpen: false, type: null, isSubmitting: false });
  }, []);

  // ty에 따라 우측 컴포넌트 렌더링
  const renderDetailComponent = () => {
    if (!detailData) return null;

    switch (ty) {
      case 'VCT':
        return (
          <VacationDraftForm
            data={{
              vacTy: detailData.vacTy,
              vacStaDt: detailData.vacStaDt,
              vacEndDt: detailData.vacEndDt,
              vacDays: detailData.vacDays,
              vacRsn: detailData.vacRsn,
              emgTel: detailData.emgTel,
              subId: detailData.subNm, // 대무자는 이름만 표시
              trfNote: detailData.trfNote
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
          <Button variant="primary" onClick={() => router.push(createDynamicPath('/aprv/pendingBox'))}>
            목록으로
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

  // 현재 사용자가 결재할 차례인지 확인
  // 결재 상태가 'REQ'인 결재자 중 가장 첫 번째 단계(aprvStep이 가장 작은)의 결재자가 현재 로그인한 사용자인지 확인
  const currentStepApprover = detailData.approvalLine
    ?.filter((approver) => approver.aprvSt === 'REQ')
    ?.sort((a, b) => a.aprvStep - b.aprvStep)?.[0];

  const canApprove = currentStepApprover?.usrId === user?.usrId;

  return (
    <ContentLayout>
      <ContentLayout.Header title="결재 상세" subtitle="결재 문서 상세 정보를 조회합니다">
        <Button variant="secondary" onClick={() => router.push(createDynamicPath('/aprv/pendingBox'))}>
          목록
        </Button>
        {/* 현재 로그인한 사용자가 결재할 차례일 때만 승인/반려 버튼 표시 */}
        {canApprove && (
          <>
            <Button variant="warning" onClick={handleReject}>
              반려
            </Button>
            <Button variant="primary" onClick={handleApprove}>
              승인
            </Button>
          </>
        )}
      </ContentLayout.Header>

      <Content.Split>
        {/* 왼쪽 영역: 결재선 + 기안정보 */}
        <Content.Left>
          <Content.Body>
            {/* 결재선 (읽기 전용) */}
            <ApprovalLineBox approvalLine={detailData.approvalLine || []} disabled={true} maxCount={3} />

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

      {/* 승인/반려 의견 입력 모달 */}
      {modalState.isOpen && (
        <ApprovalCommentModal
          isOpen={modalState.isOpen}
          type={modalState.type}
          onSubmit={handleModalSubmit}
          onClose={handleModalClose}
          isSubmitting={modalState.isSubmitting}
        />
      )}

      {/* Alert 모달 */}
      {showAlert && (
        <Alert
          key={`${showAlert.type}-${Date.now()}`}
          title="결재처리"
          message={showAlert.message}
          variant={showAlert.variant}
          showCloseButton={false}
          onClose={() => {
            setShowAlert(null);
            router.push(createDynamicPath('/aprv/pendingBox'));
          }}
        />
      )}
    </ContentLayout>
  );
};

export default PendingBoxDetailPage;
