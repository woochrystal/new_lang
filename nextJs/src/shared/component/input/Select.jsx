'use client';

// ============================================================================
// Imports
// ============================================================================
import { useEffect, useState, useRef, useMemo, useCallback } from 'react';

import styles from './input.module.scss';

// ============================================================================
// Component
// ============================================================================

/**
 * 셀렉트 박스 컴포넌트
 *
 * ⚠️ 제어 컴포넌트: value + onChange 조합 필수
 *
 * 키보드 네비게이션 지원:
 * - ArrowDown/ArrowUp: 옵션 이동
 * - Enter/Space: 선택
 * - Escape: 닫기
 * - Home/End: 첫/마지막 옵션
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string}>} props.options - 선택 옵션 배열
 * @param {string} [props.value=''] - 선택된 값 (필수)
 * @param {Function} props.onChange - 값 변경 콜백 (value) => void (필수)
 * @param {string} [props.label] - 레이블 텍스트
 * @param {boolean} [props.required=false] - 필수 선택 여부 (별표 표시)
 * @param {string} [props.id] - select ID (접근성)
 * @param {string} [props.name] - select name
 * @param {string} [props.placeholder='선택하세요'] - 기본 텍스트
 * @param {boolean} [props.disabled=false] - 비활성화 여부
 * @param {boolean} [props.searchable=false] - 검색 기능 활성화
 * @param {string} [props.searchPlaceholder='검색...'] - 검색 입력 placeholder
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {string} [props.description] - 선택 필드 설명 텍스트 (aria-describedby 연결)
 * @param {string} [props.error] - 선택 필드 오류 메시지 (aria-describedby + aria-invalid 연결)
 * @param {React.Ref<HTMLDivElement>} [props.ref] - 컨테이너 div에 전달할 ref
 * @param {Object} [rest] - HTML 네이티브 속성 (aria-*, data-* 등)
 *
 * @example
 * const [type, setType] = useState('');
 * <Select
 *   label="휴가 종류"
 *   options={[
 *     { value: 'annual', label: '연차' },
 *     { value: 'half', label: '반차' },
 *     { value: 'sick', label: '병가' }
 *   ]}
 *   value={type}
 *   onChange={(value) => setType(value)}
 * />
 *
 * @example
 * // 검색 기능 활성화
 * <Select
 *   label="직급 선택"
 *   searchable={true}
 *   options={employeeGrades}
 *   value={grade}
 *   onChange={setGrade}
 * />
 */
