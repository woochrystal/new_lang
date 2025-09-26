import React from 'react';
import styles from './userInfo.module.scss';

/**
 * 사용자 정보 컴포넌트
 * @param {Object} props
 * @param {string} [props.userImageSrc='/circle_user.svg'] - 사용자 프로필 이미지 URL
 * @param {string} [props.userImageAlt='사용자 프로필 이미지'] - 프로필 이미지 alt 텍스트
 * @param {string} props.nickname - 사용자 닉네임
 * @param {string} props.username - 사용자명
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.Ref<HTMLDivElement>} [props.ref] - 컨테이너 div에 전달할 ref
 */
export const UserInfo = ({
  userImageSrc = '/circle_user.svg',
  userImageAlt = '사용자 프로필 이미지',
  nickname,
  username,
  className = '',
  ref,
  ...rest
}) => {
  const containerClasses = [styles.userBox, className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={containerClasses} {...rest}>
      <div className={styles.porfile}>
        <img src={userImageSrc} alt={userImageAlt} />
      </div>
      <div className={styles.userName}>
        <span>{nickname}</span>
        <span>({username})</span>
      </div>
    </div>
  );
};

export default UserInfo;
