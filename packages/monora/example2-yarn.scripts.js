const end = () => 'echo last-qux-allleluaaaah';

const qux = (scripts) => [scripts.qux, 'echo quxiee-zzzazy', end, scripts.ale];

exports.prelint = (scripts) => [scripts.test, 'echo hi', scripts.foo, qux];
exports.lint = 'echo linnnnnnnnnnnnt';
exports.ale = 'echo ale';

const after1 = 'echo after-lint';
const done = 'echo done';

exports.presets = 'esmc';
exports.preecho = 'echo pre-echo-woohoo';
exports.postlint = [after1, exports.ale, done];
