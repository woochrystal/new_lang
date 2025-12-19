import styles from './hr.module.scss';

/**
 * Hr 컴포넌트 (<hr> 태그 래핑)
 *
 * 콘텐츠를 시각적으로 구분하는 수평선 또는 수직선을 제공합니다.
 * 테마 시스템과 통합되어 다양한 스타일링을 지원합니다.
 *
 * @param {Object} props
 * @param {'horizontal'|'vertical'} [props.variant='horizontal'] - 디바이더 방향
 * @param {boolean} [props.fullWidth=false] - 부모 패딩을 무시하고 부모 컨테이너 전체를 차지
 * @param {'sm'|'md'|'lg'} [props.spacing='md'] - 상하 또는 좌우 여백
 * @param {string} [props.className] - 추가 CSS 클래스
 * @param {Object} props...rest - HTML <hr> 네이티브 속성
 *
 * @example
 * // 기본 수평선
 * <Hr />
 *
 * @example
 * // 부모 패딩 무시하고 전체 너비로 표시
 * <div style={{ padding: '16px' }}>
 *   <Hr fullWidth />
 * </div>
 *
 * @example
 * // 커스텀 여백
 * <Hr spacing="lg" />
 *
 * @example
 * // 수직 디바이더
 * <div style={{ display: 'flex' }}>
 *   <span>Left</span>
 *   <Hr variant="vertical" />
 *   <span>Right</span>
 * </div>
 */
const Hr = ({ variant = 'horizontal', full = false, fullWidth = false, spacing = 'md', className = '', ...rest }) => {
  const isFull = full || fullWidth;
  const hrClasses = [
    styles.hr,
    styles[`variant-${variant}`],
    styles[`spacing-${spacing}`],
    isFull && styles['full-width'],
    className
  ]
    .filter(Boolean)
    .join(' ');

  return <hr className={hrClasses} {...rest} />;
};

export default Hr;
