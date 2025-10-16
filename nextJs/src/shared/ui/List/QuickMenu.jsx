import Link from 'next/link';
import styles from './list.module.scss';

/**
 * 퀵 메뉴 링크 컴포넌트
 * @param {Object} props
 * @param {string} [props.href='#'] - 이동할 경로 (기본값: '#')
 * @param {React.ReactNode} [props.children] - 링크 안에 들어갈 내용
 * @param {Object} [props.rest] - Link 컴포넌트에 전달할 추가 props
 */

export default function QuickMenu({ href = '#', ...rest }) {
  return (
    <li>
      <Link href={href} {...rest}>
        내용
      </Link>
    </li>
  );
}
