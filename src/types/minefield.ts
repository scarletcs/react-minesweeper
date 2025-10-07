import { type Vec2 } from "./vector";
import { Random } from "../utils/random";

export type MinefieldConfig = {
  width: number;
  height: number;
  mineCount: number;
};

export type Minefield = {
  /** The number of tiles along this minefield's X axis. */
  width: number;
  /** The number of tiles along this minefield's Y axis. */
  height: number;
  /** The number of mines that exist in this minefield. */
  mineCount: number;
  /**
   * This minefield's tiles.
   *
   * These will be listed left to right, top to bottom.
   * That is, all the tiles at Y=0 are listed first in order from lowest X to highest X, then all the tiles at Y=1, etc.
   *
   * @see {@link getTile()} Use this method to get a tile at a specific coordinate.
   */
  tiles: Tile[];
};

/**
 * A tile in the game grid representing
 */
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
  /** The number of mines adjacent to this tile. */
  adjacentMines: number;
};

/**
 * Create a new, default tile.
 *
 * @param overrides Any config this tile needs.
 * @returns A newly created tile.
 */
function makeTile(overrides: Partial<Tile> & { x: number; y: number }): Tile {
  return {
    key: Random.uuid(),
    revealed: false,
    mine: false,
    flag: false,
    adjacentMines: 0,
    ...overrides,
  };
}

/**
 * Create a new minefield.
 *
 * @param param0 Configuration for this minefield.
 * @returns A newly created minefield.
 */
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

/**
 * Get the coordinate that should be associated with an index in a tile list.
 *
 * If you have access to the tile, you can just look at its coordinate. This method is better associated with minefield/tile creation.
 *
 * @param field The minefield to examine.
 * @param index The index to determine the coordinate of.
 * @returns The coordinate that should be associated with that index.
 * @throws If the index can't exist for this minefield.
 */
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

/**
 * Get the tile that should exist for a specific coordinate in a minefield.
 *
 * @param field The minefield to examine.
 * @param coord The coordinate to look for inside this minefield.
 * @returns The tile at that coordinate, or `undefined` if no tile exists there.
 */
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

/**
 * Get a list of tiles adjacent to a given tile.
 *
 * For any minefield size at least 2x2, this is expected to return between 3 and 8 tiles.
 *
 * Tiles are not adjacent to themselves.
 *
 * @param field The mienfield to examine.
 * @param tile The position or tile inside that minefield.
 * @returns The list of tiles adjacent to the given one.
 */
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

const ADJACENT_COORDS = [
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
