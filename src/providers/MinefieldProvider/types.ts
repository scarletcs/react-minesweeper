import {
  makeMinefield,
  type Minefield,
  type MinefieldConfig,
} from "../../types/minefield";
import type { MinefieldReducerAction } from "./reducer";

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

export const GameProgress = Object.freeze({
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
