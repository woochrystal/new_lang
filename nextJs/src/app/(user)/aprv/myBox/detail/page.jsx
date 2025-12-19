/**
 * 내 결재함 상세 페이지
 * @description 내가 상신한 결재 문서의 상세 정보 조회 및 회수
 * @route /groupware/aprv/myBox/detail?ty={결재유형}&id={결재ID}
 */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  ApprovalDraft,
  ApprovalInfoField,
  ApprovalLineBox,
  ApproverSelectDrawer,
  APRV_CONSTANTS,
  aprvApi,
  ExpenseDraftForm,
  GeneralDraftForm,
  VacationDraftForm,
  validateApprovalForm
} from '@/features/aprv';
import { Alert, Button, Content, ContentLayout, Select } from '@/shared/component';
import { createDynamicPath } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';

const MyBoxDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError } = useAlertStore();

  const ty = searchParams.get('ty'); // 결재 유형 (VCT, GENE, EXPN)
  const id = searchParams.get('id'); // 결재 ID
  const from = searchParams.get('from'); // 이동 경로 (myBox, status 등)

  // const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState(null);
  const [showAlert, setShowAlert] = useState(null);

  // 임시저장 또는 회수 상태일 때만 수정 가능
  const isEditable = detailData?.status === 'TEMP' || detailData?.status === 'WTHD';

  // 결재자 선택 Drawer 관련 상태
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [empSearchList, setEmpSearchList] = useState([]);
  const [empList, setEmpList] = useState([]); // 대무자 목록

  // 휴가 상신 정보 (수정 가능할 때 사용)
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

  // 비용 상신 정보 (수정 가능할 때 사용)
  const [expnDraftInfo, setExpnDraftInfo] = useState({
    expnTy: '-',
    cardNo: '',
    expnDt: new Date(),
    payAmt: 0,
    expnRsn: '',
    fileState: { fileId: null, existing: [], new: [], deletedIds: [] }
  });

  // 일반결재 상신 정보 (수정 가능할 때 사용)
  const [geneDraftInfo, setGeneDraftInfo] = useState({
    tmplCd: '-',
    aprvTitle: '',
    aprvCtt: '',
    fileState: { fileId: null, existing: [], new: [], deletedIds: [] }
  });

  // 목록으로 이동( from 파라미터에 따라 이동 경로 결정)
  const handleBackToList = () => {
    // 업무관리 메뉴에서 온 경우(휴가관리/비용관리)
    if (from === 'task') {
      ty === 'VCT' ? router.push(createDynamicPath('/task/vac')) : router.push(createDynamicPath('/task/expense'));
    } else {
      // 내 결재함 화면에서 온 경우
      router.push(createDynamicPath('/aprv/myBox'));
    }
  };

  // 초기 데이터 로드 (상세 조회 + 대무자 목록)
  const fetchInitialData = async () => {
    if (!id || !ty) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 상세 조회와 대무자 목록 동시 호출 (DraftForm과 동일한 패턴)
    const [detailResult, empListResult] = await Promise.all([
      aprvApi.getBoxDetail({ aprvId: id, aprvTy: ty }),
      aprvApi.getEmployeeList()
    ]);

    // 상세 조회 결과 처리
    if (detailResult) {
      // ty에 따라 적절한 Entity 메서드로 변환
      let detail = null;
      if (ty === 'VCT') {
        detail = ApprovalDraft.fromVacationDetailApi(detailResult);
        // 휴가 결재 상태 초기화

        // 결재 완료 시 마지막 승인자 정보 추출
        let approverNm = null;
        let approverDt = null;
        if (detail.status === 'CMPL' && detail.approvalLine && detail.approvalLine.length > 0) {
          const lastApprover = detail.approvalLine[detail.approvalLine.length - 1];
          approverNm = lastApprover.usrNm;
          approverDt = lastApprover.aprvDtm;
        }

        setVctDraftInfo({
          vacDays: detail.vacDays || 0,
          subId: detail.subId || null,
          vacTy: detail.vacTy || '-',
          vacRsn: detail.vacRsn || '',
          vacStaDt: detail.vacStaDt ? new Date(detail.vacStaDt) : new Date(),
          vacEndDt: detail.vacEndDt ? new Date(detail.vacEndDt) : new Date(),
          emgTel: detail.emgTel || '',
          trfNote: detail.trfNote || '',
          status: detail.status,
          approverNm,
          approverDt
        });
      } else if (ty === 'GENE') {
        detail = ApprovalDraft.fromGeneralDetailApi(detailResult);
        // 일반 결재 상태 초기화
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
        // 비용 결재 상태 초기화
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

    // 대무자 목록 처리 (DraftForm.jsx의 로직 재활용)
    if (empListResult && Array.isArray(empListResult)) {
      const empOptions = empListResult.map((emp) => ({
        label: `${emp.usrNm} (${emp.posNm})`,
        value: emp.usrId
      }));
      setEmpList([{ label: '선택', value: '-' }, ...empOptions]);
    }

    setLoading(false);
  };

  // 최초 마운트 시 초기 데이터 로드
  useEffect(() => {
    void fetchInitialData();
  }, [id, ty]);

  // Alert 확인 액션 (상신)
  const handleConfirmAction = useCallback(async () => {
    setShowAlert(null);

    try {
      let result;
      let validation;

      // 결재선 데이터 (변환 전, validateApprovalForm용)
      const approvalLine = detailData.approvalLine.map((a) => ({
        usrId: a.usrId,
        usrNm: a.usrNm
      }));

      // 결재선 데이터 (변환 후, API 전송용)
      const approversData = detailData.approvalLine.map((a, idx) => ({
        aprvStep: idx + 1,
        aprvUsrId: a.usrId
      }));

      if (ty === 'GENE') {
        // 유효성 검증
        validation = validateApprovalForm(ty, approvalLine, geneDraftInfo);
        if (!validation.isValid) {
          setShowAlert({
            type: 'validation',
            message: validation.firstErrorMessage,
            variant: 'warning'
          });
          return;
        }

        const draftData = {
          aprvTitle: geneDraftInfo.aprvTitle,
          aprvCtt: geneDraftInfo.aprvCtt,
          approvers: approversData,
          aprvSts: 'REQ'
        };

        result = await aprvApi.updateGeneral(Number(id), draftData, geneDraftInfo.fileState);
      } else if (ty === 'VCT') {
        // 유효성 검증
        validation = validateApprovalForm(ty, approvalLine, vctDraftInfo);
        if (!validation.isValid) {
          setShowAlert({
            type: 'validation',
            message: validation.firstErrorMessage,
            variant: 'warning'
          });
          return;
        }

        const draftData = {
          emgTel: vctDraftInfo.emgTel,
          subId: vctDraftInfo.subId,
          vacTy: vctDraftInfo.vacTy,
          vacRsn: vctDraftInfo.vacRsn,
          vacStaDt: vctDraftInfo.vacStaDt,
          vacEndDt: vctDraftInfo.vacEndDt,
          vacDays: vctDraftInfo.vacDays,
          trfNote: vctDraftInfo.trfNote,
          approvers: approversData,
          aprvSts: 'REQ'
        };

        result = await aprvApi.updateVacation(Number(id), draftData);
      } else if (ty === 'EXPN') {
        // 유효성 검증
        validation = validateApprovalForm(ty, approvalLine, expnDraftInfo);
        if (!validation.isValid) {
          setShowAlert({
            type: 'validation',
            message: validation.firstErrorMessage,
            variant: 'warning'
          });
          return;
        }

        const draftData = {
          expnTy: expnDraftInfo.expnTy,
          expnDt: expnDraftInfo.expnDt,
          cardNo: expnDraftInfo.cardNo,
          payAmt: expnDraftInfo.payAmt,
          expnRsn: expnDraftInfo.expnRsn,
          approvers: approversData,
          aprvSts: 'REQ'
        };

        result = await aprvApi.updateExpense(Number(id), draftData, expnDraftInfo.fileState);
      }

      if (result) {
        setShowAlert({
          type: 'success',
          message: '상신되었습니다.',
          variant: 'success'
        });
      }
    } catch (error) {
      showError({
        title: '처리 실패',
        message: '결재 처리 중 오류가 발생했습니다.',
        confirmText: '확인'
      });
    }
  }, [id, ty, detailData, geneDraftInfo, vctDraftInfo, expnDraftInfo, showError]);

  // 회수 확인 액션
  const handleConfirmWithdraw = useCallback(async () => {
    setShowAlert(null);

    const result = await aprvApi.withdraw(id, ty);
    if (result) {
      setShowAlert({
        type: 'success',
        message: '회수되었습니다.',
        variant: 'success'
      });
    }
  }, [id, ty]);

  // 회수 버튼 핸들러
  const handleWithdraw = useCallback(() => {
    setShowAlert({
      type: 'confirm',
      message: '결재를 회수하시겠습니까?',
      variant: 'info',
      actionType: 'withdraw'
    });
  }, []);

  // 상신 버튼 핸들러
  const handleDraft = useCallback(() => {
    setShowAlert({
      type: 'confirm',
      message: '결재를 상신하시겠습니까?',
      variant: 'info',
      actionType: 'submit'
    });
  }, []);

  // 결재자 추가 핸들러
  const handleAddApprover = useCallback(async () => {
    const { showWarning } = useAlertStore.getState();
    if (!detailData || !detailData.approvalLine) return;

    if (detailData.approvalLine.length >= 3) {
      showWarning('최대 3명까지만 결재선에 추가할 수 있습니다.');
      return;
    }

    // 직원 검색 목록 로드
    const empSearchResult = await aprvApi.searchApproverList();
    if (empSearchResult && Array.isArray(empSearchResult)) {
      setEmpSearchList(empSearchResult);
    }

    // 결재자 선택 Drawer 열기
    setIsDrawerOpen(true);
  }, [detailData]);

  // 결재자 삭제 핸들러
  const handleRemoveApprover = useCallback(
    (index) => {
      if (!detailData) return;

      const newApprovalLine = detailData.approvalLine.filter((_, i) => i !== index);

      // order 재정렬
      const reorderedLine = newApprovalLine.map((approver, idx) => ({
        ...approver,
        aprvStep: idx + 1
      }));

      setDetailData({
        ...detailData,
        approvalLine: reorderedLine
      });
    },
    [detailData]
  );

  // 결재자 검색 핸들러
  const handleSearchApprover = useCallback(async (searchQuery) => {
    const empSearchResult = await aprvApi.searchApproverList(searchQuery);
    if (empSearchResult && Array.isArray(empSearchResult)) {
      setEmpSearchList(empSearchResult);
    }
  }, []);

  // 결재자 선택 확인 핸들러
  const handleConfirmApprover = useCallback(
    (approver) => {
      if (!detailData) return;

      // 이미 추가된 결재자인지 확인
      const isAlreadyAdded = detailData.approvalLine.some((item) => item.usrId === approver.usrId);

      if (isAlreadyAdded) {
        const { showWarning } = useAlertStore.getState();
        showWarning('이미 결재선에 추가된 사용자입니다.');
        return;
      }

      // 부서명 찾기 (deptId로 조회)
      const dept = empSearchList.find((node) => node.nodeType === 'DEPT' && node.deptId === approver.deptId);

      // 결재선에 추가
      const newApprover = {
        usrId: approver.usrId,
        usrNm: approver.usrNm,
        deptNm: dept?.deptNm || '-',
        posNm: approver.posNm,
        aprvStep: detailData.approvalLine.length + 1,
        aprvSt: 'REQ',
        aprvStNm: '대기'
      };

      setDetailData({
        ...detailData,
        approvalLine: [...detailData.approvalLine, newApprover]
      });

      // Drawer 닫기
      handleCloseDrawer();
    },
    [detailData, empSearchList]
  );

  // Drawer 닫기
  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setEmpSearchList([]);
  }, []);

  // ty에 따라 우측 컴포넌트 렌더링
  const renderDetailComponent = () => {
    if (!detailData) return null;

    switch (ty) {
      case 'VCT':
        return (
          <VacationDraftForm
            data={
              isEditable
                ? vctDraftInfo
                : {
                    createdBy: detailData.createdBy,
                    vacTy: detailData.vacTy,
                    vacStaDt: detailData.vacStaDt,
                    vacEndDt: detailData.vacEndDt,
                    vacDays: detailData.vacDays,
                    vacRsn: detailData.vacRsn,
                    emgTel: detailData.emgTel,
                    subId: detailData.subId,
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
                  }
            }
            onChange={isEditable ? setVctDraftInfo : () => {}}
            disabled={!isEditable}
            empList={empList}
          />
        );
      case 'GENE':
        return (
          <GeneralDraftForm
            data={
              isEditable
                ? geneDraftInfo
                : {
                    tmplCd: '-',
                    aprvTitle: detailData.aprvTitle,
                    aprvCtt: detailData.aprvCtt,
                    fileState: {
                      fileId: detailData.fileId || null,
                      existing: detailData.fileList || [],
                      new: [],
                      deletedIds: []
                    }
                  }
            }
            onChange={isEditable ? setGeneDraftInfo : () => {}}
            disabled={!isEditable}
          />
        );
      case 'EXPN':
        return (
          <ExpenseDraftForm
            data={
              isEditable
                ? expnDraftInfo
                : {
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
                  }
            }
            onChange={isEditable ? setExpnDraftInfo : () => {}}
            disabled={!isEditable}
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
        {/* 진행중 상태일 때만 회수 버튼 표시 */}
        {detailData.status === 'REQ' && (
          <Button variant="warning" onClick={handleWithdraw}>
            회수
          </Button>
        )}
        {/* 임시저장 또는 회수 상태일 경우 상신 버튼 표시 */}
        {(detailData.status === 'TEMP' || detailData.status === 'WTHD') && (
          <Button variant="primary" onClick={handleDraft}>
            상신
          </Button>
        )}
      </ContentLayout.Header>

      <Content.Split>
        {/* 왼쪽 영역: 결재선 + 기안정보 */}
        <Content.Left>
          <Content.Body>
            {/* 결재선 */}
            <ApprovalLineBox
              approvalLine={detailData.approvalLine || []}
              onAdd={handleAddApprover}
              onRemove={handleRemoveApprover}
              disabled={!isEditable}
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

      {/* Alert 모달 */}
      {showAlert && (
        <Alert
          key={`${showAlert.type}-${Date.now()}`}
          title={showAlert.type === 'validation' ? '필수입력' : showAlert.type === 'success' ? '결재상신' : undefined}
          message={showAlert.message}
          variant={showAlert.variant}
          showCloseButton={false}
          // confirm 타입일 때만 cancelText, onConfirm, onCancel 전달 (확인/취소 버튼 모두 표시)
          {...(showAlert.type === 'confirm' && {
            cancelText: '취소',
            onConfirm: showAlert.actionType === 'withdraw' ? handleConfirmWithdraw : handleConfirmAction,
            onCancel: () => setShowAlert(null)
          })}
          // validation, success 타입일 때는 onConfirm 전달하지 않음 (확인 버튼만 표시)
          onClose={() => {
            setShowAlert(null);
            // success일 때는 myBox로 이동
            if (showAlert.type === 'success') {
              router.push(createDynamicPath('/aprv/myBox'));
            }
          }}
        />
      )}

      {/* 결재자 선택 Drawer */}
      <ApproverSelectDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        empSearchList={empSearchList}
        onConfirm={handleConfirmApprover}
        onSearch={handleSearchApprover}
      />
    </ContentLayout>
  );
};

export default MyBoxDetailPage;
