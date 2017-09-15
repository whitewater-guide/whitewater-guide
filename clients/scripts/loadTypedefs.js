const fs = require('fs')
const http = require('http');
const path = require('path')

const writer = fs.createWriteStream(path.resolve('src', 'test', 'typedefs.ts'));

http.get('http://localhost:3333/typedefs.txt', function(response) {
  writer.write('// this file contains GRAPHQL typedefs and it was automatically downloaded from server\n');
  writer.write('const typeDefs = `');
  response.on('data', function(chunk) {
    writer.write(chunk);
  });
  response.on('end', function() {
    writer.end('`;\n\nexport default typeDefs;\n');
  });
});
