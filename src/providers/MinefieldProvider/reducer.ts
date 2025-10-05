import type { ActionDispatch } from "react";
import { getTile, makeMinefield, type Minefield } from "../../types/minefield";
import type { Vec2 } from "../../types/vector";

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

export function makeMinefieldState(
  width: number,
  height: number
): MinefieldState {
  const minefield = makeMinefield(width, height);
  return {
    minefield,
    initial: minefield,
    progress: GameProgress.Idle,
    history: [],
  };
}

export type MinefieldReducer = ActionDispatch<[action: MinefieldReducerAction]>;

type MinefieldReducerAction = {
  type: "reveal_tile";
  payload: Vec2;
};

export function minefieldReducer(
  state0: MinefieldState,
  action: MinefieldReducerAction
) {
  const state = copyState(state0);
  state.history.push(action);
  switch (action.type) {
    case "reveal_tile":
      return handleRevealTile(state, action);
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
) => MinefieldState;

const handleRevealTile: ActionHandler<"reveal_tile"> = (state, action) => {
  let [tile, index] = getTile(state.minefield, action.payload);
  if (!tile) {
    throw Error("Can't reveal tile. It doesn't exist.");
  }
  tile = {
    ...tile,
    revealed: true,
  };
  state.minefield.tiles[index] = tile;
  return state;
};
