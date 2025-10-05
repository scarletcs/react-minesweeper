export type Vec2 = { x: number; y: number };

export abstract class VectorMath {
  static add(a: Vec2, b: Vec2) {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
    };
  }

  static subtract(a: Vec2, b: Vec2) {
    return {
      x: a.x - b.x,
      y: a.y - b.y,
    };
  }
}

export function stringifyVector(vec: Vec2) {
  return `[Vector (${vec.x}, ${vec.y})]`;
}
