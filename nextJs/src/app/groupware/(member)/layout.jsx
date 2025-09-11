import LeftMenu from '../../../shared/ui/LeftMenu/leftMenu';
import styles from './layout.scss';

// 페이지 내부 컨텐츠 레이아웃
export default function ContentLayout({ children }) {
  return (
    <main className="main">
      <div className="containWrap">
        <LeftMenu />
        {children}
      </div>
    </main>
  );
}
