import test from 'asia'; // eslint-disable-line import/no-extraneous-dependencies
import foo from '../src/index';

test('monora', async (t) => {
  t.ok(typeof foo === 'function');
  console.log('monora yxeah');

  // await foo();
  // t.ok(true, 'should not error');
});
