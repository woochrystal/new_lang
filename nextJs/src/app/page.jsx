import "./main.scss";
import Content from "./groupware/contentLayout";

// 전체 레이아웃
export default function Home() {
  return (
    <div>
      <main>
        <div className="container">
          <Content/>
        </div>
      </main>
      <footer>
       
      </footer>
    </div>
  );
}
