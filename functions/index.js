// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const database = admin.database()


exports.messagesComing = functions.database.ref('/chatrooms/{chatroomID}/messages/{messageID}').onCreate(event => {
    const chatroomID = event.params.chatroomID;
    const messageID = event.params.messageID;
    const message = event.data.val();

    console.log("***** data is coming *****");
    console.log(chatroomID);
    console.log(messageID);
    console.log(message);

    firebase.database.ref('users').orderByChild('chatrooms/'+chatroomID).isEqual(true).on("child_added", function(snapshot) {
      const user = snapshot.val();
      if (snapshot.key() == message.senderID) {
        return;
      }
      const fcmToken = user.data.fcmtoken;
        console.log("***** fcm is coming *****");
        console.log(fcmToken);
        sendMessageNotification(message, fcmToken)
    });
});


function sendMessageNotification(message, fcmToken){
    const payload = {
        notification: {
        title : message.senderName,
        body : message.text,
        badge: "0"
    }};
    admin.messaging().sendToDevice(fcmToken, payload)
  }
