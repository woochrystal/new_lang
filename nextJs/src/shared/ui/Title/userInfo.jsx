import styles from './userInfo.module.scss';
export default function UserInfo({ userInfo }) {
  const { userImg, nickname, username } = userInfo;
  return (
    <div className={styles.userBox}>
      <div className={styles.porfile}>
        <img src="/circle_user.svg" alt="" />
      </div>
      <div className={styles.userName}>
        <span>{nickname}</span>
        <span>({username})</span>
      </div>
    </div>
  );
}
