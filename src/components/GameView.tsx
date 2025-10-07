import { useMemo } from "react";
import { useGameState } from "../providers/GameStateProvider";
import styles from "./GameView.module.scss";
import MinefieldView from "./MinefieldView";

export default function GameView() {
  const [game] = useGameState();
  const progress = game.progress;
  const totalMines = game.minefield.mineCount;
  const flags = useMemo(() => {
    return game.minefield.tiles.filter((tile) => tile.flag).length;
  }, [game.minefield.tiles]);

  return (
    <div className={styles.game}>
      <div className={styles.statusBar}>
        <div>00:00</div>
        <div>{progress}</div>
        <div>
          {flags} / {totalMines}
        </div>
      </div>
      <div className={styles.board}>
        <MinefieldView />
      </div>
    </div>
  );
}
