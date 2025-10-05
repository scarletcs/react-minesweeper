import type { ActionDispatch } from "react";
import {
  getTile,
  makeMinefield,
  type Minefield,
  type MinefieldConfig,
} from "../../types/minefield";
import type { Vec2 } from "../../types/vector";
import { Random } from "../../utils/random";

export type MinefieldState = {
  /**
   * The current minefield.
   */
  minefield: Minefield;
  /**
   * The initial minefield state at the beginning of the game.
   */
  initial: Minefield;
  /**
   * The game's progress.
   */
  progress: EnumValue<typeof GameProgress>;
  /**
   * The history of actions that have been performed on this minefield.
   * Replay these over {@link MinefieldState.initial} to replay the game.
   */
  history: MinefieldReducerAction[];
};

const GameProgress = Object.freeze({
  Idle: "idle",
  Started: "started",
  Win: "win",
  Lose: "lose",
});

export function makeMinefieldState(config: MinefieldConfig): MinefieldState {
  const minefield = makeMinefield(config);
  return {
    minefield,
    initial: minefield,
    progress: GameProgress.Idle,
    history: [],
  };
}

export type MinefieldReducer = ActionDispatch<[action: MinefieldReducerAction]>;

type MinefieldReducerAction =
  | {
      type: "reveal_tile";
      payload: Vec2;
    }
  | {
      type: "toggle_flag";
      payload: Vec2;
    };

export function minefieldReducer(
  state0: MinefieldState,
  action: MinefieldReducerAction
): MinefieldState {
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

function copyState(state0: MinefieldState) {
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

type ActionHandler<T extends MinefieldReducerAction["type"]> = (
  state: MinefieldState,
  action: MinefieldReducerAction & { type: T }
) => MinefieldState | undefined;

const handleRevealTile: ActionHandler<"reveal_tile"> = (state, action) => {
  const tile = getTile(state.minefield, action.payload);
  if (!tile) {
    throw Error("Tile doesn't exist.");
  }
  if (tile.flag) {
    console.warn("Can't reveal a flagged tile.");
    return;
  }
  tile.revealed = true;
  if (state.progress === GameProgress.Idle) {
    plantMines(state.minefield);
    state.progress = GameProgress.Started;
    state.initial = state.minefield;
  }
  // TODO flood fill adjacent safe squares
  return state;
};

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
