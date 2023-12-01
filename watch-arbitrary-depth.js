module.exports = watchFile;

const {
  promises: { watch, access, readFile },
  constants: { F_OK },
} = require('fs');
const { dirname, basename } = require('path');

function watchFile(filePath, contentCallback) {
  const pathDict = pathToDict(filePath);
  const debounceCallback = debounce(contentCallback, 300);
  const setWatcher = prepToWatch(pathDict, debounceCallback);

  setWatcher(true);
}

function prepToWatch(pathDict, cb) {
  return async function setWatcher(first) {
    for (const path in pathDict) {
      try {
        await access(path, F_OK);

        const name = pathDict[path];
        const watcher = watch(path);

        try {
          name
            ? await forFolder(watcher, name)
            : await forFile(watcher, cb, path, first);
        } catch (err) {
          if (!name) cb(null);

          setWatcher();
        }

        return;
      } catch { }
    }
  }
}

async function forFolder(watcher, name) {
  for await (const e of watcher)
    if (e.filename == name) throw F_OK;
}

async function forFile(watcher, cb, path, first) {
  let lastContent = await readTrimmed(path);

  if (!first) cb(lastContent);

  for await (const _ of watcher) {
    const content = await readTrimmed(path);

    if (content != lastContent) {
      lastContent = content;
      cb(content);
    }
  }
}

async function readTrimmed(path) {
  return (await readFile(path, 'utf8')).trim();
}

function debounce(fn, delay) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      fn(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
  };
}

function pathToDict(path) {
  const pathDict = {};
  let nextEnt = null;

  while (path != '.') {
    pathDict[path] = nextEnt;
    nextEnt = basename(path);
    path = dirname(path);
  }

  pathDict[path] = nextEnt;

  return pathDict;
}

// watchFile('a/b/c/d.e', console.log); // test
