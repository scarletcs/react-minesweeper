import type { ActionDispatch } from "react";
import {
  getAdjacentTiles,
  getTile,
  type Minefield,
  type Tile,
} from "../../types/minefield";
import type { Vec2 } from "../../types/vector";
import { Random } from "../../utils/random";
import { GameProgress, type GameState as GameState } from "./types";

export type GameStateReducer = ActionDispatch<[action: GameStateReducerAction]>;

export type GameStateReducerAction =
  | {
      type: "reveal_tile";
      payload: Vec2;
    }
  | {
      type: "toggle_flag";
      payload: Vec2;
    };

export function minefieldReducer(
  state0: GameState,
  action: GameStateReducerAction
): GameState {
  const state = copyState(state0);
  if (state.progress !== GameProgress.Idle) {
    state.history.push(action);
  }
  switch (action.type) {
    case "reveal_tile":
      return handleRevealTile(state, action) || state0;
    case "toggle_flag":
      return handleToggleFlag(state, action) || state0;
    default:
      console.warn("No handler for dispatch:", action);
      return state0;
  }
}

function copyState(state0: GameState) {
  const minefield0 = state0.minefield;
  const minefield = {
    ...minefield0,
    tiles: minefield0.tiles.map((tile) => ({ ...tile })),
  };
  const state = {
    ...state0,
    minefield,
    history: [...state0.history],
  };
  return state;
}

type ActionHandler<T extends GameStateReducerAction["type"]> = (
  state: GameState,
  action: GameStateReducerAction & { type: T }
) => GameState | undefined;

const handleRevealTile: ActionHandler<"reveal_tile"> = (state, action) => {
  const position = action.payload;
  const { minefield } = state;
  const tile = getTile(minefield, position);
  if (!tile) {
    throw Error("Tile doesn't exist.");
  }

  revealTile(tile);

  if (state.progress === GameProgress.Idle) {
    getAdjacentTiles(minefield, position).forEach((t) => revealTile(t));
    plantMines(minefield);
    state.progress = GameProgress.Started;
    state.initial = minefield;
  }

  if (tile.mine) {
    state.progress = GameProgress.Lose;
  }

  if (isAllSafeTilesRevealed(minefield)) {
    state.progress = GameProgress.Win;
  }

  if (tile.adjacentMines === 0) {
    floodReveal(minefield, tile);
  }

  return state;
};

/**
 * Reveal a tile.
 *
 * @param tile The tile to reveal.
 */
function revealTile(tile: Tile) {
  tile.revealed = true;
  tile.flag = false;
}

/**
 * Perform a flood reveal extending from an origin tile.
 *
 * This mutates many tiles in the minefield.
 *
 * @param minefield The minefield to operate in.
 * @param origin The origin to start flood filling.
 */
function floodReveal(minefield: Minefield, origin: Tile) {
  const toReveal = [origin];
  const covered = new Set<string>([origin.key]);
  if (!origin.revealed) {
    revealTile(origin);
  }

  while (toReveal.length > 0) {
    const tile = toReveal.pop();
    if (!tile) {
      break;
    }
    const adjacentTiles = getAdjacentTiles(minefield, tile);
    for (const adjacent of adjacentTiles) {
      if (covered.has(adjacent.key)) {
        continue;
      }
      revealTile(adjacent);
      if (adjacent.adjacentMines === 0) {
        covered.add(adjacent.key);
        toReveal.push(adjacent);
      }
    }
  }
}

/**
 * Check if every safe tile (i.e. those without a mine) is revealed.
 *
 * This method doesn't care about flags, or whether mines are revaeled.
 *
 * @param minefield The minefield to examine.
 * @returns True if all safe tiles are revealed.
 */
function isAllSafeTilesRevealed(minefield: Minefield) {
  for (const tile of minefield.tiles) {
    const safe = !tile.mine;
    const unrevealed = !tile.revealed;
    if (safe && unrevealed) {
      return false;
    }
  }
  return true;
}

/**
 * Plant mines in a minefield up to its expected {@link Minefield.mineCount mineCount}
 *
 * @param minefield The minefield to plant mines in.
 */
function plantMines(minefield: Minefield) {
  const tiles = minefield.tiles.filter((t) => !t.revealed);
  const shuffled = Random.shuffle(tiles);
  shuffled.slice(0, minefield.mineCount).forEach((tile) => {
    plantMine(minefield, tile);
  });
}

/**
 * Plant a mine on a given tile.
 *
 * @param minefield The minefield to plant this mine in.
 * @param tile The tile this mine is going on.
 */
function plantMine(minefield: Minefield, tile: Tile) {
  tile.mine = true;
  const adjacentTiles = getAdjacentTiles(minefield, tile);
  for (const adjacent of adjacentTiles) {
    adjacent.adjacentMines += 1;
  }
}

const handleToggleFlag: ActionHandler<"toggle_flag"> = (state, action) => {
  const tile = getTile(state.minefield, action.payload);
  if (!tile) {
    throw Error("Tile doesn't exist.");
  }
  if (tile.revealed) {
    console.warn("Can't flag a revealed tile.");
    return;
  }
  tile.flag = !tile.flag;
  return state;
};
