// src/utils/time.ts
export const getCurrentTimestamp = (): number => Date.now();

export const formatTimestamp = (timestamp: number): string =>
  new Date(timestamp).toLocaleString();

export const timeAgo = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0) return `${days} day(s) ago`;
  if (hours > 0) return `${hours} hour(s) ago`;
  if (minutes > 0) return `${minutes} minute(s) ago`;
  return `${seconds} second(s) ago`;
};
