import { getMessage } from './road-side';
import * as moment from 'moment';

// 'Oct, 2019',
test('Oct 1, 2019', () => {
  expect(getMessage(moment('2019-10-31')))
    .toBe(`Tomorrow they will be sweeping the other side of the street.
  Park on our side of the street.`);
});
// 'Nov 8, 2019',
test('Nov 8, 2019', () => {
  expect(getMessage(moment('2019-11-07')))
    .toBe(`Tomorrow they will be sweeping our side of the street.
  Park on the other side of the street.`);
});
// 'Nov 15, 2019',
test('Nov 15, 2019', () => {
  expect(getMessage(moment('2019-11-14')))
    .toBe(`Tomorrow they will be sweeping the other side of the street.
  Park on our side of the street.`);
});
// 'Nov 22, 2029',
test('Nov 21, 2019', () => {
  expect(getMessage(moment('2019-11-21')))
    .toBe(`Tomorrow they will be sweeping our side of the street.
  Park on the other side of the street.`);
});

// 'Nov 29, 2019',
test('Nov 29, 2019', () => {
  expect(getMessage(moment('2019-11-28')))
    .toBe(`Tomorrow they will be sweeping neither side of the street.
  Park on either side of the street.`);
});

// 'Nov 5, 2019',
test('Nov 5, 2019', () => {
  expect(getMessage(moment('2019-11-04'), 'Tuesday'))
    .toBe(`Tomorrow they will be sweeping the other side of the street.
  Park on our side of the street.`);
});
