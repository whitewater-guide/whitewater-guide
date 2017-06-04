import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

export function listScripts(){
  const dir = path.resolve(process.cwd(), 'assets/app/workers');
  const workerFiles = fs.readdirSync(dir);
  const scripts = [];
  workerFiles.forEach( file => {
    const filename = file.split('.')[0];
    //Ask script to describe itself
    const response = child_process.spawnSync('node', [path.resolve(dir, file), 'describe'], {timeout: 1000});
    if (response.status === 0){
      try {
        const result = JSON.parse(response.stdout);
        scripts.push({script: filename, ...result});
      }
      catch (error){
        let descr = `Script ${filename} could not describe itself: ${error}`;
        console.error(descr);
        scripts.push({script: filename, error: descr});
      }
    }
    else {
      let descr = `Script ${filename} failed with status ${response.status} and error: ${response.stderr}`;
      console.error(descr);
      scripts.push({script: filename, error: descr});
    }
  });
  return scripts;
}

export function launchScript(script, mode, cb){
  const file = path.resolve(process.cwd(), 'assets/app/workers', `${script}.js`);
  const child = child_process.fork(file, [mode], {execArgv: ['--expose-gc']});
  let response = [];

  child.on('exit', (code, signal) => {
    if (code === 0){
      cb(undefined, response);
    }
    else {
      console.error(`Script ${script}/${mode} failed with error code ${code} and signal ${signal}. Response was ${response}`);
      cb(response);
    }
  });

  child.on('message', (data) => {
    response = data;
  });
}
