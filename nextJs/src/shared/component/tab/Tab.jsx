'use client';

// ============================================================================
// Imports
// ============================================================================
import { forwardRef, useMemo } from 'react';

import styles from './tab.module.scss';

// ============================================================================
// Component
// ============================================================================

/**
 * Tab 컴포넌트 (탭 버튼만 렌더링, 제어 컴포넌트)
 *
 * 탭 버튼을 렌더링하며, 콘텐츠는 부모 컴포넌트에서 관리합니다
 * breadcrumb 스타일의 라벨 시스템을 사용합니다
 *
 * @param {Object} props
 * @param {Array<{label: string, value: string}>} props.tabs - 탭 배열 (label: 표시 텍스트, value: 고유 식별자)
 * @param {string} props.value - 선택된 탭 value (필수, 제어 컴포넌트)
 * @param {Function} props.onChange - 탭 선택 콜백 (value) => void (필수)
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {React.Ref<HTMLDivElement>} [props.ref] - 컨테이너 div에 전달할 ref
 * @param {Object} [rest] - HTML 네이티브 속성 (aria-*, data-* 등)
 *
 * @example
 * const [activeTab, setActiveTab] = useState('info');
 * <Tab
 *   tabs={[
 *     { label: '기본 정보', value: 'info' },
 *     { label: '상세 정보', value: 'detail' }
 *   ]}
 *   value={activeTab}
 *   onChange={setActiveTab}
 * />
 */
const Tab = forwardRef(({ tabs = [], value, onChange, className = '', ...rest }, ref) => {
  const containerClasses = useMemo(() => {
    // return [styles.tabContainer, className].filter(Boolean).join(' ');
    return [styles.tabContainer, className].filter(Boolean).join(' ');
  }, [className]);

  return (
    <div ref={ref} className={containerClasses} {...rest}>
      {/* 탭 버튼 */}
      {/* <div className={styles.tabButtons}> */}
      {tabs.map((tab) => (
        <span
          key={tab.value}
          className={`${styles.tabButton} ${value === tab.value ? styles.active : ''}`}
          onClick={() => onChange(tab.value)}
          role="tab"
          aria-selected={value === tab.value}
          tabIndex={value === tab.value ? 0 : -1}
        >
          {tab.label}
        </span>
      ))}
      {/* </div> */}
    </div>
  );
});

Tab.displayName = 'Tab';

export default Tab;
