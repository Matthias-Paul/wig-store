import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseApp } from "./firebase";

export async function requestPushToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return null;
    }

    // Register, then explicitly wait until it's actually active
    await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    const registration = await navigator.serviceWorker.ready;

    const messaging = getMessaging(firebaseApp);

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    return token ?? null;
  } catch (error) {
    console.error("Failed to get push token", error);
    return null;
  }
}

export function listenForForegroundMessages(
  onMessageReceived: (title: string, body: string) => void,
) {
  if (typeof window === "undefined") return;

  const messaging = getMessaging(firebaseApp);

  onMessage(messaging, (payload) => {
    onMessageReceived(
      payload.notification?.title ?? "",
      payload.notification?.body ?? "",
    );
  });
}
