import Left from './leftLayout';
import Inner from './innerLayout';

// 페이지 내부 컨텐츠 레이아웃
export default function Content() {
  return (
    <div className="containWrap">
      <Left />
      <Inner />
    </div>
  );
}
