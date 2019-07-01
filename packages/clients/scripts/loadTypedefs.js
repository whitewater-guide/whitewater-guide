const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const typedefsPath =
  process.argv.length > 2 ? process.argv[2] : 'src/test/typedefs.ts';

function copyLocalDefs() {
  const schemaPath = path.resolve(
    '../../services/backend/',
    'merged-schema.graphql',
  );
  const exists = fs.existsSync(schemaPath);
  if (exists) {
    const stream = fs.createReadStream(schemaPath);
    saveTypedefs(stream);
    return true;
  }
  return false;
}

function saveTypedefs(response) {
  const writer = fs.createWriteStream(path.resolve(typedefsPath));
  writer.write('/* tslint:disable */\n');
  writer.write(
    '// this file contains GRAPHQL typedefs and it was automatically downloaded from server\n',
  );
  writer.write('const typeDefs = `');
  response.on('data', function(chunk) {
    writer.write(chunk);
  });
  response.on('end', function() {
    writer.end('`;\n\nexport default typeDefs;\n');
  });
}

function fetch(url, successCallback, errorCallback) {
  const protocol = url.startsWith('https') ? https : http;
  const req = protocol.get(url, function(response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      successCallback(response);
    } else {
      errorCallback(`Failed to fetch ${url}: ${response.statusCode}`);
    }
  });
  req.on('error', (e) => {
    errorCallback(`Failed to fetch ${url}: ${e.message}`);
  });
}

if (!copyLocalDefs()) {
  fetch('http://localhost:3333/graphql/typedefs.txt', saveTypedefs, () => {
    fetch(
      'https://beta.whitewater.guide/graphql/typedefs.txt',
      saveTypedefs,
      console.error,
    );
  });
}
