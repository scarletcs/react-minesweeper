import { type Vec2 } from "./vector";
import { Random } from "../utils/random";

export type Minefield = {
  width: number;
  height: number;
  tiles: Tile[];
};

export type Tile = {
  key: string;
  x: number;
  y: number;
  revealed: boolean;
  mine: boolean;
  flag: boolean;
  adjacentTiles: Tile[];
  adjacentMines: number;
};

function makeTile(overrides: Partial<Tile> & { x: number; y: number }): Tile {
  return {
    key: Random.uuid(),
    revealed: false,
    mine: false,
    flag: false,
    adjacentMines: 0,
    adjacentTiles: [],
    ...overrides,
  };
}

export function makeMinefield(width: number, height: number): Minefield {
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
    tiles,
  };
}

export function indexToCoord(
  field: { width: number; height: number },
  index: number
): Vec2 {
  const y = Math.floor(index / field.width);
  const x = index % field.width;
  return { x, y };
}

export function getTile(field: Minefield, coord: Vec2): Tile | undefined {
  if (coord.x < 0 || coord.y < 0) {
    return undefined;
  }
  const column = coord.y * field.width;
  const row = coord.x;
  const tile = field.tiles[column + row];
  return tile;
}

export const ADJACENT_COORDS = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: +1 },

  { x: 0, y: -1 },
  { x: 0, y: +1 },

  { x: +1, y: -1 },
  { x: +1, y: 0 },
  { x: +1, y: +1 },
];
