import { useState } from "react";
import styles from "./MinefieldView.module.scss";
import { indexToCoord, makeMinefield } from "../types/minefield";
import { stringifyVector } from "../types/vector";

export function MinefieldView() {
  const [minefield] = useState(makeMinefield(10, 10));

  return (
    <div
      className={styles.world}
      style={{ "--minefield-width": minefield.width }}
      data-width={minefield.width}
      data-height={minefield.height}
    >
      {minefield.tiles.map((tile, index) => (
        <div
          key={tile.key}
          data-coord={stringifyVector(indexToCoord(minefield, index))}
        >
          {index}
        </div>
      ))}
    </div>
  );
}
