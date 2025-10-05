import { type Vec2 } from "./vector";
import { Random } from "../utils/random";

export type MinefieldConfig = {
  width: number;
  height: number;
  mineCount: number;
};

export type Minefield = {
  width: number;
  height: number;
  mineCount: number;
  tiles: Tile[];
};

export type Tile = {
  /** A unique key for this tile. */
  key: string;
  /** This tile's X position. */
  x: number;
  /** This tile's Y position. */
  y: number;
  /** Whether this tile is revealed. */
  revealed: boolean;
  /** Whether this tile has a mine. */
  mine: boolean;
  /** Whether this tile has a flag on it. */
  flag: boolean;
};

function makeTile(overrides: Partial<Tile> & { x: number; y: number }): Tile {
  return {
    key: Random.uuid(),
    revealed: false,
    mine: false,
    flag: false,
    ...overrides,
  };
}

export function makeMinefield({
  width,
  height,
  mineCount,
}: MinefieldConfig): Minefield {
  const tiles = [];
  const tileCount = width * height;
  for (let index = 0; index < tileCount; index++) {
    const coord = indexToCoord({ width, height }, index);
    const tile = makeTile(coord);
    tiles.push(tile);
  }

  return {
    width,
    height,
    mineCount,
    tiles,
  };
}

export function indexToCoord(
  field: { width: number; height: number },
  index: number
): Vec2 {
  if (index < 0 || index >= field.width * field.height) {
    throw Error("Index is out of bounds for this minefield");
  }
  const y = Math.floor(index / field.width);
  const x = index % field.width;
  return { x, y };
}

export function getTile(field: Minefield, coord: Vec2): Tile | undefined {
  if (
    coord.x < 0 ||
    coord.y < 0 ||
    coord.x >= field.width ||
    coord.y >= field.height
  ) {
    return undefined;
  }
  const column = coord.y * field.width;
  const row = coord.x;
  const index = column + row;
  const tile = field.tiles[index];
  return tile;
}

export function getAdjacentTiles(field: Minefield, tile: Vec2) {
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

export const ADJACENT_COORDS = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: +1 },

  { x: 0, y: -1 },
  // not 0, 0
  { x: 0, y: +1 },

  { x: +1, y: -1 },
  { x: +1, y: 0 },
  { x: +1, y: +1 },
];
