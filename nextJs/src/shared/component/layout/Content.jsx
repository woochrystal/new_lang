'use client';

// ============================================================================
// Imports
// ============================================================================
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';

import { Main } from '../container/Main';
import Section from '../container/Section';
import { Article } from '../container/Article';
import Header from '../container/Header';
import Footer from '../container/Footer';
import useResizeObserver from './useResizeObserver';
import styles from './layout.module.scss';

// ============================================================================
// Context
// ============================================================================

/**
 * Content.Split에서 좌우 헤더의 높이를 공유하기 위한 컨텍스트
 */
const HeaderHeightContext = createContext({
  maxHeaderHeight: 0
});

// ============================================================================
// Components
// ============================================================================

/**
 * Content - 기본 메인 컨테이너
 *
 * @example
 * <Content>
 *   <p>컨텐츠</p>
 * </Content>
 */
const Content = ({ children, className = '', ...props }) => {
  return (
    <Main className={`${styles.contentWrapper} ${className}`} {...props}>
      {children}
    </Main>
  );
};

/**
 * Content.Split - 2분할 그리드 레이아웃 (좌/우)
 *
 * 반응형: 모바일에서는 자동으로 세로 스택으로 전환
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content.Left/Right
 * @param {string} [props.leftMinWidth='480px'] - 좌측 최소 너비
 * @param {string} [props.rightMinWidth='720px'] - 우측 최소 너비
 * @param {string} [props.horizontalGap='48px'] - 데스크탑 간격
 * @param {string} [props.verticalGap='32px'] - 모바일 간격
 * @param {string} [props.className] - 추가 CSS 클래스
 *
 * @example
 * <Content.Split>
 *   <Content.Left>...</Content.Left>
 *   <Content.Right>...</Content.Right>
 * </Content.Split>
 */
Content.Split = ({
  children,
  leftMinWidth = '480px',
  rightMinWidth = '720px',
  horizontalGap = '20px',
  verticalGap = '32px',
  className = '',
  ...props
}) => {
  // 좌우 헤더 높이 추적 (플레이스홀더용)
  const [leftHeaderHeight, setLeftHeaderHeight] = useState(0);
  const [rightHeaderHeight, setRightHeaderHeight] = useState(0);
  const maxHeaderHeight = Math.max(leftHeaderHeight, rightHeaderHeight);

  return (
    <HeaderHeightContext.Provider value={{ maxHeaderHeight, setLeftHeaderHeight, setRightHeaderHeight }}>
      <Section className={`${styles.contentSplit} ${className}`} {...props}>
        {children}
      </Section>
    </HeaderHeightContext.Provider>
  );
};

/**
 * Content.Left - 좌측 컨테이너
 *
 * @example
 * <Content.Left>
 *   <Content.LeftHeader>...</Content.LeftHeader>
 *   <div>내용</div>
 *   <Content.LeftFooter>...</Content.LeftFooter>
 * </Content.Left>
 */
Content.Left = ({ children, className = '', ...props }) => {
  const { maxHeaderHeight } = useContext(HeaderHeightContext);
  const childrenArray = React.Children.toArray(children);
  const hasLeftHeader = childrenArray.some((child) => child.type === Content.LeftHeader);

  const showPlaceholder = maxHeaderHeight > 0 && !hasLeftHeader;

  return (
    <Article className={`${styles.contentLeft} ${className}`} {...props}>
      {showPlaceholder && <div className={styles.contentPlaceholder} style={{ height: maxHeaderHeight }} />}
      {children}
    </Article>
  );
};

/**
 * Content.Right - 우측 컨테이너
 *
 * @example
 * <Content.Right>
 *   <Content.RightHeader>...</Content.RightHeader>
 *   <div>내용</div>
 *   <Content.RightFooter>...</Content.RightFooter>
 * </Content.Right>
 *

  //Content.Right에 className 추가
  // roundedLgWrapNobg - 컨테이너 최상단 배경색 없앰 (#fbfafc;)

  // 필요 시 roundedLgWrapNobg 대신 사용
  // roundedLgWrapGray - 컨테이너 최상단 배경색 회색으로 (#fbfafc;)
 */
