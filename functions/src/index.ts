import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import twilioClient from './twilio-client';

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const configRef = db.collection('config');
const recipientsRef = db.collection('recipients');

interface TwilioConfig {
  accountSID: string;
  authToken: string;
  sendNumber: string;
}
interface SMSRecipient {
  name: string;
  number: string;
}

// const sendText = async () => {
//   const twilio = await configRef
//     .doc('twilio')
//     .get()
//     .then(doc => {
//       if (!doc.exists) {
//         throw new Error('Twilion config does not exist!');
//       }
//       console.log('Data', doc.data());
//       return doc.data();
//     })
//     .catch(err => {
//       console.error('Error getting document', err);
//     });

//   const { accountSID, authToken, sendNumber } = <TwilioConfig>twilio;
//   const sendMsg = twilioClient(accountSID, authToken);
//   return sendMsg('+14138221200', sendNumber, 'Hey, this came from Twilio');
// };

const sendTextToAllRecipients = async () => {
  const twilio = await configRef
    .doc('twilio')
    .get()
    .then(doc => {
      if (!doc.exists) {
        throw new Error('Twilion config does not exist!');
      }
      console.log('Data', doc.data());
      return doc.data();
    })
    .catch(err => {
      console.error('Error getting document', err);
    });
  const { accountSID, authToken, sendNumber } = <TwilioConfig>twilio;
  const sendMsg = twilioClient(accountSID, authToken);
  const recipients = await recipientsRef
    .get()
    .then(snapshot => snapshot.docs.map(doc => <SMSRecipient>doc.data()));
  const promises = recipients.map(({ name, number }) =>
    sendMsg(number, sendNumber, `Hey ${name}. A bot sent you this.`)
  );
  return Promise.all(promises);
};

export const helloWorld = functions.https.onRequest(
  async (request, response) => {
    await sendTextToAllRecipients();
    response.send('Hello from Firebase!');
  }
);

// export const scheduledFunctionCrontab = functions.pubsub
//   .schedule('every 2 minutes')
//   .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
//   .onRun(context => {
//     console.log('This will be run every day at 11:05 AM Eastern!');
//     return null;
//   });
// export const scheduledFunction = functions.pubsub
//   .schedule('every 5 minutes')
//   .onRun(context => {
//     console.log('This will be run every 5 minutes!');
//     return null;
//   });
