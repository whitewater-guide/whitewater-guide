console.log(__dirname);
const { qs } = require('url-parse');

console.log(qs.stringify({ foo: 'bar', baz: null, yyyy: undefined }));
