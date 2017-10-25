// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const database = admin.database()


exports.messagesComing = functions.database.ref('/chatrooms/{chatroomID}/messages/').onUpdate(event => {
    const chatroomID = event.params.chatroomID;
    const message = event.data.val();

    console.log("***** data is coming *****");
    console.log(chatroomID);
    console.log(message);

    // database.ref('users').child('').child('data').child('fcmtoken').once('value', function(snapshot) {
    //database.ref('users').queryOrdered().queryEqual(true)
    firebase.database.ref().child('users').isEqual('chatrooms/'+chatroomID).once('value', function(snapshot) {
      const user = snapshot.val();
      if (snapshot.key() == message.senderID) {
        return;
      }
      const fcmToken = user.data.fcmtoken;
        console.log("***** fcm is coming *****");
        console.log(fcmToken);
        sendMessageNotification(message, fcmToken)
    });
})

function sendMessageNotification(message, fcmToken){
    const payload = {
        notification: {
        title : message.senderName,
        body : message.text,
        badge: "0"
    }};
    admin.messaging().sendToDevice(fcmToken, payload)
}
