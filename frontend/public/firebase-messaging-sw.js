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
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon.png",
  });
});
