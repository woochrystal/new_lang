// Wrapper와 구분을 위해 ConTit으로 별도 작성
// 제목 + 버튼 구조일 시 <ConTit className={'txtBtnWrap'}> 형식 사용
// h2:24px, h3: 18px, p:16px 사용 - className 추가해서 커스텀 가능
//기본 - contit

import styles from '@/shared/ui/Title/title.module.scss';

const ConTit = ({ children }) => {
  // const containerClasses = [className, styles[className]].filter(Boolean).join(' ');
  return <div className={`${styles.contit} txtBtnWrap`}>{children}</div>;
};

export default ConTit;
