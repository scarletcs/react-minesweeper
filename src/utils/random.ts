import { v4 } from "uuid";

export abstract class Random {
  static uuid() {
    return v4();
  }
}
