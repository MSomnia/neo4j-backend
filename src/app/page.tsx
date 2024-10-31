import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>
          The Backend of Neo4j Project
        </h1>
      </main>
    </div>
  );
}
