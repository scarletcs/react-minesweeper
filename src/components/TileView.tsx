import { useMemo } from "react";
import { useMinefield } from "../providers/MinefieldProvider/context";
import { getAdjacentTiles, type Tile } from "../types/minefield";
import styles from "./TileView.module.scss";
import classNames from "classnames";

type Props = {
  tile: Tile;
};

export default function TileView({ tile }: Props) {
  const minefield = useMinefield();
  const adjacentTiles = useMemo(
    () => getAdjacentTiles(tile, minefield),
    [tile, minefield]
  );
  const adjacentMines = useMemo(
    () => adjacentTiles.filter((t) => t.mine).length,
    [adjacentTiles]
  );

  return (
    <div
      key={tile.key}
      className={classNames(
        styles.tile,
        tile.revealed ? styles.revealed : styles.unrevealed
      )}
    >
      <span className={styles.warning}>{adjacentMines}</span>
    </div>
  );
}
