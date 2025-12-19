/*
 * path           : app/groupware/(member)/myInfo
 * fileName       : page.jsx
 * author         : 이승진
 * date           : 25.10.27
 * description    :
 * ===========================================================
 * DATE              AUTHOR        NOTE
 * -----------------------------------------------------------
 * 25.10.27        이승진       최초 생성
 */
'use client';

import { useState, useEffect } from 'react';

import { ContentLayout, Content, Button } from '@/shared/component';
import { useAuth } from '@/shared/auth';
import { useAlertStore } from '@/shared/store';
import {
  ProfileCard,
  InfoFormTop,
  InfoFormBottom,
  FileUpload,
  PasswordResetModal,
  myInfoApi,
  UserInfo,
  validateUserInfo,
  FILE_TYPES,
  FILE_LABELS
} from '@/features/groupware/myInfo';

import styles from './page.module.scss';

const MyInfoPage = () => {
  const { user, loadProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(new UserInfo());
  const [errors, setErrors] = useState({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);

        // 실제 API 호출
        const data = await myInfoApi.get();

        // API 응답이 null인 경우 처리
        if (!data) {
          const { showError } = useAlertStore.getState();
          showError('사용자 정보를 불러올 수 없습니다.');
          return;
        }

        const userInfoInstance = UserInfo.fromApi(data);
        setFormData(userInfoInstance);
      } catch (error) {
        // API 에러는 defaultErrorHandler에서 처리됨
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  // 수정 버튼 클릭 - 검증 후 확인 알림
  const handleUpdate = () => {
    // 유효성 검증 (클래스 인스턴스를 plain object로 변환)
    const plainData = {
      name: formData.name,
      englishName: formData.englishName,
      phone: formData.phone,
      department: formData.department,
      departmentName: formData.departmentName,
      position: formData.position,
      positionName: formData.positionName,
      email: formData.email,
      id: formData.id,
      role: formData.role,
      birthDate: formData.birthDate,
      company: formData.company,
      emergencyContact: formData.emergencyContact,
      education: formData.education,
      address: formData.address,
      roadAddress: formData.roadAddress,
      addressDetail: formData.addressDetail,
      extension: formData.extension,
      joinDate: formData.joinDate,
      leaveDate: formData.leaveDate,
      note: formData.note
    };

    // 입사일/퇴사일 검증
    if (formData.joinDate && formData.leaveDate) {
      const joinDateObj = new Date(formData.joinDate);
      const leaveDateObj = new Date(formData.leaveDate);

      if (joinDateObj > leaveDateObj) {
        const { showError } = useAlertStore.getState();
        showError('입사일은 퇴사일보다 이전이어야 합니다.');
        return;
      }
    }

    const validation = validateUserInfo(plainData);

    // 검증 실패 시 에러 알림 표시
    if (!validation.success) {
      setErrors(validation.errors);

      // 첫 번째 에러 메시지만 알림으로 표시
      const errorKeys = Object.keys(validation.errors || {});
      const firstErrorKey = errorKeys[0];
      const errorMessage = firstErrorKey ? validation.errors[firstErrorKey] : '입력값을 확인해주세요.';

      const { showError } = useAlertStore.getState();
      showError(errorMessage);
      return;
    }

    // 검증 성공 시 확인 알림 표시
    const { showConfirm } = useAlertStore.getState();
    showConfirm({
      title: '정보 수정',
      message: '정보를 수정하시겠습니까?',
      onConfirm: performUpdate,
      variant: 'info'
    });
  };

  // 실제 수정 처리 (검증 완료 후)
  const performUpdate = async () => {
    setLoading(true);

    // FormData 생성 (entity의 toFormData 사용)
    const formDataToSend = formData.toFormData();

    // API 호출
    const { data: updateResult, error: updateError } = await myInfoApi.update(formDataToSend);

    if (updateError) {
      setLoading(false);
      // API 에러는 이미 defaultErrorHandler에서 처리됨
      return;
    }

    // 최신 데이터 다시 로드
    const data = await myInfoApi.get();
    if (data) {
      const updatedUserInfo = UserInfo.fromApi(data);
      setFormData(updatedUserInfo);
    }
    setErrors({});
    setHasChanges(false);

    // 전역 사용자 정보도 업데이트
    await loadProfile();

    setLoading(false);

    // 성공 알림 표시
    const { showSuccess } = useAlertStore.getState();
    showSuccess('정보가 성공적으로 저장되었습니다.');
  };

  // 입력 변경 핸들러
  const handleChange = (field, value) => {
    setFormData((prev) => prev.copyWith({ [field]: value }));
    setHasChanges(true);
    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // 프로필 이미지 선택
  const handleProfileImageSelect = (file) => {
    setFormData((prev) =>
      prev.copyWith({
        profileImage: {
          saved: prev.profileImage.saved,
          new: file,
          deleted: false
        }
      })
    );
    setHasChanges(true);
  };

  // 파일 업로드
  const handleFileUpload = (fileType, file) => {
    // 파일명 길이 체크 (30자 제한)
    if (file.name.length > 30) {
      const { showError } = useAlertStore.getState();
      showError({
        title: '파일명 길이 초과',
        message: `파일명은 최대 30자까지 가능합니다.\n파일명을 변경한 후 다시 시도해주세요.\n파일명: ${file.name} (${file.name.length}자)`
      });
      return;
    }

    setFormData((prev) =>
      prev.copyWith({
        [fileType]: {
          saved: prev[fileType].saved,
          new: file,
          deleted: false
        }
      })
    );
    setHasChanges(true);
  };

  // 파일 삭제
  const handleFileDelete = (fileType) => {
    setFormData((prev) =>
      prev.copyWith({
        [fileType]: {
          saved: prev[fileType].saved,
          new: null,
          deleted: !!prev[fileType].saved
        }
      })
    );
    setHasChanges(true);
  };

  // 비밀번호 재설정 모달 열기
  const handleResetPassword = () => {
    setIsPasswordModalOpen(true);
  };

  // 비밀번호 재설정 모달 닫기
  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  // 비밀번호 변경
  const handleChangePassword = async (passwordData) => {
    try {
      await myInfoApi.changePassword(passwordData);
    } catch (error) {
      // 모달에서 에러를 직접 처리하도록 에러를 다시 throw합니다.
      throw error;
    }
  };

  if (loading && !formData) {
    return (
      <ContentLayout>
        <ContentLayout.Header title="내 정보" subtitle="내 정보를 등록하고 관리할 수 있습니다." />
        <Content.Full>
          <div className={styles.loading}>로딩 중...</div>
        </Content.Full>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <ContentLayout.Header title="내 정보" subtitle="내 정보를 등록하고 관리할 수 있습니다.">
        <Button variant="secondary" onClick={handleResetPassword}>
          비밀번호 초기화
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          수정
        </Button>
      </ContentLayout.Header>

      <Content.Full className={styles.content}>
        <div className={styles.container}>
          {/* 상단: 프로필 카드 + 입력 폼 상단 */}
          <div className={`${styles.topSection} ${styles.sectionLayout}`}>
            <div className={styles.profileSection}>
              <ProfileCard
                userInfo={formData}
                profileImageState={formData.profileImage}
                onProfileImageSelect={handleProfileImageSelect}
              />
            </div>
            <InfoFormTop formData={formData} errors={errors} onChange={handleChange} />
          </div>

          {/* 하단: 파일 업로드 + 입력 폼 하단 */}
          <div className={`${styles.bottomSection} ${styles.sectionLayout}`}>
            <div className={styles.fileSection}>
              <FileUpload
                label={FILE_LABELS[FILE_TYPES.EDUCATION]}
                fileType="educationFile"
                fileState={formData.educationFile}
                onUpload={handleFileUpload}
                onDelete={handleFileDelete}
              />
              <FileUpload
                label={FILE_LABELS[FILE_TYPES.CERTIFICATION]}
                fileType="certificationFile"
                fileState={formData.certificationFile}
                onUpload={handleFileUpload}
                onDelete={handleFileDelete}
              />
              <FileUpload
                label={FILE_LABELS[FILE_TYPES.CAREER]}
                fileType="careerFile"
                fileState={formData.careerFile}
                onUpload={handleFileUpload}
                onDelete={handleFileDelete}
              />
            </div>
            <div className={`${styles.formBottomSection} ${styles.formSection}`}>
              <InfoFormBottom formData={formData} errors={errors} onChange={handleChange} />
            </div>
          </div>
        </div>
      </Content.Full>

      {/* 비밀번호 재설정 모달 */}
      <PasswordResetModal
        isOpen={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        onSubmit={handleChangePassword}
      />
    </ContentLayout>
  );
};

export default MyInfoPage;
