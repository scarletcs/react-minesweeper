import { VectorMath, type Vec2 } from "./vector";
import { Random } from "../utils/random";

type Minefield = {
  width: number;
  height: number;
  tiles: Tile[];
};

type Tile = {
  key: string;
  revealed: boolean;
  mine: boolean;
  flag: boolean;
  adjacentTiles: Tile[];
  adjacentMines: string;
};

function makeTile(overrides: Partial<Tile> = {}) {
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

export function makeMinefield(width: number, height: number) {
  return {
    width,
    height,
    tiles: new Array(width * height).fill(0).map(() => makeTile()),
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

export function getTile(field: Minefield, coord: Vec2) {
  const tile = field.tiles.at(coord.y * field.height + coord.x);
  return tile;
}

export function assignNeighhbours(field: Minefield) {
  field.tiles.forEach((tile, index) => {
    const tileCoord = indexToCoord(field, index);
    ADJACENT_COORDS.forEach((diff) => {
      const adjacentCoord = VectorMath.add(tileCoord, diff);
      const adjacentTile = getTile(field, adjacentCoord);
      if (adjacentTile) {
        tile.adjacentTiles.push(adjacentTile);
      }
    });
  });
}

const ADJACENT_COORDS = [
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: +1 },
  { x: 0, y: -1 },
  { x: 0, y: 0 },
  { x: 0, y: +1 },
  { x: +1, y: -1 },
  { x: +1, y: 0 },
  { x: +1, y: +1 },
];
