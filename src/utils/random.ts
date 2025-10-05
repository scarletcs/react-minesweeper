import { v4 } from "uuid";

export abstract class Random {
  /** Get a random UUID. */
  static uuid() {
    return v4();
  }

  /**
   * Perform a Fisher-Yates shuffle on an array.
   *
   * Borrowed from https://stackoverflow.com/a/2450976.
   */
  static shuffle<T>(array: T[]): T[] {
    array = [...array];

    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
}
