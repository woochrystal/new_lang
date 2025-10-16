// wrapper 내부 공통 레이아웃을 위한 컴포넌트
// InnerWrap className 정리
// -
//roundInnerLg : roundedLgWrap 바로 내부 레이아웃
//roundInnerSm : roundInnerLg 내부 레이아웃
//innerBox : 내부 박스스타일 wrap

import styles from '@/shared/ui/Wrapper/wrapper.module.scss';

const InnerWrap = ({ children, className = '', ...rest }, ref) => {
  const containerClasses = ['innerWrap', styles[className]].filter(Boolean).join(' ');
  return (
    <div ref={ref} className={containerClasses} {...rest}>
      {children}
    </div>
  );
};

export default InnerWrap;
