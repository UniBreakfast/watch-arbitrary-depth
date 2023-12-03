# watch-arbitrary-depth
A Node.js function (with a composition of six more) to watch for a deeply placed file to change and to pass it's content to a callback. Any part of the path to the file can disappear and reappear at any given moment.

![image](https://github.com/UniBreakfast/watch-arbitrary-depth/assets/19654456/9c67bf71-3733-49c7-a5d3-f1d74faa7928)

### Description

This function is used to watch files for changes. It is specifically designed to persistently watch files that are not necessarily present at any given time, but are created and deleted at runtime, as well as their parent folders. In this repo it is used by the FileHandle class to watch the file that stores the last id generated.

It takes a file path and a callback function as arguments. The callback function will be called with the content of the file every time the file is changed (created, updated or deleted) from within the application or from outside (by another process or manually).

If the file is deleted, the callback function will be called with null and the function will continue to work normally.

If the file is created, the callback function will be called with the content of the file and the function will continue to work normally.

### Usage

```js
const { watchFile } = require('./watch-arbitrary-depth.js');

watchFile('path/to/folder/some-file.txt', content => {
  // content will be passed here every time the file is changed (created, updated or deleted) 
});
```

## Dependencies

`debounce()` function and other functions with more narrow purpose are used by this function. As well as `fs.promises.watch()`, `fs.promises.access()` and `fs.promises.readFile()`.

```js
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
```

## License

MIT
