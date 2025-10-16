'use client';

import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import PageTit from '@/shared/ui/Title/pageTit';
import Tab from '@/shared/ui/Tab/Tab';

// HeaderHeightContext - 양쪽 헤더 높이 관리
const HeaderHeightContext = createContext({
  leftHeaderHeight: 0,
  rightHeaderHeight: 0,
  maxHeaderHeight: 0,
  setLeftHeaderHeight: () => {},
  setRightHeaderHeight: () => {}
});

// Content - 기본 컨테이너
function Content({ children, className = '', ...props }) {
  return (
    <div className={`w-full h-full ${className}`} {...props}>
      {children}
    </div>
  );
}

// Content.Split - 2분할 그리드 레이아웃
Content.Split = function ContentSplit({
  children,
  leftMinWidth = '480px',
  rightMinWidth = '720px',
  horizontalGap = '48px',
  verticalGap = '32px',
  className = '',
  ...props
}) {
  const [leftHeaderHeight, setLeftHeaderHeight] = useState(0);
  const [rightHeaderHeight, setRightHeaderHeight] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isStacked, setIsStacked] = useState(false);

  const maxHeaderHeight = Math.max(leftHeaderHeight, rightHeaderHeight);

  const leftMinWidthNum = parseInt(leftMinWidth, 10);
  const rightMinWidthNum = parseInt(rightMinWidth, 10);
  const horizontalGapNum = parseInt(horizontalGap, 10);
  const stackPoint = leftMinWidthNum + rightMinWidthNum + horizontalGapNum;

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => setIsStacked(window.innerWidth < stackPoint);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [stackPoint]);

  const gap = isStacked ? verticalGap : horizontalGap;
  const gridTemplateColumns = isClient && isStacked ? '1fr' : `minmax(${leftMinWidth}, 2fr) 3fr`;

  return (
    <HeaderHeightContext.Provider
      value={{
        leftHeaderHeight,
        rightHeaderHeight,
        maxHeaderHeight,
        setLeftHeaderHeight,
        setRightHeaderHeight
      }}
    >
      <div className={`grid h-full ${className}`} style={{ gap, gridTemplateColumns }} {...props}>
        {children}
      </div>
    </HeaderHeightContext.Provider>
  );
};

// Content.Left - 좌측 컨테이너
Content.Left = function ContentLeft({ children, className = '', ...props }) {
  const { maxHeaderHeight } = useContext(HeaderHeightContext);
  const childrenArray = React.Children.toArray(children);
  const hasLeftHeader = childrenArray.some((child) => child.type === Content.LeftHeader);

  const showPlaceholder = maxHeaderHeight > 0 && !hasLeftHeader;

  return (
    <div className={`flex flex-col h-full ${className}`} {...props}>
      {showPlaceholder && <div style={{ height: maxHeaderHeight, flexShrink: 0 }} />}
      {children}
    </div>
  );
};

// Content.Right - 우측 컨테이너
Content.Right = function ContentRight({ children, className = '', ...props }) {
  const { maxHeaderHeight } = useContext(HeaderHeightContext);
  const childrenArray = React.Children.toArray(children);
  const hasRightHeader = childrenArray.some((child) => child.type === Content.RightHeader);

  const showPlaceholder = maxHeaderHeight > 0 && !hasRightHeader;

  return (
    <div className={`flex flex-col h-full ${className}`} {...props}>
      {showPlaceholder && <div style={{ height: maxHeaderHeight, flexShrink: 0 }} />}
      {children}
    </div>
  );
};

// Content.RightHeader - 우측 컨테이너 헤더
Content.RightHeader = function ContentRightHeader({
  children,
  className = '',
  tabs,
  activeTab,
  onTabChange,
  ...props
}) {
  const { setRightHeaderHeight } = useContext(HeaderHeightContext);
  const headerRef = useRef(null);

  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      setRightHeaderHeight(entries[0]?.contentRect.height ?? 0);
    });

    resizeObserver.observe(headerElement);
    return () => resizeObserver.disconnect();
  }, [setRightHeaderHeight]);

  // tabs props가 있으면 Tab 컴포넌트 렌더링, 없으면 children 렌더링
  const content = tabs ? <Tab tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} /> : children;

  return (
    <div ref={headerRef} className={`flex-shrink-0 ${className}`} {...props}>
      {content}
    </div>
  );
};

// Content.RightHeader - 우측 컨테이너 푸터
Content.RightFooter = function ContentRightFooter({ children, className = '', ...props }) {
  return (
    <div className={`flex-shrink-0 mt-auto ${className}`} {...props}>
      {children}
    </div>
  );
};

// Content.LeftHeader - 좌측 컨테이너 헤더
Content.LeftHeader = function ContentLeftHeader({ children, className = '', ...props }) {
  const { setLeftHeaderHeight } = useContext(HeaderHeightContext);
  const headerRef = useRef(null);

  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      setLeftHeaderHeight(entries[0]?.contentRect.height ?? 0);
    });

    resizeObserver.observe(headerElement);
    return () => resizeObserver.disconnect();
  }, [setLeftHeaderHeight]);

  return (
    <div ref={headerRef} className={`flex-shrink-0 ${className}`} {...props}>
      {children}
    </div>
  );
};

Content.LeftFooter = function ContentLeftFooter({ children, className = '', ...props }) {
  return (
    <div className={`flex-shrink-0 mt-auto ${className}`} {...props}>
      {children}
    </div>
  );
};

Content.PageHeader = function ContentPageHeader({ title = '', subtitle = '', children, className = '', ...props }) {
  return (
    <div className={`flex items-start justify-between w-full ${className}`} {...props}>
      <div className="flex-1">{(title || subtitle) && <PageTit title={title} description={subtitle} />}</div>
      {children && <div className="flex items-center gap-3 ml-6 flex-shrink-0">{children}</div>}
    </div>
  );
};

Content.Full = function ContentFull({ children, className = '', ...props }) {
  return (
    <div className={`w-full ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Content;
