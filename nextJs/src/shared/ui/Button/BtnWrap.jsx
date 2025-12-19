// className명 정리
// 'BtnWrap' : 페이지명과 함께 사용하는 상단 버튼 <Wrapper className={'txtBtnWrap'}> 클래스명 필수
// 'BtnTitOnly' : 페이지명 이 버튼만 상단 우측 단독으로 사용하는 wrapper
// 'BtnGroup' : 위치 상관없이 단순 버튼 wrapper (gap :8px)

import styles from '@/shared/ui/Button/buttonBasic.module.scss';

export default function BtnWrap({ className }) {
  return (
    <div className={`${styles.btnWrapsStyle} ${styles[className]}`}>
      <button className={`${styles.btnBasic} ${styles.secondBtn}`}>{'보조기능버튼'}</button>
      <button className={`${styles.btnBasic} ${styles.secondBtn}`}>{'보조기능버튼'}</button>
    </div>
  );
}
