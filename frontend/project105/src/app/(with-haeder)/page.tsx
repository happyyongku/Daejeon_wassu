import styles from "./page.module.css";
import SectionOne from "@/components/index/sectionone";
import SectionTwo from "@/components/index/sectiontwo";
import SectionThree from "@/components/index/sectionthree";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.indexcontainer}>
        <SectionOne />
        <SectionTwo />
        <SectionThree />
      </div>
    </div>
  );
}
