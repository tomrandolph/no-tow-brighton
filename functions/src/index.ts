import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import twilioClient from './twilio-client';
import { getMessage } from './road-side';
import * as moment from 'moment';

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

const msgLevel = {
  NORMAL: 0,
  DEBUG: 1
};

const sendTextToAllRecipients = async (
  message: string,
  level: number = msgLevel.NORMAL
) => {
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
    .where('level', '>=', level)
    .get()
    .then(snapshot => snapshot.docs.map(doc => <SMSRecipient>doc.data()));
  console.log('recipients:', recipients);
  const promises = recipients.map(({ name, number }) =>
    sendMsg(number, sendNumber, `Hey ${name}. ${message}`)
  );
  return Promise.all(promises);
};

export const helloWorld = functions.https.onRequest(
  async (request, response) => {
    await sendTextToAllRecipients(
      getMessage(moment('2019-11-07')),
      msgLevel.DEBUG
    );
    response.send('Hello from Firebase!');
  }
);

export const noTow = functions.pubsub
  .schedule('every monday of november 9:00')
  .timeZone('America/New_York') // Users can choose timezone - default is America/Los_Angeles
  .onRun(async context => {
    await sendTextToAllRecipients(getMessage(null, 'Tuesday'), msgLevel.DEBUG);
    return null;
  });
// export const scheduledFunction = functions.pubsub
//   .schedule('every 5 minutes')
//   .onRun(context => {
//     console.log('This will be run every 5 minutes!');
//     return null;
//   });
