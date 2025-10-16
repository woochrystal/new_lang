// className명 정리
// 'BtnWrap' : txtBtnWrap.jsx PageTit.jsx와 함께 사용하는 상단 버튼 wrapper
// 'BtnTitOnly' : 페이지명 없을 경우 단독으로 사용하는 상단 버튼 wrapper
// 'BtnGroup' : 단순 버튼 wrapper (gap :8px)

import styles from '@/shared/ui/Button/buttonBasic.module.scss';

export default function BtnWrap({ children, className }) {
  return <div className={`${styles[className]} ${styles.btnWrapsStyle}`}>{children}</div>;
}
