import { createContext, useContext } from "react";
import type { MinefieldReducer, MinefieldState } from "./reducer";
import type { Minefield } from "../../types/minefield";

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
