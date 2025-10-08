import GameStateProvider from "./providers/GameStateProvider/GameStateProvider";
import styles from "./App.module.scss";
import GameView from "./components/GameView";
import GameTimeProvider from "./providers/GameTimeProvider/GameTimeProvider";

export default function App() {
  return (
    <div className={styles.app}>
      <GameStateProvider>
        <GameTimeProvider>
          <GameView />
        </GameTimeProvider>
      </GameStateProvider>
    </div>
  );
}
