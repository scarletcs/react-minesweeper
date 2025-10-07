import { createContext, useContext } from "react";
import { type GameState } from "./types";
import type { GameStateReducer } from "./reducer";

export const GameStateContext = createContext<
  [GameState, GameStateReducer] | undefined
>(undefined);

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (!ctx) {
    throw Error("Game state not available");
  }
  return ctx;
}
