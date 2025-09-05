import styles from "./layout.module.scss";
import Top from "@/shared/ui/Title/topTit";

export default function Inner({ children }) {
  return (
    <div className={styles.innerLayout}>
      <Top />
      { children }
    </div>
  );
}