export const Select = ({
  options = [],
  value = '',
  onChange,
  label,
  required = false,
  id,
  name,
  placeholder = '선택하세요',
  disabled = false,
  searchable = false,
  searchPlaceholder = '검색...',
  className = '',
  ref,
  description,
  error,
  ...rest
}) => {
  // ==========================================================================
  // Data (상태 관리)
  // ==========================================================================

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [openUpwards, setOpenUpwards] = useState(false);
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);
  const optionListRef = useRef(null);

  // ==========================================================================
  // Computed (계산된 값)
  // ==========================================================================

  // 필터링된 옵션 (검색어 기반)
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchQuery, searchable]);

  // 선택된 옵션의 레이블
  const selectedLabel = useMemo(() => {
    const selected = options.find((opt) => opt.value === value);
    return selected ? selected.label : placeholder;
  }, [value, options, placeholder]);

  // aria-describedby 생성
  const descriptionId = id ? `${id}-description` : undefined;
  const errorId = id ? `${id}-error` : undefined;
  const ariaDescribedBy = [error && errorId, description && descriptionId].filter(Boolean).join(' ') || undefined;

  // CSS 클래스
  const wrapperClasses = useMemo(() => {
    return [styles.wrapper, className].filter(Boolean).join(' ');
  }, [className]);

  const optionWrapperClasses = useMemo(() => {
    return [styles.selectCustom, searchable && styles.searchable, disabled && styles.disabled]
      .filter(Boolean)
      .join(' ');
  }, [searchable, disabled]);

  const selectOptionClasses = useMemo(() => {
    return [
      styles.selectOption,
      isOpen && 'active', // 글로벌 클래스는 문자열로 직접 사용
      value !== '' && 'has_value', // 글로벌 클래스는 문자열로 직접 사용
      openUpwards && styles.openUp
    ]
      .filter(Boolean)
      .join(' ');
  }, [isOpen, value, openUpwards]);

  // ==========================================================================
  // Methods (메서드)
  // ==========================================================================

  const updateDirection = useCallback(() => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;
      const requiredSpace = searchable ? 350 : 250; // 검색 가능 높이 : 일반 높이

      setOpenUpwards(spaceBelow < requiredSpace);
    }
  }, [searchable]);

  /**
   * 드롭다운 토글
   */
  const handleToggle = useCallback(() => {
    if (!disabled) {
      if (!isOpen) {
        updateDirection();
      }
      setIsOpen((prev) => !prev);
      setSearchQuery('');
      setHighlightedIndex(-1);
    }
  }, [disabled, isOpen, updateDirection]);

  /**
   * 옵션 선택
   */
  const handleSelect = useCallback(
    (selectedValue, event) => {
      event?.stopPropagation(); // 이벤트 버블링 방지
      onChange?.(selectedValue);
      setIsOpen(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
    },
    [onChange]
  );

  /**
   * 검색 입력 변경
   */
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setHighlightedIndex(-1);
  }, []);

  /**
   * 키보드 이벤트 처리 (드롭다운 닫혔을 때)
   */
  const handleKeyDownClosed = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        updateDirection();
        setIsOpen(true);
        setHighlightedIndex(filteredOptions.findIndex((opt) => opt.value === value));
      }
    },
    [filteredOptions, value, updateDirection]
  );

  /**
   * 키보드 이벤트 처리 (드롭다운 열렸을 때)
   */
  const handleKeyDownOpen = useCallback(
    (e) => {
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        }
        case 'Home': {
          e.preventDefault();
          setHighlightedIndex(0);
          break;
        }
        case 'End': {
          e.preventDefault();
          setHighlightedIndex(filteredOptions.length - 1);
          break;
        }
        case 'Enter': {
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value, e);
          }
          break;
        }
        case ' ': {
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value, e);
          }
          break;
        }
        case 'Escape': {
          e.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
        }
        default:
          break;
      }
    },
    [filteredOptions, highlightedIndex, handleSelect]
  );

  // ==========================================================================
  // Effects (부작용)
  // ==========================================================================

  // 셀렉트 외부 클릭 시 닫힘
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  // 드롭다운 열릴 때 검색 입력에 포커스
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // 하이라이트된 옵션 자동 스크롤
  useEffect(() => {
    if (highlightedIndex >= 0 && optionListRef.current) {
      const highlightedElement = optionListRef.current.querySelector(
        `li:not(.${styles.searchInputWrapper}):nth-of-type(${searchable ? highlightedIndex + 2 : highlightedIndex + 1})`
      );
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, searchable]);

  // ==========================================================================
  // Render (렌더링)
  // ==========================================================================

  return (
    <div className={wrapperClasses}>
      {/* 레이블 */}
      {label && (
        <div className={styles.label}>
          <span className={required ? styles.required : ''}>{label}</span>
        </div>
      )}

      {/* 셀렉트 */}
      <div ref={selectRef} className={optionWrapperClasses} {...rest}>
        <div
          className={selectOptionClasses}
          onClick={handleToggle}
          onKeyDown={isOpen ? handleKeyDownOpen : handleKeyDownClosed}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
          aria-describedby={ariaDescribedBy}
          aria-invalid={error ? 'true' : undefined}
        >
          <div>
            <p>
              {selectedLabel}
              <i>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g opacity="0.8">
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
              </i>
            </p>
          </div>

          {/* 옵션 리스트 */}
          <ul className={styles.option_list} role="listbox" ref={optionListRef}>
            {/* 검색 입력 (searchable이 true일 때) */}
            {searchable && (
              <li className={styles.searchInputWrapper} onClick={(e) => e.stopPropagation()}>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={styles.searchInput}
                  aria-label="검색"
                />
              </li>
            )}

            {/* 옵션 아이템 */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={(e) => handleSelect(option.value, e)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={value === option.value}
                  className={highlightedIndex === index ? styles.highlighted : ''}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className={styles.noOptions}>검색 결과가 없습니다</li>
            )}
          </ul>
        </div>
      </div>

      {/* 오류 메시지 */}
      {error && (
        <div id={errorId} className={styles.error} role="alert">
          {error}
        </div>
      )}

      {/* 설명 텍스트 */}
      {description && (
        <div id={descriptionId} className={styles.description}>
          {description}
        </div>
      )}
    </div>
  );
};

export default Select;
