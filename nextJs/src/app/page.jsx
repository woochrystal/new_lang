import "./main.scss";
import Example from "./groupware/wsj_example";
import Select from "@/components/input/select";//리스트 아직 준비 안됨
export default function Home() {
  return (
    <div>
      <main >
        <Example/>
        {/* <Select/> */}
      </main>
      <footer>
       
      </footer>
    </div>
  );
}
