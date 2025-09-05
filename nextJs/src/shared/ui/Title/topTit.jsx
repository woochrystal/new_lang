import LoginOutBtn from '../button/loginOutBtn';
import styles from './topTit.module.scss';
import '@/shared/ui/Button/buttonBasic.scss';

export default function Top() {
  const title = '기업 맞춤형 IT 솔루션, 펜타웨어';
  const nickname = 'islayruth';
  const username = '기은';

  return (
    <div className={styles.topWrap}>
      <p>{title}</p>
      <div className={styles.topRight}>
        <div className={styles.topPorfile}>
          <img src="/circle_user.svg" alt="" />
        </div>
        <div className={styles.topName}>
          <div>
            <span>{nickname}</span>
            <span>({username})</span>
          </div>
          <LoginOutBtn />
        </div>
      </div>
    </div>
  );
}
