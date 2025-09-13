declare const process: { env: Record<string, string | undefined> };

// src/types/global.d.ts
export {};

type InputMap = Record<string, boolean>;

declare global {
  // eslint-disable-next-line no-var
  var input: InputMap | undefined;
}
