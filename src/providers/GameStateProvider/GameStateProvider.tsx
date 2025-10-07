import { useReducer, type PropsWithChildren } from "react";
import { GameStateContext } from "./context";
import { minefieldReducer } from "./reducer";
import { makeGameState } from "./types";
import { makeMinefield } from "../../types/minefield";

type Props = PropsWithChildren & {
  width?: number;
  height?: number;
  mineCount?: number;
};

export default function GameStateProvider({
  children,
  width = 8,
  height = 8,
  mineCount = 8,
}: Props) {
  const [state, dispatch] = useReducer(
    minefieldReducer,
    makeGameState(makeMinefield({ width, height, mineCount }))
  );

  return (
    <GameStateContext.Provider value={[state, dispatch]}>
      {children}
    </GameStateContext.Provider>
  );
}
