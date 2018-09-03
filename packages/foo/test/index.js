import test from 'asia'; // eslint-disable-line import/no-extraneous-dependencies
import foo from '../src/index';

test('foo test', (t) => {
  t.ok(foo('zzz'));
  console.log('foorr');
});
