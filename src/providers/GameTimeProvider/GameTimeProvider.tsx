import { useEffect, useMemo, type PropsWithChildren } from "react";
import { useStopwatch } from "react-timer-hook";
import { useGameState } from "../GameStateProvider";
import { GameTimeContext } from "./context";

const SECONDS_IN_MINUTE = 60;

export default function GameTimeProvider({ children }: PropsWithChildren) {
  const [game] = useGameState();
  const { progress } = game;
  const { totalSeconds, start, pause, reset } = useStopwatch();

  useEffect(() => {
    switch (progress) {
      case "idle":
        reset(new Date(), false);
        break;
      case "started":
        start();
        break;
      case "lose":
      case "win":
        pause();
        break;
    }
  }, [progress, reset, start, pause]);

  const minutes = Math.floor(totalSeconds / SECONDS_IN_MINUTE);
  const seconds = totalSeconds % SECONDS_IN_MINUTE;

  const value = useMemo(() => {
    return { totalSeconds, minutes, seconds };
  }, [totalSeconds, minutes, seconds]);

  return (
    <GameTimeContext.Provider value={value}>
      {children}
    </GameTimeContext.Provider>
  );
}
