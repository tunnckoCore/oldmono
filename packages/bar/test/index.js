import test from 'asia'; // eslint-disable-line import/no-extraneous-dependencies
import bar from '../src/index';

test('bar test', (t) => {
  t.ok(bar());
  console.log('barrr');
});
