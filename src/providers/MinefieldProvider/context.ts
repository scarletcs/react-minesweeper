import { createContext, useContext } from "react";
import { type Minefield } from "../../types/minefield";

export const MinefieldContext = createContext<Minefield | undefined>(undefined);

export function useMinefield() {
  const ctx = useContext(MinefieldContext);
  if (!ctx) {
    throw Error("Minefield not available");
  }
  return ctx;
}
