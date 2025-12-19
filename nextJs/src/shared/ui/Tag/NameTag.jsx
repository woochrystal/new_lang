import React from 'react';
import styles from './nameTag.module.scss';

export default function NameTag() {
  return (
    <div className={styles.nameTag} aria-labelledby="user-Profile-Card">
      <div className={styles.nameMain}>
        <div className={styles.teamTit}>
          <h3>SI 사업부 대리</h3>
          <p>
            연락처 : <a href="tel:01083375093">010-8337-5093</a>
          </p>
        </div>
        <div className={styles.nameTxt}>
          <h2>
            <span className={styles.nameKr}>기은</span>
            <span className={styles.nameEn}>
              {`(`}eun ki{`)`}
            </span>
          </h2>
          <p>
            이메일 : <a href="mailto:islayruth@gmail.com">islayruth@gmail.com</a>
          </p>
        </div>
      </div>
      <div className={styles.nameImgWrap}>
        <label>
          <div className={styles.nameImg}>
            {/* <img src="/fileUploadPlus.svg" alt="기본 프로필 이미지" /> */}
            <img src="/profile_ex01.jpg" alt="예시사진" />
          </div>
          <div className={styles.nameImgAdd}>
            <img src="/profileAdd.png" alt="프로필 이미지 추가" />
          </div>
          <input type="file" name="profileImg" id="profileImg" aria-label="프로필 이미지 업로드" />
        </label>
      </div>
    </div>
  );
}
