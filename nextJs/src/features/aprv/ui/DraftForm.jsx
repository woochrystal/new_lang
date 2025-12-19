'use client';

import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

// Shared UI Components
import { Content, Select, Tab } from '@/shared/component';

import { validateApprovalForm } from '@/features/aprv';
import { APRV_CONSTANTS } from '@/features/aprv';
import { aprvApi } from '../script/api';
import { formatDateToLocalDate, parseCurrency } from '../script/utils';
import { useAlertStore } from '@/shared/store';
import { useAuth } from '@/shared/auth';
import ApprovalLineBox from './ApprovalLineBox';
import ApprovalInfoField from './ApprovalInfoField';
import ApproverSelectDrawer from './ApproverSelectDrawer';
import VacationDraftForm from './VacationDraftForm';
import GeneralDraftForm from './GeneralDraftForm';
import ExpenseDraftForm from './ExpenseDraftForm';
import styles from '@/shared/component/layout/layout.module.scss';

/**
 * 결재 기안 작성 폼 컴포넌트
 * @param {Object} props
 * @param {Function} [props.onShowAlert] - Alert 표시 콜백
 */
const DraftForm = forwardRef((props, ref) => {
  const [activeTab, setActiveTab] = useState('tab1');

  const { onShowAlert } = props;

  // 로그인 사용자 정보
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // 결재 유형 및 결재선
  const [aprvTy, setAprvTy] = useState('VCT');
  const [approvalLine, setApprovalLine] = useState([]);

  // 기안일자 표시
  const formattedDraftDate = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Seoul' }).split(' ')[0];

  // 휴가 상신 정보
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

  // 비용 상신 정보
  const [expnDraftInfo, setExpnDraftInfo] = useState({
    expnTy: '-',
    cardNo: '',
    expnDt: new Date(),
    payAmt: 0,
    expnRsn: '',
    fileState: {
      fileId: null,
      existing: [],
      new: [],
      deletedIds: []
    }
  });

  // 일반결재 상신 정보
  const [geneDraftInfo, setGeneDraftInfo] = useState({
    tmplCd: '-',
    aprvTitle: '',
    aprvCtt: '',
    fileState: {
      fileId: null,
      existing: [],
      new: [],
      deletedIds: []
    }
  });

  // 결재자 선택 Drawer 관련 상태
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 초기 데이터 (템플릿 목록, 직원 검색 목록, 대무자 목록)
  const [templates, setTemplates] = useState([]);
  const [empSearchList, setEmpSearchList] = useState([]);
  const [empList, setEmpList] = useState([]);

  // 기안 정보
  const [draftInfo, setDraftInfo] = useState({
    drafterName: '',
    drafterDept: ''
  });

  // 초기 데이터 로드 (템플릿 목록, 마지막 결재선, 대무자 목록)
  const fetchInitialData = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      // 템플릿 목록, 마지막 결재선, 대무자 목록 동시 호출
      const [templateResult, aprvStepResult, empListResult] = await Promise.all([
        aprvApi.getTemplateList(),
        aprvApi.getLastAprvStep(),
        aprvApi.getEmployeeList()
      ]);

      if (templateResult) {
        // 템플릿 데이터를 Select 옵션 형태로 가공
        const templateOptions = templateResult.map((template) => ({
          label: template.tmplTtl,
          value: template.tmplCd,
          tmplCtt: template.tmplCtt
        }));
        setTemplates([{ label: '선택', value: '-' }, ...templateOptions]);
      }

      if (aprvStepResult && Array.isArray(aprvStepResult)) {
        // 마지막 결재선이 있으면 자동으로 설정 (백엔드 형식 → 프론트엔드 형식 변환)
        if (aprvStepResult.length > 0) {
          const convertedApprovalLine = aprvStepResult.map((step, index) => ({
            usrId: step.aprvUsrId, // aprvUsrId → usrId
            usrNm: step.usrNm,
            deptNm: step.deptNm,
            posNm: step.posNm, // posNm
            order: index + 1
          }));
          setApprovalLine(convertedApprovalLine);
        }
      }

      if (empListResult && Array.isArray(empListResult)) {
        // 대무자 목록을 Select 옵션 형태로 가공
        const empOptions = empListResult.map((emp) => ({
          label: `${emp.usrNm} (${emp.posNm})`,
          value: emp.usrId
        }));
        setEmpList([{ label: '선택', value: '-' }, ...empOptions]);
      }

      // 기안 정보 설정
      setDraftInfo({
        drafterName: user?.usrNm || '-',
        drafterDept: user?.deptNm || '-'
      });
    } catch (error) {
      console.error('[DraftForm] 초기 데이터 로딩 실패:', error);
      setLoadError('초기 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 결재선 데이터 변환 (프론트엔드 → 백엔드 형식)
   * @returns {Array} 백엔드 형식의 결재선 [{aprvStep, aprvUsrId}]
   */
  const convertApprovalLine = () => {
    return approvalLine.map((approver, index) => ({
      aprvStep: String(index + 1), // order를 aprvStep으로 변환 (String)
      aprvUsrId: approver.usrId // usrId를 aprvUsrId로 변환
    }));
  };

  /**
   * 실제 결재 저장 처리 (API 호출)
   * @param {string} aprvSts - 결재 상태 ('REQ': 상신, 'TEMP': 임시저장)
   */
  const executeSave = async (aprvSts) => {
    try {
      let result = null;
      const approvers = convertApprovalLine(); // 결재선 데이터 변환

      // 결재 유형별 API 호출
      if (aprvTy === 'GENE') {
        const draftData = {
          approvers,
          aprvTitle: geneDraftInfo.aprvTitle,
          aprvCtt: geneDraftInfo.aprvCtt,
          aprvSts // 결재 상태 추가
        };
        result = await aprvApi.saveGeneral(draftData, geneDraftInfo.fileState);
      } else if (aprvTy === 'VCT') {
        const draftData = {
          approvers,
          emgTel: vctDraftInfo.emgTel,
          subId: vctDraftInfo.subId, // null 또는 number
          vacTy: vctDraftInfo.vacTy,
          vacRsn: vctDraftInfo.vacRsn || '',
          vacStaDt: formatDateToLocalDate(vctDraftInfo.vacStaDt), // Date → YYYY-MM-DD
          vacEndDt: formatDateToLocalDate(vctDraftInfo.vacEndDt), // Date → YYYY-MM-DD
          vacDays: Number(vctDraftInfo.vacDays) || 0,
          trfNote: vctDraftInfo.trfNote || '',
          aprvSts // 결재 상태 추가
        };

        console.log('Vacation Draft Data to be sent:', draftData);
        result = await aprvApi.saveVacation(draftData);
      } else if (aprvTy === 'EXPN') {
        const draftData = {
          approvers,
          expnTy: expnDraftInfo.expnTy,
          expnDt: formatDateToLocalDate(expnDraftInfo.expnDt), // Date → YYYY-MM-DD
          cardNo: expnDraftInfo.cardNo || '',
          payAmt: parseCurrency(expnDraftInfo.payAmt), // 문자열 → 숫자 변환
          expnRsn: expnDraftInfo.expnRsn || '',
          aprvSts // 결재 상태 추가
        };
        result = await aprvApi.saveExpense(draftData, expnDraftInfo.fileState);
      }

      if (result) {
        const successMessage = aprvSts === 'REQ' ? '상신되었습니다.' : '임시저장되었습니다.';
        if (onShowAlert) {
          onShowAlert({
            type: 'success',
            aprvSts,
            message: successMessage,
            variant: 'success'
          });
        }
        return true;
      }
    } catch (error) {
      const errorMessage = aprvSts === 'REQ' ? '상신 중 오류가 발생했습니다.' : '임시저장 중 오류가 발생했습니다.';
      if (onShowAlert) {
        onShowAlert({
          type: 'error',
          message: error?.message || errorMessage,
          variant: 'error'
        });
      }
      return false;
    }

    return false;
  };

  /**
   * 결재 저장 (상신 또는 임시저장)
   * @param {string} aprvSts - 결재 상태 ('REQ': 상신, 'TEMP': 임시저장)
   */
  const handleSubmit = async (aprvSts = 'REQ') => {
    // 결재 타입별 유효성 검증
    let draftInfo = null;
    if (aprvTy === 'GENE') {
      draftInfo = geneDraftInfo;
    } else if (aprvTy === 'VCT') {
      draftInfo = vctDraftInfo;
    } else if (aprvTy === 'EXPN') {
      draftInfo = { ...expnDraftInfo, payAmt: parseCurrency(expnDraftInfo.payAmt) };
    }

    const validation = validateApprovalForm(aprvTy, approvalLine, draftInfo);

    if (!validation.isValid) {
      if (onShowAlert) {
        onShowAlert({
          type: 'validation',
          message: validation.firstErrorMessage || '입력 항목을 확인해주세요.',
          variant: 'warning'
        });
      }
      return false;
    }

    // Confirm 다이얼로그 표시
    const confirmMessage = aprvSts === 'REQ' ? '결재를 상신하시겠습니까?' : '결재를 임시저장하시겠습니까?';
    if (onShowAlert) {
      onShowAlert({
        type: 'confirm',
        aprvSts, // 상신/임시저장 구분
        message: confirmMessage,
        variant: 'info'
      });
    }
  };

  // 외부에서 호출 가능한 메서드 노출
  useImperativeHandle(ref, () => {
    return {
      submit: () => handleSubmit('REQ'), // 상신
      saveTemp: () => handleSubmit('TEMP'), // 임시저장
      executeSave: (aprvSts) => executeSave(aprvSts) // 실제 저장 실행
    };
  });

  // 결재자 추가 - Drawer 열기
  const handleAddApprover = async () => {
    const { showWarning } = useAlertStore.getState();
    if (approvalLine.length >= 3) {
      showWarning('최대 3명까지만 결재선에 추가할 수 있습니다.');
      return;
    }

    // 직원 검색 목록 로드 (drawer 열릴 때는 이름검색 없이 전체목록 검색)
    const empSearchResult = await aprvApi.searchApproverList();
    if (empSearchResult && Array.isArray(empSearchResult)) {
      setEmpSearchList(empSearchResult);
    }

    // 결재자 선택 Drawer 열기
    setIsDrawerOpen(true);
  };

  /**
   * 결재자 검색 핸들러
   * @param {string} searchQuery - 검색어 (빈 문자열이면 전체 조회)
   */
  const handleSearchApprover = async (searchQuery) => {
    // 직원 검색 API 호출
    const empSearchResult = await aprvApi.searchApproverList(searchQuery);
    if (empSearchResult && Array.isArray(empSearchResult)) {
      setEmpSearchList(empSearchResult);
    }
  };

  /**
   * 결재자 선택 확인 핸들러
   * @param {Object} approver - 선택된 결재자 정보 (usrId, usrNm, deptId, positionNm, nodeType)
   */
  const handleConfirmApprover = (approver) => {
    // 이미 추가된 결재자인지 확인
    const isAlreadyAdded = approvalLine.some((item) => item.usrId === approver.usrId);

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
      order: approvalLine.length + 1
    };

    setApprovalLine([...approvalLine, newApprover]);

    // Drawer 닫기 (검색 목록도 함께 초기화)
    handleCloseDrawer();
  };

  // Drawer 닫기
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // 직원 검색 목록 초기화
    setEmpSearchList([]);
  };

  // 결재자 삭제
  const handleRemoveApprover = (index) => {
    const newApprovalLine = approvalLine.filter((_, i) => i !== index);

    // order 재정렬
    const reorderedLine = newApprovalLine.map((approver, idx) => ({
      ...approver,
      order: idx + 1
    }));

    setApprovalLine(reorderedLine);
  };

  // 템플릿 선택 핸들러
  const handleTemplateChange = (tmCd) => {
    // 선택된 템플릿 찾기
    const selectedTemplate = templates.find((template) => template.value === tmCd);

    // 템플릿의 HTML 내용을 에디터에 로드
    if (selectedTemplate && selectedTemplate.tmplCtt) {
      setGeneDraftInfo((prev) => ({
        ...prev,
        tmplCd: tmCd,
        aprvCtt: selectedTemplate.tmplCtt || ''
      }));
    } else {
      // 선택 해제 시 (value: '-') 에디터 초기화
      setGeneDraftInfo((prev) => ({
        ...prev,
        tmplCd: '-',
        aprvCtt: ''
      }));
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    void fetchInitialData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        {/* 에러가 있으면 로딩 문구 대신 에러만 보여주어 사용자가 멈춘 상태임을 바로 알 수 있게 함 */}
        {loadError ? <p>{loadError}</p> : <div>로딩 중...</div>}
      </div>
    );
  }

  return (
    <>
      <Content.Split>
        {/* 왼쪽 영역: 결재선 + 기안정보 */}
        <Content.Left>
          <Content.Body>
            {/* 결재선 */}
            <ApprovalLineBox
              approvalLine={approvalLine}
              onAdd={handleAddApprover}
              onRemove={handleRemoveApprover}
              maxCount={3}
            />

            <Select
              label="결재유형"
              options={APRV_CONSTANTS.APPROVAL_TYPE_OPTIONS.filter((option) => option.value !== 'all')}
              value={aprvTy}
              onChange={(value) => setAprvTy(value)}
            />
            {/* 일반결재일때만 템플릿 유형 선택 영역 표시 */}
            {aprvTy === 'GENE' && (
              <Select
                label={'템플릿 유형'}
                options={templates}
                value={geneDraftInfo.tmplCd}
                onChange={handleTemplateChange}
              />
            )}
            {/*<ApprovalInfoField title="문서번호" value={draftInfo.docNo} />*/}

            <ApprovalInfoField title="기안자" value={draftInfo.drafterName} />
            <ApprovalInfoField title="기안부서" value={draftInfo.drafterDept} />
            <ApprovalInfoField title="기안일시" value={formattedDraftDate} />
          </Content.Body>
        </Content.Left>

        {/* 오른쪽 영역: 기안 내용 */}
        {/* 흰 배경 안들어가면 className={styles.roundedLgWrapNobg} 추가 */}
        <Content.Right className={styles.roundedLgWrapNobg}>
          <Content.RightHeader>
            {/* <h3>기안 내용</h3> */}
            <Tab tabs={[{ label: '기안 내용', value: 'tab1' }]} value={activeTab} />
          </Content.RightHeader>
          <Content.Body>
            {/* 결재 유형별 동적 렌더링 */}
            {aprvTy === 'VCT' && (
              <VacationDraftForm
                key="VCT"
                data={vctDraftInfo}
                onChange={setVctDraftInfo}
                user={user}
                empList={empList}
              />
            )}
            {aprvTy === 'GENE' && (
              <GeneralDraftForm key="GENE" data={geneDraftInfo} onChange={setGeneDraftInfo} user={user} />
            )}
            {aprvTy === 'EXPN' && (
              <ExpenseDraftForm key="EXPN" data={expnDraftInfo} onChange={setExpnDraftInfo} user={user} />
            )}
          </Content.Body>
        </Content.Right>
      </Content.Split>

      {/* 결재자 선택 Drawer */}
      <ApproverSelectDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        empSearchList={empSearchList}
        onConfirm={handleConfirmApprover}
        onSearch={handleSearchApprover}
      />
    </>
  );
});

export default DraftForm;
