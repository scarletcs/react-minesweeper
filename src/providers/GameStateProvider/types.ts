import { type Minefield } from "../../types/minefield";
import type { GameStateReducerAction } from "./reducer";

export type GameState = {
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
   * Replay these over {@link GameState.initial} to replay the game.
   */
  history: GameStateReducerAction[];
};

export const GameProgress = Object.freeze({
  Idle: "idle",
  Started: "started",
  Win: "win",
  Lose: "lose",
});

export function makeGameState(minefield: Minefield): GameState {
  return {
    minefield,
    initial: minefield,
    progress: GameProgress.Idle,
    history: [],
  };
}
