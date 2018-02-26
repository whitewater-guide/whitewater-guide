const { execFile } = require('child_process');

execFile('./bin/norway', ['harvest', '--code=213.4', '--html'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  const result = JSON.parse(stdout)
  console.log(JSON.stringify(result, null, 2))
  // console.log(result.success, result.data.length)
});



