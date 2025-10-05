import { useReducer, type PropsWithChildren } from "react";
import { MinefieldContext } from "./context";
import { makeMinefieldState, minefieldReducer } from "./reducer";

type Props = PropsWithChildren & {
  width?: number;
  height?: number;
};

export default function MinefieldProvider({
  children,
  width = 3,
  height = 3,
}: Props) {
  const [state, dispatch] = useReducer(
    minefieldReducer,
    makeMinefieldState(width, height)
  );

  return (
    <MinefieldContext.Provider value={[state, dispatch]}>
      {children}
    </MinefieldContext.Provider>
  );
}
