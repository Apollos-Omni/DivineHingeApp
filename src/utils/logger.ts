// File: src/utils/logger.ts
export const logger = {
  info: (message: string, ...optionalParams: any[]) => {
    console.info(`[INFO]: ${message}`, ...optionalParams);
  },
  warn: (message: string, ...optionalParams: any[]) => {
    console.warn(`[WARN]: ${message}`, ...optionalParams);
  },
  error: (message: string, ...optionalParams: any[]) => {
    console.error(`[ERROR]: ${message}`, ...optionalParams);
  },
  debug: (message: string, ...optionalParams: any[]) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG]: ${message}`, ...optionalParams);
    }
  },
};

export const dbg = (label: string, data?: unknown) => {
  if (!__DEV__) return;
  // eslint-disable-next-line no-console
  console.log(`[DBG] ${label}`, data ?? "");
};

