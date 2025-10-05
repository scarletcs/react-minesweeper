import { useCallback, useMemo, type MouseEvent } from "react";
import { useMinefield } from "../providers/MinefieldProvider/context";
import { getAdjacentTiles, type Tile } from "../types/minefield";
import styles from "./TileView.module.scss";
import classNames from "classnames";

type Props = {
  tile: Tile;
};

export default function TileView({ tile }: Props) {
  const [minefield, dispatch] = useMinefield();
  const { x, y, revealed, flag, mine } = tile;

  /** List of adjacent tiles */
  const adjacentTiles = useMemo(
    () => getAdjacentTiles({ x, y }, minefield),
    [x, y, minefield]
  );

  /** Number of adjacent mines */
  const adjacentMines = useMemo(
    () => adjacentTiles.filter((t) => t.mine).length,
    [adjacentTiles]
  );

  const handleClick = useCallback(() => {
    if (!revealed && !flag) {
      dispatch({ type: "reveal_tile", payload: { x, y } });
    }
  }, [dispatch, revealed, flag, x, y]);

  const handleRightClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      if (revealed) {
        return;
      }
      dispatch({ type: "toggle_flag", payload: { x, y } });
    },
    [dispatch, revealed, x, y]
  );

  return (
    <button
      key={tile.key}
      type="button"
      onClick={handleClick}
      onContextMenu={handleRightClick}
      className={classNames(
        styles.tile,
        revealed ? styles.revealed : styles.unrevealed
      )}
    >
      {flag && <span>🚩</span>}
      {revealed && adjacentMines > 0 && (
        <span className={styles.warning}>{adjacentMines}</span>
      )}
      {/* for now, go with an x-ray view. always inform us if there's a mine here. */}
      {mine && <span>💣</span>}
    </button>
  );
}
