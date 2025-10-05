import { useState, type PropsWithChildren } from "react";
import { makeMinefield } from "../../types/minefield";
import { MinefieldContext } from "./context";

type Props = PropsWithChildren & {
  width?: number;
  height?: number;
};

export function MinefieldProvider({ children, width = 3, height = 3 }: Props) {
  const [minefield] = useState(() => {
    const minefield = makeMinefield(width, height);
    return minefield;
  });

  return (
    <MinefieldContext.Provider value={minefield}>
      {children}
    </MinefieldContext.Provider>
  );
}
