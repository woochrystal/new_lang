/**
 * @fileoverview 프로젝트관리 등록/수정 폼 컴포넌트
 * @description 프로젝트 등록 및 수정을 위한 폼 컴포넌트
 */

'use client';

import { useState, useEffect, useRef } from 'react';

import { FileInput } from '@/features/aprv';
import { Input, Textarea, Select, Radio, Datepicker, Button, Label, Alert } from '@/shared/component';
import { useAlertStore } from '@/shared/store/alertStore';
import { Emp } from '@/features/groupware/sys/emp/script/entity';

import { api as workApi } from '../script/api';
import { Project } from '../script/entity';
import { WORK_CONSTANTS } from '../script/constants';
import { dateToString, stringToDate } from '../script/utils';

import styles from './Form.module.scss';

/**
 * 프로젝트관리 등록/수정 폼 컴포넌트
 * @param {Object} props
 * @param {'create'|'edit'} props.mode - 폼 모드 (create: 등록, edit: 수정)
 * @param {number} [props.prjId] - 프로젝트 ID (수정 모드일 때 필수)
 * @param {Function} props.onSuccess - 저장 성공 시 콜백
 * @param {Function} props.onCancel - 취소 시 콜백
 */
const ProjectForm = function ({ mode = 'create', prjId, onSuccess, onCancel }) {
  const isEditMode = mode === 'edit';

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    projectName: '',
    status: '영업단계',
    startDate: null,
    endDate: null,
    client: '',
    location: '',
    memo: ''
  });

  // 프로젝트 관리원 (동적 추가/삭제)
  const [members, setMembers] = useState([]);
  const nextMemberId = useRef(0);

  // 파일 첨부 상태
  const [fileState, setFileState] = useState({
    fileId: null,
    existing: [],
    new: [],
    deletedIds: []
  });

  // 직원 목록 상태
  const [employeeList, setEmployeeList] = useState([]);

  // 변경 감지
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // 직원 목록 로드
  useEffect(function () {
    void fetchEmployeeList();
  }, []);

  // 수정 모드일 때 데이터 로드
  useEffect(
    function () {
      if (isEditMode && prjId) {
        void fetchProjectData();
      }
    },
    [isEditMode, prjId]
  );

  // 직원 목록 조회 함수
  const fetchEmployeeList = async function () {
    try {
      const result = await workApi.getEmployeeList();
      if (result && Array.isArray(result)) {
        // API 응답을 Entity로 변환
        const employees = Emp.fromApiList(result);
        setEmployeeList(employees);
      }
    } catch (error) {
      // API 실패 시 빈 배열 유지 (직접 입력 모드로만 사용 가능)
      setEmployeeList([]);
    }
  };

  // 데이터 로드 함수
  const fetchProjectData = async function () {
    const result = await workApi.get(prjId);

    if (result) {
      const project = Project.fromApi(result);

      setFormData({
        projectName: project.projectName,
        status: project.status,
        startDate: stringToDate(project.startDate),
        endDate: stringToDate(project.endDate),
        client: project.client,
        location: project.location,
        memo: project.memo
      });

      // 파일 상태 설정
      if (project.fileId) {
        setFileState((prev) => ({
          ...prev,
          fileId: project.fileId,
          existing: project.fileList || []
        }));
      }

      // 멤버 정보 설정
      if (project.members && project.members.length > 0) {
        const loadedMembers = project.members.map((member, index) => ({
          id: index,
          prjMbrId: member.prjMbrId,
          mbrId: member.mbrId,
          mbrNm: member.mbrNm,
          mbrEmpYn: member.mbrEmpYn || (member.mbrId ? 'Y' : 'N'),
          mbrTask: member.mbrTask || '',
          mbrStaDt: member.mbrStaDt ? stringToDate(member.mbrStaDt) : null,
          mbrEndDt: member.mbrEndDt ? stringToDate(member.mbrEndDt) : null,
          mbrMmnth: member.mbrMmnth || ''
        }));

        setMembers(loadedMembers);
        nextMemberId.current = loadedMembers.length;
      }
    }
  };

  // 폼 입력 변경 핸들러
  const handleChange = function (field) {
    return function (value) {
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }));
      setHasChanges(true);
    };
  };

  // 날짜 변경 핸들러
  const handleDateChange = function (field) {
    return function (date) {
      setFormData((prev) => ({
        ...prev,
        [field]: date
      }));
      setHasChanges(true);
    };
  };

  // 멤버 필드 변경 핸들러
  const handleMemberChange = function (index, field, value) {
    setMembers((prev) =>
      prev.map((member, idx) =>
        idx === index
          ? {
              ...member,
              [field]: value
            }
          : member
      )
    );
    setHasChanges(true);
  };

  // 멤버 추가
  const handleAddMember = function () {
    const newMember = {
      id: nextMemberId.current,
      prjMbrId: null,
      mbrId: null,
      mbrNm: '',
      mbrEmpYn: 'Y',
      mbrTask: '',
      mbrStaDt: null,
      mbrEndDt: null,
      mbrMmnth: ''
    };
    setMembers((prev) => [...prev, newMember]);
    nextMemberId.current += 1;
    setHasChanges(true);
  };

  // 멤버 삭제 (배열에서 완전히 제거)
  const handleRemoveMember = function (index) {
    setMembers((prev) => prev.filter((_, idx) => idx !== index));
    setHasChanges(true);
  };

  // 파일 상태 변경 핸들러 (파일명 길이 검증 포함)
  const handleFileStateChange = function (newFileState) {
    // 새로 추가된 파일들의 파일명 길이 체크 (30자 제한)
    if (newFileState.new && newFileState.new.length > 0) {
      const invalidFiles = newFileState.new.filter((file) => file.name.length > 30);

      if (invalidFiles.length > 0) {
        const { showError } = useAlertStore.getState();
        showError({
          title: '파일명 길이 초과',
          message: `파일명은 최대 30자까지 가능합니다.\n파일명을 변경한 후 다시 시도해주세요.\n파일명: ${invalidFiles.map((f) => `- ${f.name} (${f.name.length}자)`).join('\n')}`
        });
        return; // 상태 업데이트 차단
      }
    }

    setFileState(newFileState);
    setHasChanges(true);
  };

  // 폼 제출
  const handleSubmit = async function (e) {
    e.preventDefault();

    // 유효성 검증
    if (!formData.projectName || !formData.status || !formData.startDate || !formData.client) {
      const { showError } = useAlertStore.getState();
      showError('프로젝트명, 진행단계, 시작일, 고객사명은 필수 항목입니다.');
      return;
    }

    // 프로젝트 시작일/종료일 검증
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      const { showError } = useAlertStore.getState();
      showError('프로젝트 시작일은 종료일보다 이전이어야 합니다.');
      return;
    }

    // 프로젝트 관리원 투입 시작일/종료일 검증
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      if (member.mbrStaDt && member.mbrEndDt && member.mbrStaDt > member.mbrEndDt) {
        const { showError } = useAlertStore.getState();
        showError(`프로젝트 관리원 ${i + 1}번의 투입 시작일은 종료일보다 이전이어야 합니다.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 멤버 데이터 구성 (빈 멤버 제외, mbrEmpYn 제외)
      const memberData = members
        .filter((member) => member.mbrId || member.mbrNm)
        .map((member) => ({
          prjMbrId: member.prjMbrId || null,
          mbrId: member.mbrId,
          mbrNm: member.mbrNm,
          mbrTask: member.mbrTask,
          mbrStaDt: dateToString(member.mbrStaDt),
          mbrEndDt: dateToString(member.mbrEndDt),
          mbrMmnth: member.mbrMmnth || ''
        }));

      // API 요청 데이터 구성
      const requestData = {
        prjNm: formData.projectName,
        prjSt: formData.status,
        prjStaDt: dateToString(formData.startDate),
        prjEndDt: dateToString(formData.endDate),
        prjClient: formData.client,
        prjLoc: formData.location,
        prjMemo: formData.memo,
        fileId: fileState.fileId,
        members: memberData
      };

      // 등록 또는 수정 API 호출 (fileState 전달)
      if (isEditMode) {
        await workApi.update(prjId, requestData, fileState);
      } else {
        await workApi.create(requestData, fileState);
      }

      // 성공 시 알림 표시
      setHasChanges(false);
      setShowSuccessAlert(true);
    } catch (error) {
      const { showError } = useAlertStore.getState();
      showError('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 취소 버튼 클릭
  const handleCancelClick = function () {
    if (hasChanges) {
      const { showConfirm } = useAlertStore.getState();
      showConfirm({
        title: '확인',
        message: '변경사항이 있습니다. 취소하시겠습니까?',
        onConfirm: onCancel,
        variant: 'warning'
      });
    } else {
      onCancel();
    }
  };

  return (
    <>
      {showSuccessAlert && (
        <Alert
          message={`프로젝트가 ${isEditMode ? '수정' : '등록'}되었습니다.`}
          variant="success"
          onClose={() => {
            setShowSuccessAlert(false);
            onSuccess();
          }}
        />
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 프로젝트 기본 정보 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>프로젝트 기본 정보</h3>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Label htmlFor="projectName" required>
                프로젝트명
              </Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleChange('projectName')(e.target.value)}
                placeholder="프로젝트명을 입력해주세요"
                required
                maxLength={50}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Label required>진행단계</Label>
              <Radio
                name="status"
                options={WORK_CONSTANTS.STATUS_OPTIONS.filter((opt) => opt.value !== '')}
                value={formData.status}
                onChange={(value) => handleChange('status')(value)}
                variant="button"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Label htmlFor="startDate" required>
                프로젝트 시작일
              </Label>
              <Datepicker
                id="startDate"
                selected={formData.startDate}
                onChange={handleDateChange('startDate')}
                placeholder="시작일을 선택하세요"
                required
              />
            </div>

            <div className={styles.formField}>
              <Label htmlFor="endDate">프로젝트 종료일</Label>
              <Datepicker
                id="endDate"
                selected={formData.endDate}
                onChange={handleDateChange('endDate')}
                placeholder="종료일을 선택하세요"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Label htmlFor="client" required>
                고객사명
              </Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => handleChange('client')(e.target.value)}
                placeholder="고객사명을 입력해주세요"
                required
                maxLength={50}
              />
            </div>

            <div className={styles.formField}>
              <Label htmlFor="location">프로젝트 장소</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location')(e.target.value)}
                placeholder="장소를 입력해주세요"
                maxLength={50}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formField}>
              <Label htmlFor="memo">주요기술</Label>
              <Textarea
                id="memo"
                value={formData.memo}
                onChange={(e) => handleChange('memo')(e.target.value)}
                placeholder="주요기술을 입력해주세요"
                rows={4}
                maxLength={100}
              />
            </div>
          </div>
        </section>

        {/* 파일 첨부 (선택 사항) */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>파일 첨부</h3>
          <FileInput
            variant="file"
            id="projectFiles"
            label="첨부파일"
            fileState={fileState}
            onChange={handleFileStateChange}
            multiple
          />
        </section>

        {/* 프로젝트 관리원 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>프로젝트 관리원</h3>
            <Button type="button" variant="primary" size="small" onClick={handleAddMember}>
              추가
            </Button>
          </div>

          {members.length === 0 && <div className={styles.emptyMessage}>프로젝트 관리원을 추가해주세요.</div>}

          {members.map((member, index) => (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.memberHeader}>
                <h4>프로젝트 관리원 {index + 1}</h4>
                <Button type="button" variant="danger" size="small" onClick={() => handleRemoveMember(index)}>
                  삭제
                </Button>
              </div>

              {/* 직원여부 */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <Label>직원여부</Label>
                  <Radio
                    name={`member-${index}-empYn`}
                    options={WORK_CONSTANTS.EMPLOYEE_TYPE_OPTIONS}
                    value={member.mbrEmpYn}
                    onChange={(value) => {
                      handleMemberChange(index, 'mbrEmpYn', value);
                      // 직원여부 변경 시 mbrId와 mbrNm 초기화
                      handleMemberChange(index, 'mbrId', null);
                      handleMemberChange(index, 'mbrNm', '');
                    }}
                    variant="button"
                  />
                </div>
              </div>

              {/* 성명 - 직원 셀렉트박스 또는 직접 입력 */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <Label htmlFor={`member-${index}-name`}>성명</Label>
                  {member.mbrEmpYn === 'Y' ? (
                    <Select
                      id={`member-${index}-name`}
                      value={member.mbrId || ''}
                      onChange={(value) => {
                        const selectedEmployee = employeeList.find((emp) => emp.id === Number(value));
                        handleMemberChange(index, 'mbrId', selectedEmployee ? selectedEmployee.id : null);
                        handleMemberChange(index, 'mbrNm', selectedEmployee ? selectedEmployee.name : '');
                      }}
                      options={[
                        { value: '', label: '직원을 선택하세요' },
                        ...employeeList.map((emp) => ({
                          value: emp.id,
                          label: `${emp.name} (${emp.department} - ${emp.position})`
                        }))
                      ]}
                    />
                  ) : (
                    <Input
                      id={`member-${index}-name`}
                      value={member.mbrNm}
                      onChange={(e) => handleMemberChange(index, 'mbrNm', e.target.value)}
                      placeholder="성명을 입력하세요"
                      maxLength={50}
                    />
                  )}
                </div>
              </div>

              {/* 업무구분 */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <Label htmlFor={`member-${index}-task`}>업무구분</Label>
                  <Select
                    id={`member-${index}-task`}
                    value={member.mbrTask}
                    onChange={(value) => handleMemberChange(index, 'mbrTask', value)}
                    options={WORK_CONSTANTS.WORK_DIV_OPTIONS}
                  />
                </div>
              </div>

              {/* 투입기간 */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <Label htmlFor={`member-${index}-staDt`}>투입 시작일</Label>
                  <Datepicker
                    id={`member-${index}-staDt`}
                    selected={member.mbrStaDt}
                    onChange={(date) => handleMemberChange(index, 'mbrStaDt', date)}
                    placeholder="시작일을 선택하세요"
                  />
                </div>

                <div className={styles.formField}>
                  <Label htmlFor={`member-${index}-endDt`}>투입 종료일</Label>
                  <Datepicker
                    id={`member-${index}-endDt`}
                    selected={member.mbrEndDt}
                    onChange={(date) => handleMemberChange(index, 'mbrEndDt', date)}
                    placeholder="종료일을 선택하세요"
                  />
                </div>
              </div>

              {/* 투입개월수 */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <Label htmlFor={`member-${index}-mmnth`}>투입개월수(M/M)</Label>
                  <Input
                    id={`member-${index}-mmnth`}
                    type="text"
                    value={member.mbrMmnth}
                    onChange={(e) => handleMemberChange(index, 'mbrMmnth', e.target.value)}
                    placeholder="투입개월수를 입력하세요 (예: 4.5)"
                    maxLength={5}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 버튼 영역 */}
        <div className={styles.buttonGroup}>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isEditMode ? '수정' : '등록'}
          </Button>
          <Button type="button" variant="secondary" onClick={handleCancelClick} disabled={isSubmitting}>
            취소
          </Button>
        </div>
      </form>
    </>
  );
};

export default ProjectForm;
