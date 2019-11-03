import * as client from 'twilio';

export default function(accountSid: string, authToken: string) {
  const { api } = client(accountSid, authToken);

  return (to: string, from: string, message: string) =>
    api.messages
      .create({
        to,
        from,
        body: message
      })
      .then(data => {
        console.log(data);
        console.log('Text Sent!');
      })
      .catch(err => {
        console.error('Could not send text');
        console.error(err);
      });
}
