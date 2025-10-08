import { createContext, useContext } from "react";

type GameTimeType = {
  /** The total number of seconds elapsed this game, with no conversion to minutes. */
  totalSeconds: number;
  /** The number of minutes elapsed this game. */
  minutes: number;
  /** The number of seconds (this minute) elapsed this game. This ticks over from 59 to 0. */
  seconds: number;
};

export const GameTimeContext = createContext<GameTimeType>({
  totalSeconds: 0,
  minutes: 0,
  seconds: 0,
});

/**
 * @returns Get the current elapsed game time in seconds.
 */
export function useGameTime() {
  return useContext(GameTimeContext);
}
