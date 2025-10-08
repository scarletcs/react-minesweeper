import { useGameTime } from "../providers/GameTimeProvider/context";

export default function GameClock() {
  const { minutes, seconds } = useGameTime();

  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");

  return (
    <div>
      {mm}:{ss}
    </div>
  );
}
