import {
  getAdjacentTiles,
  getTile,
  indexToCoord,
  makeMinefield,
} from "../minefield";

describe("makeMinefield", () => {
  it.each([
    [1, 1],
    [3, 3],
    [10, 10],
    [3, 5],
    [5, 4],
  ])("can make a minefield size %ix%i", (width, height) => {
    const minefield = makeMinefield(width, height);

    expect(minefield.width).toEqual(width);
    expect(minefield.height).toEqual(height);
    expect(minefield.tiles).toHaveLength(width * height);

    // all tiles have a correct coordinate in bounds
    minefield.tiles.forEach((tile, index) => {
      const { x, y } = tile;
      const expectedCoord = indexToCoord({ width, height }, index);
      expect({ x, y }).toEqual(expectedCoord);
    });
  });
});

describe("indexToCoord", () => {
  it.each([
    [0, 0, 0],
    [1, 1, 0],
    [2, 2, 0],
    [3, 0, 1],
    [8, 2, 2],
  ])(
    `calculates coord in a 3x3 (square) minefield for index %i (%i, %i)`,
    (index, x, y) => {
      expect(indexToCoord({ width: 3, height: 3 }, index)).toEqual({ x, y });
    }
  );

  it.each([
    [0, 0, 0],
    [1, 1, 0],
    [2, 2, 0],
    [3, 3, 0],
    [4, 4, 0],
    [5, 0, 1],
    [19, 4, 3],
  ])(
    `calculates coord in a 5x4 (rectangular) minefield for index %i (%i, %i)`,
    (index, x, y) => {
      expect(indexToCoord({ width: 5, height: 4 }, index)).toEqual({ x, y });
    }
  );

  it.each([-1, 9])(`throws for out of bounds indices: %i`, (index) => {
    expect(() => indexToCoord({ width: 3, height: 3 }, index)).toThrow();
  });
});

describe("getTile", () => {
  it.each([
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ])(`can get a tile in a 3x3 minefield at (%i, %i)`, (x, y) => {
    const minefield = makeMinefield(3, 3);

    const [tile] = getTile(minefield, { x, y });

    expect(tile).toBeDefined();
    expect(tile!.x).toEqual(x);
    expect(tile!.y).toEqual(y);
  });
});

describe("getAdjacentTiles", () => {
  it.each([
    [0, 0, 3], // TL corner
    [1, 0, 5], // T edge
    [2, 0, 3], // TR corner
    [0, 1, 5], // L edge
    [1, 1, 8], // center
    [2, 1, 5], // R edge
    [0, 2, 3], // BL corner
    [1, 2, 5], // B edge
    [2, 2, 3], // BR corner
  ])(
    `finds the correct amount of adjacent tiles in a 3x3 minefield at position (%i, %i)`,
    (x, y, expected) => {
      const minefield = makeMinefield(3, 3);
      const [tile] = getTile(minefield, { x, y });

      const adjacent = getAdjacentTiles(tile!, minefield);

      expect(adjacent.length).toEqual(expected);
    }
  );
});
