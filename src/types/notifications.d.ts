export interface Notification {
  id: string;
  userId: string;
  type: "karma" | "system" | "match" | "vision";
  message: string;
  read: boolean;
  timestamp: number;
} // Placeholder for notifications.d.ts
