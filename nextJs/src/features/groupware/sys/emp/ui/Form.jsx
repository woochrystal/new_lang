/*
 * fileName       : Form.jsx
 * author         : Claude Code (modified)
 * date           : 25.11.13
 * description    : 직원 등록/수정 폼 컴포넌트 (자체 데이터 로딩 및 API 호출)
 */
'use client';

import { useState, useEffect } from 'react';

import { empApi, Emp, EMP_CONSTANTS, formatPhoneNumber } from '@/features/groupware/sys/emp';
import { Input, Select, Button, Label, Datepicker, Loading, Radio, Alert } from '@/shared/component';
import { useAlertStore } from '@/shared/store/alertStore';
import { apiClient } from '@/shared/api';

/**
 * 직원 등록/수정 폼 컴포넌트
 * @param {Object} props
 * @param {'create'|'edit'} props.mode - 폼 모드
 * @param {string} [props.empNo] - 직원 사번 (수정 모드에서 필수)
 * @param {Function} props.onSuccess - 성공 시 콜백
 * @param {Function} props.onCancel - 취소 시 콜백
 */
const EmpForm = function (props) {
  const { mode = 'create', empNo, onSuccess, onCancel } = props;

  const isEditMode = mode === 'edit';

  // 상태 관리
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // 폼 데이터
  const [formData, setFormData] = useState({
    empNo: '',
    name: '',
    usrNmEn: '',
    userId: '',
    email: '',
    department: '',
    position: '',
    role: '',
    phone: '',
    usrEmgTel: '',
    address: '',
    addressDetail: '',
    joinDate: '',
    quitDt: '',
    eduLvl: '',
    birthDt: '',
    note: '',
    workStatus: '미결',
    // 계약구분
    empType: ''
  });

  // 파일 데이터 (saved: 저장된 파일, new: 새 파일, deleted: 삭제 플래그)
  const [fileState, setFileState] = useState({
    usrPicFile: { saved: null, new: null, deleted: false },
    usrProFile: { saved: null, new: null, deleted: false },
    usrCertFile: { saved: null, new: null, deleted: false },
    usrRefFile: { saved: null, new: null, deleted: false }
  });

  // 프로필 이미지 Blob URL (저장된 이미지를 fetch한 후 생성)
  const [profileImageBlobUrl, setProfileImageBlobUrl] = useState(null);

  // 옵션 데이터
  const [options, setOptions] = useState({
    departments: [],
    positions: [],
    roles: [],
    educations: []
  });

  const [errors, setErrors] = useState({});

  // 데이터 로딩 (수정 모드)
  useEffect(
    function () {
      if (isEditMode && empNo) {
        void fetchEmpData();
      }
    },
    [isEditMode, empNo]
  );

  // 옵션 로딩
  useEffect(function () {
    void fetchFormOptions();
  }, []);

  const fetchEmpData = async function () {
    setLoading(true);
    const result = await empApi.get(empNo);

    if (result) {
      const emp = Emp.fromApi(result);
      setFormData({
        empNo: emp.empNo || '',
        name: emp.name || '',
        usrNmEn: emp.usrNmEn || '',
        userId: emp.userId || '',
        email: emp.email || '',
        department: emp.deptId ? String(emp.deptId) : '',
        position: emp.posId ? String(emp.posId) : '',
        role: emp.usrAuth ? String(emp.usrAuth) : '',
        phone: emp.phone || '',
        usrEmgTel: emp.usrEmgTel || '',
        address: emp.address || '',
        addressDetail: emp.addressDetail || '',
        joinDate: emp.joinDate || '',
        quitDt: emp.quitDt || '',
        eduLvl: emp.eduLvl || '',
        birthDt: emp.birthDt || '',
        note: emp.note || '',
        workStatus: emp.empStatus || '미결',
        // 계약구분
        empType: emp.empType || ''
      });

      // 파일 정보 설정
      setFileState({
        usrPicFile: {
          saved: emp.usrPicFile || null,
          new: null,
          deleted: false
        },
        usrProFile: {
          saved: emp.usrProFile || null,
          new: null,
          deleted: false
        },
        usrCertFile: {
          saved: emp.usrCertFile || null,
          new: null,
          deleted: false
        },
        usrRefFile: {
          saved: emp.usrRefFile || null,
          new: null,
          deleted: false
        }
      });
    }

    setLoading(false);
  };

  const fetchFormOptions = async function () {
    const result = await empApi.getFormOptions();
    const rolesData = await empApi.getRoles();

    if (result) {
      setOptions({
        departments: result.departments.map((dept) => ({
          value: String(dept.deptId),
          label: dept.deptNm
        })),
        positions: result.positions.map((pos) => ({
          value: String(pos.posId),
          label: pos.posNm
        })),
        roles: rolesData || [],
        educations: result.educations
          ? result.educations.map((edu) => ({
              value: edu.value,
              label: edu.label
            }))
          : []
      });
    }
  };

  // 저장된 프로필 이미지를 인증된 요청으로 가져와 Blob URL 생성
  useEffect(
    function () {
      let objectUrl = null;

      const fetchProfileImage = async function () {
        // 새 이미지가 있거나 삭제되었으면 저장된 이미지 fetch 안 함
        if (fileState.usrPicFile.new || fileState.usrPicFile.deleted) {
          setProfileImageBlobUrl(null);
          return;
        }

        // 저장된 이미지가 있으면 fetch
        if (fileState.usrPicFile.saved?.fileDtlId) {
          const fileDtlId = fileState.usrPicFile.saved.fileDtlId;

          const { data, error } = await apiClient.get(`/api/common/files/download/${fileDtlId}`, {
            responseType: 'blob',
            _onSuccess: (response) => response.data,
            _onError: () => null
          });

          if (data && !error && data.size > 1) {
            objectUrl = URL.createObjectURL(data);
            setProfileImageBlobUrl(objectUrl);
          } else {
            setProfileImageBlobUrl(null);
          }
        } else {
          setProfileImageBlobUrl(null);
        }
      };

      void fetchProfileImage();

      // Cleanup: Blob URL 해제
      return function () {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    },
    [fileState.usrPicFile.saved?.fileDtlId, fileState.usrPicFile.new, fileState.usrPicFile.deleted]
  );

  // 입사일/퇴사일 변경 시 workStatus 자동 계산
  useEffect(
    function () {
      let calculatedWorkStatus;
      if (formData.quitDt) {
        // 퇴사일이 있으면 "퇴사"
        calculatedWorkStatus = '퇴사';
      } else if (formData.joinDate) {
        // 입사일이 있고 퇴사일이 없으면 "재직"
        calculatedWorkStatus = '재직';
      } else {
        // 입사일이 없으면 "미결"
        calculatedWorkStatus = '미결';
      }

      // workStatus가 변경되었을 때만 업데이트
      if (formData.workStatus !== calculatedWorkStatus) {
        setFormData((prev) => ({
          ...prev,
          workStatus: calculatedWorkStatus
        }));
      }
    },
    [formData.joinDate, formData.quitDt]
  );

  // Input용 핸들러
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
    setHasChanges(true);
  };

  // 전화번호 자동 포맷팅 핸들러
  const handlePhoneChange = (field) => (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      [field]: formatted
    }));
    setHasChanges(true);
  };

  // Select용 핸들러
  const handleSelectChange = (field) => (value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  // DatePicker용 핸들러
  const handleDateChange = (field) => (date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date ? date.toISOString().split('T')[0] : ''
    }));
    setHasChanges(true);
  };

  // File용 핸들러
  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일명 길이 체크 (30자 제한)
      if (file.name.length > 30) {
        const { showError } = useAlertStore.getState();
        showError({
          title: '파일명 길이 초과',
          message: `파일명은 최대 30자까지 가능합니다.\n파일명을 변경한 후 다시 시도해주세요.\n현재 파일명: ${file.name} (${file.name.length}자)`
        });
        e.target.value = null;
        return;
      }

      setFileState((prev) => ({
        ...prev,
        [field]: {
          saved: prev[field].saved, // 저장된 파일 정보 유지
          new: file, // 새 파일 추가
          deleted: false // 삭제 플래그 해제
        }
      }));
      setHasChanges(true);
    }
  };

  // 주소 검색 핸들러
  const handleAddressSearch = function () {
    // 다음 주소 검색 API 로드 및 실행
    const loadAndOpenPostcode = function () {
      if (!window?.daum?.Postcode) {
        // 스크립트 로드
        const script = document.createElement('script');
        script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        script.onload = function () {
          openPostcode();
        };
        script.onerror = function () {
          const { showError } = useAlertStore.getState();
          showError({
            title: '오류',
            message: '주소 검색 서비스를 이용할 수 없습니다.'
          });
        };
        document.head.appendChild(script);
      } else {
        openPostcode();
      }
    };

    const openPostcode = function () {
      new window.daum.Postcode({
        oncomplete: function (data) {
          const address = data.roadAddress || data.address || '';
          setFormData((prev) => ({
            ...prev,
            address: address
          }));
          setHasChanges(true);
        },
        theme: {
          bgColor: '#FFFFFF',
          searchBgColor: '#F8F9FA',
          contentBgColor: '#FFFFFF',
          pageBgColor: '#FFFFFF',
          textColor: '#333333',
          queryTextColor: '#222222',
          postcodeTextColor: '#4A90E2',
          emphTextColor: '#4A90E2',
          outlineColor: '#E0E0E0'
        }
      }).open();
    };

    loadAndOpenPostcode();
  };

  // 프로필 사진 삭제 핸들러
  const handleDeleteProfileImage = function () {
    const currentFile = fileState.usrPicFile;

    setFileState((prev) => ({
      ...prev,
      usrPicFile: {
        saved: currentFile.saved, // saved는 유지 (백엔드 전달용)
        new: null, // new는 제거
        deleted: !!currentFile.saved // saved가 있었으면 삭제 플래그
      }
    }));

    setHasChanges(true);

    // input 요소 초기화 (같은 파일 재선택 가능하도록)
    const fileInput = document.getElementById('profilePicInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // 파일명 표시 헬퍼 (삭제된 것은 표시 안 함)
  const getFileDisplayName = function (fieldName) {
    const file = fileState[fieldName];

    // 삭제된 경우 표시 안 함
    if (file.deleted) {
      return '';
    }

    // 새 파일이 있으면 우선 표시
    if (file.new) {
      return file.new.name;
    }

    // 저장된 파일 표시
    if (file.saved) {
      return file.saved.fileName || file.saved.orgFileNm || '기존 파일';
    }

    return '';
  };

  // 파일 존재 여부 확인
  const hasFile = function (fieldName) {
    const file = fileState[fieldName];
    return !file.deleted && (file.new || file.saved);
  };

  // 프로필 이미지 URL 가져오기
  const getProfileImageUrl = function () {
    const file = fileState.usrPicFile;

    // 삭제된 경우 null
    if (file.deleted) {
      return null;
    }

    // 새 파일이 있으면 미리보기 URL (로컬 파일 객체)
    if (file.new) {
      return URL.createObjectURL(file.new);
    }

    // 저장된 파일 (Blob URL - useEffect에서 fetch한 것)
    if (profileImageBlobUrl) {
      return profileImageBlobUrl;
    }

    return null;
  };

  const handleSubmit = async function (e) {
    e.preventDefault();

    // workStatus 자동 계산
    let calculatedWorkStatus = formData.workStatus;
    if (formData.quitDt) {
      // 퇴사일이 있으면 "퇴사"
      calculatedWorkStatus = '퇴사';
    } else if (formData.joinDate) {
      // 입사일이 있고 퇴사일이 없으면 "재직"
      calculatedWorkStatus = '재직';
    } else {
      // 입사일이 없으면 "미결"
      calculatedWorkStatus = '미결';
    }

    // workStatus 업데이트
    setFormData((prev) => ({
      ...prev,
      workStatus: calculatedWorkStatus
    }));

    // 간단한 유효성 검사
    const newErrors = {};
    if (!formData.empType) newErrors.empType = '계약구분은 필수입니다.';
    if (!formData.empNo) newErrors.empNo = '사번은 필수입니다.';
    if (!formData.name) newErrors.name = '이름은 필수입니다.';
    if (!formData.userId) newErrors.userId = '사용자 ID는 필수입니다.';
    if (!formData.email) newErrors.email = '이메일은 필수입니다.';
    if (!formData.department) newErrors.department = '부서는 필수입니다.';
    if (!formData.position) newErrors.position = '직위는 필수입니다.';
    if (!formData.role) newErrors.role = '역할은 필수입니다.';
    if (!formData.phone) newErrors.phone = '연락처는 필수입니다.';
    if (!formData.joinDate) newErrors.joinDate = '입사일은 필수입니다.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const { showError } = useAlertStore.getState();
      showError({
        title: '입력 오류',
        message: '필수 항목을 모두 입력해주세요.'
      });
      return;
    }

    // 입사일/퇴사일 검증
    if (formData.joinDate && formData.quitDt) {
      const joinDateObj = new Date(formData.joinDate);
      const quitDtObj = new Date(formData.quitDt);

      if (joinDateObj > quitDtObj) {
        const { showError } = useAlertStore.getState();
        showError('입사일은 퇴사일보다 이전이어야 합니다.');
        return;
      }
    }

    setErrors({});
    setSaving(true);

    // FormData 생성
    const formDataToSend = new FormData();

    // 주소를 "주소|상세주소" 형태로 합치기 (myInfo 방식과 동일)
    let composedAddr = '';
    if (formData.address && formData.address.trim() !== '') {
      composedAddr =
        formData.addressDetail && formData.addressDetail.trim() !== ''
          ? `${formData.address}|${formData.addressDetail}`
          : formData.address;
    }

    // 백엔드 DTO에 맞게 데이터 변환
    const empData = {
      empNo: formData.empNo,
      usrNm: formData.name,
      usrNmEn: formData.usrNmEn,
      loginId: formData.userId,
      email: formData.email,
      deptId: formData.department ? Number(formData.department) : null,
      posId: formData.position ? Number(formData.position) : null,
      usrAuth: formData.role,
      usrTel: formData.phone,
      usrEmgTel: formData.usrEmgTel,
      addr: composedAddr,
      joinDt: formData.joinDate || null,
      quitDt: formData.quitDt || null,
      eduLvl: formData.eduLvl,
      birthDt: formData.birthDt,
      note: formData.note,
      empStatus: calculatedWorkStatus,
      empTy: formData.empType
    };

    // JSON 데이터 추가
    formDataToSend.append('empData', new Blob([JSON.stringify(empData)], { type: 'application/json' }));

    // 파일 데이터 추가
    if (fileState.usrPicFile.new) {
      formDataToSend.append('usrPicFile', fileState.usrPicFile.new);
    }
    if (fileState.usrProFile.new) {
      formDataToSend.append('usrProFile', fileState.usrProFile.new);
    }
    if (fileState.usrCertFile.new) {
      formDataToSend.append('usrCertFile', fileState.usrCertFile.new);
    }
    if (fileState.usrRefFile.new) {
      formDataToSend.append('usrRefFile', fileState.usrRefFile.new);
    }

    // 삭제할 파일 목록 전달 (수정 모드일 때만)
    if (isEditMode) {
      const deletedFiles = Object.keys(fileState).filter((key) => {
        const file = fileState[key];
        // 1. 명시적 삭제: deleted: true && saved 있음
        // 2. 파일 교체: saved 있고 new도 있음 (기존 파일 삭제 후 새 파일 업로드)
        return (file.deleted && file.saved) || (file.saved && file.new);
      });

      if (deletedFiles.length > 0) {
        formDataToSend.append('deletedFiles', new Blob([JSON.stringify(deletedFiles)], { type: 'application/json' }));
      }
    }

    const result = isEditMode ? await empApi.update(empNo, formDataToSend) : await empApi.create(formDataToSend);

    setSaving(false);

    if (result !== null && result !== undefined) {
      setHasChanges(false);
      setShowSuccessAlert(true);
    }
  };

  const handleCancelClick = function () {
    if (hasChanges) {
      const { showConfirm } = useAlertStore.getState();
      showConfirm({
        title: mode === 'create' ? '등록 취소' : '수정 취소',
        message: '작성 중인 내용이 있습니다. 정말로 취소하시겠습니까?',
        onConfirm: function () {
          if (onCancel) {
            onCancel();
          }
        },
        variant: 'warning',
        confirmText: '취소',
        cancelText: '계속 작성'
      });
    } else {
      if (onCancel) {
        onCancel();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loading message="직원 정보를 불러오는 중..." />
      </div>
    );
  }

  // 계약구분 옵션 (등록/수정 폼에서는 '전체' 옵션 제외)
  const empTypeOptions = EMP_CONSTANTS.EMP_TYPE_OPTIONS.filter((opt) => opt.value !== '');

  return (
    <>
      {showSuccessAlert && (
        <Alert
          message={`직원 정보가 ${isEditMode ? '수정' : '등록'}되었습니다.`}
          variant="success"
          onClose={() => {
            setShowSuccessAlert(false);
            onSuccess();
          }}
        />
      )}
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit}>
          {/* ============================================ */}
          {/* 프로필 영역 */}
          {/* ============================================ */}
          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 mb-4 pb-4 border-b border-gray-200">
            {/* 프로필 사진 */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                {getProfileImageUrl() ? (
                  <img src={getProfileImageUrl()} alt="프로필" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="file"
                  id="profilePicInput"
                  onChange={handleFileChange('usrPicFile')}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById('profilePicInput').click()}
                >
                  첨부
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleDeleteProfileImage}
                  disabled={!hasFile('usrPicFile')}
                >
                  삭제
                </Button>
              </div>
            </div>

            {/* 프로필 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <Label>계약구분 *</Label>
                <Radio
                  name="empType"
                  options={empTypeOptions}
                  value={formData.empType}
                  onChange={handleSelectChange('empType')}
                  variant="button"
                />
                {errors.empType && <span className="text-red-600 text-xs">{errors.empType}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="name">성명 *</Label>
                <Input id="name" value={formData.name} onChange={handleChange('name')} required />
                {errors.name && <span className="text-red-600 text-xs">{errors.name}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="usrNmEn">성명(영문)</Label>
                <Input
                  id="usrNmEn"
                  value={formData.usrNmEn}
                  onChange={handleChange('usrNmEn')}
                  placeholder="성명(영문)을 입력하세요"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <Label htmlFor="role">회원권한 *</Label>
                <Select
                  id="role"
                  value={formData.role}
                  onChange={handleSelectChange('role')}
                  options={options.roles}
                  placeholder="회원권한을 선택하세요"
                  required
                />
                {errors.role && <span className="text-red-600 text-xs">{errors.role}</span>}
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* 기본정보 섹션 */}
          {/* ============================================ */}
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="userId">ID *</Label>
                <Input
                  id="userId"
                  value={formData.userId}
                  onChange={handleChange('userId')}
                  placeholder="ID를 입력하세요"
                  required
                  disabled={isEditMode}
                />
                {errors.userId && <span className="text-red-600 text-xs">{errors.userId}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="email">이메일 *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="이메일을 입력하세요"
                  required
                />
                {errors.email && <span className="text-red-600 text-xs">{errors.email}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="phone">연락처 *</Label>
                <Input
                  id="phone"
                  variant="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange('phone')}
                  placeholder="010-1234-5678"
                  maxLength={13}
                  required
                />
                {errors.phone && <span className="text-red-600 text-xs">{errors.phone}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="usrEmgTel">비상 연락처</Label>
                <Input
                  id="usrEmgTel"
                  variant="tel"
                  value={formData.usrEmgTel}
                  onChange={handlePhoneChange('usrEmgTel')}
                  placeholder="010-1234-5678"
                  maxLength={13}
                />
                {errors.usrEmgTel && <span className="text-red-600 text-xs">{errors.usrEmgTel}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <Datepicker
                  id="birthDt"
                  label="생년월일"
                  selected={formData.birthDt ? new Date(formData.birthDt) : null}
                  onChange={handleDateChange('birthDt')}
                  placeholder="생년월일을 선택하세요"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  variant="search"
                  value={formData.address}
                  onChange={handleChange('address')}
                  onSearch={handleAddressSearch}
                  onClear={() => setFormData((prev) => ({ ...prev, address: '' }))}
                  readOnly
                  placeholder="주소를 검색하세요"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="addressDetail">상세주소</Label>
                <Input
                  id="addressDetail"
                  value={formData.addressDetail}
                  onChange={handleChange('addressDetail')}
                  placeholder="상세주소를 입력하세요"
                  maxLength={50}
                />
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* 추가정보 섹션 */}
          {/* ============================================ */}
          <div className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="empNo">사번 *</Label>
                <Input
                  id="empNo"
                  value={formData.empNo}
                  onChange={handleChange('empNo')}
                  placeholder="사번을 입력하세요"
                  required
                  disabled={isEditMode}
                />
                {errors.empNo && <span className="text-red-600 text-xs">{errors.empNo}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="department">부서 *</Label>
                <Select
                  id="department"
                  value={formData.department}
                  onChange={handleSelectChange('department')}
                  options={options.departments}
                  placeholder="부서를 선택하세요"
                  required
                />
                {errors.department && <span className="text-red-600 text-xs">{errors.department}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="position">직급 *</Label>
                <Select
                  id="position"
                  value={formData.position}
                  onChange={handleSelectChange('position')}
                  options={options.positions}
                  placeholder="직급을 선택하세요"
                  required
                />
                {errors.position && <span className="text-red-600 text-xs">{errors.position}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <Datepicker
                  id="joinDate"
                  label="입사일 *"
                  required
                  selected={formData.joinDate ? new Date(formData.joinDate) : null}
                  onChange={handleDateChange('joinDate')}
                  placeholder="입사일을 선택하세요"
                />
                {errors.joinDate && <span className="text-red-600 text-xs">{errors.joinDate}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <Datepicker
                  id="quitDt"
                  label="퇴사일"
                  selected={formData.quitDt ? new Date(formData.quitDt) : null}
                  onChange={handleDateChange('quitDt')}
                  placeholder="퇴사일을 선택하세요"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="eduLvl">최종학력정보</Label>
                <Select
                  id="eduLvl"
                  value={formData.eduLvl}
                  onChange={handleSelectChange('eduLvl')}
                  options={options.educations}
                  placeholder="최종학력정보를 선택하세요"
                />
              </div>

              <div className="flex flex-col gap-1 md:col-span-3">
                <Label htmlFor="note">비고</Label>
                <textarea
                  id="note"
                  value={formData.note}
                  onChange={handleChange('note')}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="비고를 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* 파일 업로드 섹션 */}
          {/* ============================================ */}
          <div className="mb-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3">
                <span className="min-w-[100px] text-sm text-gray-600 font-medium">프로필파일</span>
                <div className="flex-1">
                  <Input value={getFileDisplayName('usrProFile')} placeholder="파일없음" readOnly disabled />
                </div>
                <input type="file" id="usrProFile" onChange={handleFileChange('usrProFile')} className="hidden" />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById('usrProFile').click()}
                >
                  파일선택
                </Button>
                {hasFile('usrProFile') && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const currentFile = fileState.usrProFile;
                      setFileState((prev) => ({
                        ...prev,
                        usrProFile: {
                          saved: currentFile.saved,
                          new: null,
                          deleted: !!currentFile.saved
                        }
                      }));
                      const inputElement = document.getElementById('usrProFile');
                      if (inputElement) inputElement.value = '';
                      setHasChanges(true);
                    }}
                  >
                    삭제
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="min-w-[100px] text-sm text-gray-600 font-medium">자격증빙파일</span>
                <div className="flex-1">
                  <Input value={getFileDisplayName('usrCertFile')} placeholder="파일없음" readOnly disabled />
                </div>
                <input type="file" id="usrCertFile" onChange={handleFileChange('usrCertFile')} className="hidden" />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById('usrCertFile').click()}
                >
                  파일선택
                </Button>
                {hasFile('usrCertFile') && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const currentFile = fileState.usrCertFile;
                      setFileState((prev) => ({
                        ...prev,
                        usrCertFile: {
                          saved: currentFile.saved,
                          new: null,
                          deleted: !!currentFile.saved
                        }
                      }));
                      const inputElement = document.getElementById('usrCertFile');
                      if (inputElement) inputElement.value = '';
                      setHasChanges(true);
                    }}
                  >
                    삭제
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="min-w-[100px] text-sm text-gray-600 font-medium">경력증빙파일</span>
                <div className="flex-1">
                  <Input value={getFileDisplayName('usrRefFile')} placeholder="파일없음" readOnly disabled />
                </div>
                <input type="file" id="usrRefFile" onChange={handleFileChange('usrRefFile')} className="hidden" />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById('usrRefFile').click()}
                >
                  파일선택
                </Button>
                {hasFile('usrRefFile') && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      const currentFile = fileState.usrRefFile;
                      setFileState((prev) => ({
                        ...prev,
                        usrRefFile: {
                          saved: currentFile.saved,
                          new: null,
                          deleted: !!currentFile.saved
                        }
                      }));
                      const inputElement = document.getElementById('usrRefFile');
                      if (inputElement) inputElement.value = '';
                      setHasChanges(true);
                    }}
                  >
                    삭제
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* 하단 버튼 */}
          {/* ============================================ */}
          <div className="flex items-center justify-center gap-3 pt-4 mt-2 border-t border-gray-200">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? '처리 중...' : isEditMode ? '수정' : '등록'}
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancelClick} disabled={saving}>
              취소
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EmpForm;
