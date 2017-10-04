const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const database = admin.database()

exports.checkchat = functions.database.ref('/chatrooms/{ChatroomID}/members').onCreate(event => {
    const chatroomID = event.params.ChatroomID;
    const name = event.data.val();
    console.log("*************");
    console.log(chatroomID);
    console.log("------------");
    console.log(name);
})
