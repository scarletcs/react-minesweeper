import { useCallback, useMemo, type MouseEvent } from "react";
import { useGameState } from "../providers/GameStateProvider/context";
import { type Tile } from "../types/minefield";
import styles from "./TileView.module.scss";
import classNames from "classnames";

type Props = {
  tile: Tile;
};

export default function TileView({ tile }: Props) {
  const [game, dispatch] = useGameState();
  const { progress } = game;
  const { x, y, revealed, flag, mine } = tile;
  const gameStarted = progress !== "idle";
  const gameEnded = progress === "win" || progress === "lose";

  const handleClick = useCallback(() => {
    if (!revealed && !flag) {
      dispatch({ type: "reveal_tile", payload: { x, y } });
    }

    if (revealed) {
      dispatch({ type: "force_flood_reveal", payload: { x, y } });
    }
  }, [dispatch, revealed, flag, x, y]);

  const handleRightClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (revealed || !gameStarted) {
        return;
      }
      dispatch({ type: "toggle_flag", payload: { x, y } });
    },
    [dispatch, gameStarted, revealed, x, y]
  );

  const incorrect = useMemo(() => {
    if (!gameEnded) {
      return false;
    }

    return (revealed && mine) || (flag && !mine);
  }, [gameEnded, flag, mine, revealed]);

  return (
    <button
      key={tile.key}
      type="button"
      disabled={gameEnded}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      className={classNames(
        styles.tile,
        revealed ? styles.revealed : styles.unrevealed,
        incorrect && styles.incorrect
      )}
    >
      <TileContent tile={tile} />
    </button>
  );
}

function TileContent({ tile }: Props) {
  const [game] = useGameState();
  const { revealed, flag, mine, adjacentMines } = tile;
  const { progress } = game;
  const gameEnded = progress === "win" || progress === "lose";

  if (flag) {
    return <span>🚩</span>;
  }

  if (mine && (gameEnded || revealed)) {
    <span>💣</span>;
  }

  if (revealed && adjacentMines > 0) {
    return (
      <span className={styles.text} data-adjacent-mines={adjacentMines}>
        {adjacentMines}
      </span>
    );
  }
  return <></>;
}
