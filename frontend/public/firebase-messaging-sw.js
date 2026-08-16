importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyB2huH_hkzd9pdXGMql-LAmIMCnTQPTU6Y",
  authDomain: "rocks-hairmpire.firebaseapp.com",
  projectId: "rocks-hairmpire",
  messagingSenderId: "899061583870",
  appId: "1:899061583870:web:6a017163df46a84000baaf",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const link = payload.data?.link || self.location.origin;

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "https://res.cloudinary.com/drkxtuaeg/image/upload/v1785842112/lxvaiiwhocdppargd5bc.jpg",
    badge:
      "https://res.cloudinary.com/drkxtuaeg/image/upload/v1785842112/lxvaiiwhocdppargd5bc.jpg",
    data: { link },
    actions: [{ action: "view", title: "View on Site" }],
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const link = event.notification.data?.link || self.location.origin;

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // If a tab is already open on the site, focus it and navigate there
        for (const client of windowClients) {
          if (
            client.url.startsWith(self.location.origin) &&
            "focus" in client
          ) {
            client.navigate(link);
            return client.focus();
          }
        }
        // Otherwise open a new tab
        return clients.openWindow(link);
      }),
  );
});