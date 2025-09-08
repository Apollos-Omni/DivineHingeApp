interface NotificationPayload {
  userId: string;
  title: string;
  body: string;
}

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  // TODO: Integrate Firebase Cloud Messaging or OneSignal push API here
  console.log(`Notify user ${payload.userId}: ${payload.title} - ${payload.body}`);
}
// Placeholder for notificationService.ts
