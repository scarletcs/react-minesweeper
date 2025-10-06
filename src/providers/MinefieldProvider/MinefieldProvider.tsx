import { useReducer, type PropsWithChildren } from "react";
import { MinefieldContext } from "./context";
import { minefieldReducer } from "./reducer";
import { makeMinefieldState } from "./types";

type Props = PropsWithChildren & {
  width?: number;
  height?: number;
  mineCount?: number;
};

export default function MinefieldProvider({
  children,
  width = 8,
  height = 8,
  mineCount = 8,
}: Props) {
  const [state, dispatch] = useReducer(
    minefieldReducer,
    makeMinefieldState({ width, height, mineCount })
  );

  return (
    <MinefieldContext.Provider value={[state, dispatch]}>
      {children}
    </MinefieldContext.Provider>
  );
}
