import styles from "./MinefieldView.module.scss";
import { useMinefield } from "../providers/MinefieldProvider/context";
import TileView from "./TileView";

export default function MinefieldView() {
  const minefield = useMinefield();

  return (
    <div
      className={styles.world}
      style={{ "--minefield-width": minefield.width }}
      data-width={minefield.width}
      data-height={minefield.height}
    >
      {minefield.tiles.map((tile) => (
        <TileView key={tile.key} tile={tile} />
      ))}
    </div>
  );
}
