import { useMinefield } from "../providers/MinefieldProvider/context";
import { getAdjacentTiles, indexToCoord, type Tile } from "../types/minefield";
import { stringifyVector } from "../types/vector";

type Props = {
  tile: Tile;
  index: number;
};

export function TileView({ tile, index }: Props) {
  const minefield = useMinefield();
  const adjacentTiles = getAdjacentTiles(tile, minefield);

  return (
    <div
      key={tile.key}
      data-index={index}
      data-adjacent-count={adjacentTiles.length}
      data-coord={stringifyVector(indexToCoord(minefield, index))}
    >
      {index}
    </div>
  );
}
