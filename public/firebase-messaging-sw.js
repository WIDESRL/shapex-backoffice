importScripts("https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyA7EjUCATFjVHNysKPuOqsz5RxqpWo29KU",
    authDomain: "shapex-3ae86.firebaseapp.com",
    projectId: "shapex-3ae86",
    storageBucket: "shapex-3ae86.firebasestorage.app",
    messagingSenderId: "144836163870",
    appId: "1:144836163870:web:57d2d0ab6870468d72b10f",
    measurementId: "G-B7X0MY0RXK"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification?.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Background Message body.',
    // icon: '/firebase-logo.png', // optional
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});