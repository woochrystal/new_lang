'use client';

import { useRef, useState, useEffect } from 'react';

import { apiClient } from '@/shared/api';
import styles from '@/shared/ui/Tag/nameTag.module.scss';

/**
 * 프로필 카드 컴포넌트 - NameTag 스타일 적용
 * @param {Object} props
 * @param {Object} props.userInfo - 사용자 정보
 * @param {Object} props.profileImageState - 프로필 이미지 상태 { saved, new, deleted }
 * @param {Function} [props.onProfileImageSelect] - 프로필 이미지 선택 핸들러
 */
const ProfileCard = ({ userInfo, profileImageState, onProfileImageSelect }) => {
  const fileInputRef = useRef(null);
  const [savedImageBlobUrl, setSavedImageBlobUrl] = useState(null);

  // 저장된 이미지를 인증된 요청으로 가져와 Blob URL 생성
  useEffect(() => {
    let objectUrl = null;

    const fetchSavedImage = async () => {
      // 새 이미지가 있거나 삭제되었으면 저장된 이미지 fetch 안 함
      if (profileImageState?.new || profileImageState?.deleted) {
        setSavedImageBlobUrl(null);
        return;
      }

      // 저장된 이미지가 있으면 fetch
      if (profileImageState?.saved?.fileDtlId) {
        const fileDtlId = profileImageState.saved.fileDtlId;

        // /download 엔드포인트 사용 (다른 기능들과 동일)
        const { data, error } = await apiClient.get(`/api/common/files/download/${fileDtlId}`, {
          responseType: 'blob',
          _onSuccess: (response) => response.data,
          _onError: () => null
        });

        if (data && !error && data.size > 1) {
          objectUrl = URL.createObjectURL(data);
          setSavedImageBlobUrl(objectUrl);
        } else {
          setSavedImageBlobUrl(null);
        }
      } else {
        setSavedImageBlobUrl(null);
      }
    };

    fetchSavedImage();

    // Cleanup: Blob URL 해제
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [profileImageState?.saved?.fileDtlId, profileImageState?.new, profileImageState?.deleted]);

  // 프로필 이미지 URL 가져오기
  const getProfileImageUrl = () => {
    if (!profileImageState) return null;
    if (profileImageState.deleted) return null;

    // 새 파일 우선
    if (profileImageState.new) {
      return URL.createObjectURL(profileImageState.new);
    }

    // 저장된 파일 (Blob URL)
    if (savedImageBlobUrl) {
      return savedImageBlobUrl;
    }

    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onProfileImageSelect) {
      onProfileImageSelect(file);
    }
  };

  // 부서/직급 표시 텍스트 생성
  const getDepartmentPositionText = () => {
    const parts = [];
    if (userInfo?.departmentName) parts.push(userInfo.departmentName);
    if (userInfo?.positionName) parts.push(userInfo.positionName);
    return parts.join(' ') || '정보 없음';
  };

  if (!userInfo) {
    return (
      <div className={styles.nameTag}>
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className={styles.nameTag} aria-labelledby="user-Profile-Card">
      <div className={styles.nameMain}>
        <div className={styles.teamTit}>
          <h3>{getDepartmentPositionText()}</h3>
          {userInfo.phone && (
            <p>
              연락처 : <a href={`tel:${userInfo.phone.replace(/-/g, '')}`}>{userInfo.phone}</a>
            </p>
          )}
        </div>
        <div className={styles.nameTxt}>
          <h2>
            <span className={styles.nameKr}>{userInfo.name || '이름 없음'}</span>
            {userInfo.englishName && (
              <span className={styles.nameEn}>
                {`(`}
                {userInfo.englishName}
                {`)`}
              </span>
            )}
          </h2>
          {userInfo.email && (
            <p>
              이메일 : <a href={`mailto:${userInfo.email}`}>{userInfo.email}</a>
            </p>
          )}
        </div>
      </div>
      <div className={styles.nameImgWrap}>
        <label style={{ cursor: onProfileImageSelect ? 'pointer' : 'default' }}>
          <div className={styles.nameImg}>
            {getProfileImageUrl() ? (
              <img src={getProfileImageUrl()} alt="프로필" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                {/* <img src="/default-profile.png" alt="기본 프로필 이미지" /> */}
                <path
                  fill="#d9cef2"
                  d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"
                />
              </svg>
            )}
          </div>
          {onProfileImageSelect && (
            <div className={styles.nameImgAdd}>
              <img src="/profileAdd.png" alt="프로필 이미지 추가" />
            </div>
          )}
          {onProfileImageSelect && (
            <input
              ref={fileInputRef}
              type="file"
              name="profileImg"
              id="profileImg"
              aria-label="프로필 이미지 업로드"
              accept="image/*"
              onChange={handleFileChange}
            />
          )}
        </label>
      </div>
    </div>
  );
};

export default ProfileCard;
