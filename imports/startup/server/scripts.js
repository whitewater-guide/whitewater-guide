import fs from 'fs';
import path from 'path';

ServerScripts = {
  listScripts: function(){
    const dir = path.resolve(process.cwd(), 'assets/app/workers');
    const workerFiles = fs.readdirSync(dir);
    return workerFiles.map( file => file.split('.')[0])
  }
}