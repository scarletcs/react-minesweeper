import { createContext, useContext } from "react";
import { GameProgress, type MinefieldState } from "./types";
import type { Minefield } from "../../types/minefield";
import type { MinefieldReducer } from "./reducer";

export const MinefieldContext = createContext<
  [MinefieldState, MinefieldReducer] | undefined
>(undefined);

export function useMinefieldCtx() {
  const ctx = useContext(MinefieldContext);
  if (!ctx) {
    throw Error("Minefield not available");
  }
  return ctx;
}

export function useMinefield() {
  const [state, reducer] = useMinefieldCtx();
  return [state.minefield, reducer] as [Minefield, MinefieldReducer];
}

export function useGameProgress() {
  const [state] = useMinefieldCtx();
  return state.progress;
}

export function useGameEnded() {
  const progress = useGameProgress();
  return progress === GameProgress.Win || progress === GameProgress.Lose;
}
