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
    revealAdjacentTiles(minefield, position);
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

  // TODO flood fill adjacent safe squares

  return state;
};

function revealTile(tile: Tile) {
  tile.revealed = true;
  tile.flag = false;
}

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

function revealAdjacentTiles(minefield: Minefield, position: Vec2) {
  const tiles = getAdjacentTiles(minefield, position);
  tiles.forEach((t) => {
    revealTile(t);
  });
}

function plantMines(minefield: Minefield) {
  const tiles = minefield.tiles.filter((t) => !t.revealed);
  const shuffled = Random.shuffle(tiles);
  shuffled.slice(0, minefield.mineCount).forEach((tile) => {
    tile.mine = true;
  });
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
