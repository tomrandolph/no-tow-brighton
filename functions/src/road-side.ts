import * as moment from 'moment';
import 'moment-timezone';

export const sweepSidesOfStreet = ['our', 'the other', 'neither'];

export const parkSidesOfStreet = ['the other', 'our', 'either'];

export const getSideOfStreet = (date: any = null, day: string = 'Friday') => {
  const now = date ? date : moment().tz('America/New_York');
  console.log('Today:', now.format('MMMM Do YYYY, h:mm:ss a'));
  const tomorrow = now.add(1, 'days');
  if (tomorrow.format('dddd') !== day) {
    console.error('Tomorrow:', tomorrow.format('dddd'));
    throw new Error(`Tomorrow is not ${day}`);
  }
  const dayOfMonth = tomorrow.date() - 1;
  const dayInstances = Math.floor(dayOfMonth / 7);
  switch (dayInstances) {
    case 0:
    case 2:
      return 1;
    case 1:
    case 3:
      return 0;
    case 4:
      return 2;
    default:
      throw new Error('Invalid Date Received');
  }
};

export const getMessage = (date: any = null, day: string = 'Friday') => {
  const sideOfStreet = getSideOfStreet(date, day);
  return `Tomorrow they will be sweeping ${sweepSidesOfStreet[sideOfStreet]} side of the street.
  Park on ${parkSidesOfStreet[sideOfStreet]} side of the street.`;
};
