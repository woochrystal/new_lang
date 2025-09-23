import styles from './userInfo.module.scss';
export default function UserInfo({ userInfo }) {
  const { userImg, nickname, username } = userInfo;
  return (
    <div className={styles.userBox}>
      <div className={styles.porfile}>
        <img src="/circle_user.svg" alt="유저기본이미지 임시" />
      </div>
      <div className={styles.userName}>
        <span>{nickname}</span>
        <span>({username})</span>
      </div>
    </div>
  );
}
