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
    // console.log("***** messages onCreate *****");
    // console.log("Chatroom ID: "+chatroomID);
    // console.log("Message ID: "+messageID);
    // console.log(message);

    database.ref('users').orderByChild('chatrooms/'+chatroomID).equalTo(true).once('value', function(snapshot) {
      snapshot.forEach(function(userSnapshot) {
        const userID = userSnapshot.key;
        const userData = userSnapshot.val().data;
        if (userID != message.senderID && userData.hasOwnProperty('fcmtoken')) {
          let token = userData.fcmtoken;
          sendMessageNotification(message, token);
        }
      });
    });
});


function sendMessageNotification(message, fcmToken){
    const payload = {
      notification: {
        title: message.senderName,
        body: message.text,
        sound: "activated",
        badge: "0"
      }
    };
    console.log(payload);
    admin.messaging().sendToDevice(fcmToken, payload)
      .then(function (response) {
        console.log('Successfully sent message:', response);
      })
      .catch(function (error) {
          console.log('Error sending message:', error);
      });
  }
