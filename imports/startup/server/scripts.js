import fs from 'fs';
import path from 'path';
import child_process from 'child_process';

ServerScripts = {
  listScripts: function(){
    const dir = path.resolve(process.cwd(), 'assets/app/workers');
    const workerFiles = fs.readdirSync(dir);
    return workerFiles.map( file => file.split('.')[0])
  },

  launchScript: function(script, mode, cb){
    const file = path.resolve(process.cwd(), 'assets/app/workers', `${script}.js`);
    const child = child_process.fork(file, [mode]);
    let response = [];
    
    child.on('close', (code) => {
      if (code === 0){
        cb(undefined, response);
      }
      else {
        cb(response);
      }
    });

    child.on('message', (data) => {
      response = data;
    });
  },
}