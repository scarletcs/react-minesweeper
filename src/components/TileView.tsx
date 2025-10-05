import { useMinefield } from "../providers/MinefieldProvider/context";
import {
  ADJACENT_COORDS,
  getTile,
  indexToCoord,
  type Minefield,
  type Tile,
} from "../types/minefield";
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

function getAdjacentTiles(tile: Tile, field: Minefield) {
  const found: Tile[] = [];
  for (const diff of ADJACENT_COORDS) {
    const adjacentCoord = {
      x: tile.x + diff.x,
      y: tile.y + diff.y,
    };
    const adjacent = getTile(field, adjacentCoord);
    if (adjacent) {
      found.push(adjacent);
    }
  }
  return found;
}
