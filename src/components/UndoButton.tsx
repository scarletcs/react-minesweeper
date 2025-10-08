import { useCallback } from "react";
import { useGameState } from "../providers/GameStateProvider";
import styles from "./UndoButton.module.scss";

export function UndoButton() {
  const [game, dispatch] = useGameState();
  const enabled = game.progress === "started" && game.history.length > 0;

  const handleClick = useCallback(() => {
    dispatch({ type: "undo" });
  }, [dispatch]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!enabled}
      className={styles.undo}
      title="Undo"
      aria-label="Undo"
    >
      <div className={styles.icon}>↪</div>
    </button>
  );
}
