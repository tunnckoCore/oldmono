import test from 'asia'; // eslint-disable-line import/no-extraneous-dependencies
import qux from '../src/index';

test('qux test', (t) => {
  t.ok(qux(10));
  console.log('quxrr');
});
