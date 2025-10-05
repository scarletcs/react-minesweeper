export declare global {
  export type EnumValue<
    T extends Record<A, B>,
    A extends string | number | symbol = string,
    B extends string | number | symbol = string
  > = T[keyof T];
}
