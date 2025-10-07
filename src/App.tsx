import GameStateProvider from "./providers/GameStateProvider/GameStateProvider";
import styles from "./App.module.scss";
import GameView from "./components/GameView";

export default function App() {
  return (
    <div className={styles.app}>
      <GameStateProvider>
        <GameView />
      </GameStateProvider>
    </div>
  );
}
