const end = () => 'echo last-qux-allleluaaaah';

const qux = (scripts) => [scripts.qux, 'echo quxiee-zzzazy', end, scripts.ale];

export const prelint = (scripts) => [scripts.test, 'echo hi', scripts.foo, qux];
export const lint = 'echo linnnnnnnnnnnnt';
export const ale = 'echo ale';

const after1 = 'echo after-lint';
const done = 'echo done';

export const preecho = 'echo pre-echo-woohoo';
export const postlint = [after1, ale, done];

// `preset` and `presets` have special treatment,
// so don't use them as tasks
export const preset = 'monora-preset-tunnckocore';
