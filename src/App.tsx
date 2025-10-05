import MinefieldView from "./components/MinefieldView";
import MinefieldProvider from "./providers/MinefieldProvider/MinefieldProvider";
import styles from "./App.module.scss";

export default function App() {
  return (
    <div className={styles.app}>
      <MinefieldProvider>
        <MinefieldView />
      </MinefieldProvider>
    </div>
  );
}