Content.Right = ({ children, className = '', ...props }) => {
  const { maxHeaderHeight } = useContext(HeaderHeightContext);
  const childrenArray = React.Children.toArray(children);
  const rightHeader = childrenArray.find((child) => child.type === Content.RightHeader);
  const otherChildren = childrenArray.filter((child) => child.type !== Content.RightHeader);

  const showPlaceholder = maxHeaderHeight > 0 && !rightHeader;

  return (
    <Article className={`${styles.contentRight} ${className}`} {...props}>
      {rightHeader}
      {showPlaceholder && <div className={styles.contentPlaceholder} style={{ height: maxHeaderHeight }} />}
      <div className={`${styles.contentBody} ${styles.roundedLgWrap}`}>
        <div className={`${styles.roundInnerLg}`}>{otherChildren}</div>
      </div>
    </Article>
  );
};

/**
 * Content.LeftHeader - 좌측 헤더
 *
 * ResizeObserver로 높이를 자동 추적합니다.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 헤더 내용
 * @param {string} [props.className] - 추가 CSS 클래스
 *
 * @example
 * <Content.LeftHeader>
 *   <h2>좌측 헤더</h2>
 * </Content.LeftHeader>
 */
Content.LeftHeader = ({ children, className = '', ...props }) => {
  const { setLeftHeaderHeight } = useContext(HeaderHeightContext);
  const headerRef = useRef(null);
  const { height } = useResizeObserver(headerRef);

  useEffect(() => {
    if (height > 0) {
      setLeftHeaderHeight(height);
    }
  }, [height, setLeftHeaderHeight]);

  return (
    <Header ref={headerRef} className={`${styles.contentHeader} ${className}`} {...props}>
      {children}
    </Header>
  );
};

/**
 * Content.LeftFooter - 좌측 푸터
 *
 * @example
 * <Content.LeftFooter>
 *   <button>버튼</button>
 * </Content.LeftFooter>
 */
Content.LeftFooter = ({ children, className = '', ...props }) => {
  return (
    <Footer className={`${styles.contentFooter} ${className}`} {...props}>
      {children}
    </Footer>
  );
};

/**
 * Content.RightHeader - 우측 헤더
 *
 * ResizeObserver로 높이를 자동 추적합니다.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - 헤더 내용
 * @param {string} [props.className] - 추가 CSS 클래스
 *
 * @example
 * <Content.RightHeader>
 *   <h2>우측 헤더</h2>
 * </Content.RightHeader>
 */
Content.RightHeader = ({ children, className = '', ...props }) => {
  const { setRightHeaderHeight } = useContext(HeaderHeightContext);
  const headerRef = useRef(null);
  const { height } = useResizeObserver(headerRef);

  useEffect(() => {
    if (height > 0) {
      setRightHeaderHeight(height);
    }
  }, [height, setRightHeaderHeight]);

  return (
    <Header ref={headerRef} className={`${styles.contentHeader} ${className}`} {...props}>
      {children}
    </Header>
  );
};

/**
 * Content.RightFooter - 우측 푸터
 *
 * @example
 * <Content.RightFooter>
 *   <button>버튼</button>
 * </Content.RightFooter>
 */
Content.RightFooter = ({ children, className = '', ...props }) => {
  return (
    <Footer className={`${styles.contentFooter} ${className}`} {...props}>
      {children}
    </Footer>
  );
};

/**
 * Content.Full - 전체 너비 컨테이너
 *
 * Split 없이 전체 너비를 사용하는 경우
 *
 * @example
 * <Content.Full>
 *   <div>전체 너비 컨텐츠</div>
 * </Content.Full>
 */
Content.Full = ({ children, className = '', ...props }) => {
  return (
    <Section className={`${styles.contentFull} ${className}`} {...props}>
      {children}
    </Section>
  );
};

/**
 * Content.Body - 스크롤 영역 (Left/Right 공용)
 *
 * Header와 Footer 사이의 스크롤 가능한 영역
 * 기존 pageScroll 역할 대체
 *
 * @example
 * <Content.Left>
 *   <Content.LeftHeader>고정 헤더</Content.LeftHeader>
 *   <Content.Body>
 *     <div>스크롤 콘텐츠</div>
 *   </Content.Body>
 *   <Content.LeftFooter>고정 푸터</Content.LeftFooter>
 * </Content.Left>
 */
Content.Body = ({ children, className = '', ...props }) => {
  return (
    <div className={`${styles.contentBody} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Content;
