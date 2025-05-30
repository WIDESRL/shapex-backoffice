import { messaging } from './firebaseConfig';
import { getToken, onMessage, deleteToken } from 'firebase/messaging';

export const requestNotificationPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: 'BD4mb-zjr5a-XqLdEadzGe1pGpXTU-7WMxgJZCiU_b5ZvlF3SUWbDy6gRqNcPWFf3ah5RL8I1W4RiIdKPTAT2uI',
    });
    if (token) {
      return token
      // Send this token to your server to send notifications
    } else {
      console.log('No registration token available.');
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
};

export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    // Handle the notification payload
  });
};

export const stopPushNotifications = async () => {
  try {
    const success = await deleteToken(messaging);
    if (success) {
      console.log('Push notifications stopped and FCM token deleted.');
    } else {
      console.log('No FCM token found to delete.');
    }
  } catch (error) {
    console.error('Error stopping push notifications:', error);
  }
};
