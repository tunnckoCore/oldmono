import path from 'path';
import proc from 'process';
import { shell } from 'execa-pro';

const ENV = Object.assign({}, proc.env);

export default async function monora(argv = proc.argv.slice(2), options) {
  const { cwd, tasks, manager } = Object.assign({ cwd: proc.cwd() }, options);

  const pkgPath = resolve(cwd, 'package.json');
  const pkg = await import(pkgPath);

  const config = await loadConfig(cwd, manager);

  let scripts = Object.assign({}, pkg.scripts, pkg.monora, tasks, config);

  const cfgPresets = scripts.presets || scripts.preset;

  if (cfgPresets) {
    scripts = Object.assign({}, scripts, await import(cfgPresets));
  }

  const cwdNodeBin = resolve(cwd, 'node_modules', '.bin');
  const upperNodeBin = resolve(cwd, '..', '..', 'node_modules', '.bin');

  let env = Object.assign({}, ENV);

  if (!ENV.PATH.includes(cwdNodeBin)) {
    env = Object.assign({}, env, { PATH: `${cwdNodeBin}:${proc.env.PATH}` });
  }

  // we are in monorepo package cwd
  // otherwise we are in monorepo root
  if (pkg.private !== true && !ENV.PATH.includes(upperNodeBin)) {
    env = Object.assign({}, env, { PATH: `${upperNodeBin}:${proc.env.PATH}` });
  }

  const commands = normalizer(scripts, argv);
  // console.log(commands);
  return shell(commands, { env, stdio: 'inherit' });
}

function resolve(...args) {
  return path.resolve(path.join(...args));
}

async function loadConfig(cwd, mngr = 'monora') {
  const config =
    (await tryCatch(() => import(resolve(cwd, 'monora.config.js')))) ||
    (await tryCatch(() => import(resolve(cwd, `${mngr}.scripts.js`)))) ||
    (await tryCatch(() => import(resolve('..', '..', 'monora.config.js')))) ||
    (await tryCatch(() => import(resolve('..', '..', `${mngr}.scripts.js`))));

  return config;
}

async function tryCatch(fn) {
  let val = null;

  try {
    val = await fn();
  } catch (err) {
    return null;
  }
  return val;
}

function normalizer(scripts, argv) {
  const name = argv.shift();
  const pre = scripts[`pre${name}`];
  const cmd = scripts[name];
  const post = scripts[`post${name}`];
  const stringify = (x) => [x].concat(argv).join(' ');

  /**
   * Pretty handy. The hooks works both for the package.json scripts
   * and for installed bin executables.
   * For example: you have installed eslint.
   * Run `monora eslint` and it will run `preeslint` hook task,
   * the eslint cli, and `posteslint` task hook (e.g. defined in npm.scripts.js)
   */

  return (
    [pre, cmd || stringify(name), post]
      .filter(Boolean)
      .reduce(function reducer(acc, script) {
        if (typeof script === 'string') {
          return acc.concat(script);
        }
        if (Array.isArray(script)) {
          return script.reduce(reducer, acc);
        }
        if (typeof script === 'function') {
          const result = script(scripts, argv);

          if (typeof result === 'string') {
            return acc.concat(result);
          }
          if (Array.isArray(result)) {
            return result.reduce(reducer, acc);
          }
        }
        return acc;
      }, [])
      .filter(Boolean)
      // append argv/args & flags, only if not a hook (pre, post)
      .map((x) => (cmd ? stringify(x) : x))
  );
}

// A bit more complex and featureful
// .reduce(function reducer(promise, script) {
//   return promise.then(async (acc) => {
//     if (typeof script === 'string') {
//       return shell(script, options);
//     }
//     if (Array.isArray(script)) {
//       return script.reduce(
//         (x, val) => reducer(x, val),
//         Promise.resolve(acc),
//       );
//     }
//     if (typeof script === 'function') {
//       const result = await script(scripts, argv);

//       if (typeof result === 'string') {
//         return shell(result, options);
//       }
//       return reducer(Promise.resolve(acc), result);
//     }
//     return acc;
//   });
// }, Promise.resolve([]));
