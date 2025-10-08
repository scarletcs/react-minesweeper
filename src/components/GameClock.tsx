import { useEffect } from "react";
import { useGameState } from "../providers/GameStateProvider";
import { useStopwatch } from "react-timer-hook";

const SECONDS_IN_MINUTE = 60;

export default function GameClock() {
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

  return (
    <div>
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
}
