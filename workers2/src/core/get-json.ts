const http = require('http');

export const getJson = (url: string) =>
  new Promise((resolve, reject) => {
    http.get(url, (res: any) => {
      if (res.statusCode !== 200) {
        reject(`Request failed. Status code: ${res.statusCode}`);
      }
      res.setEncoding('utf8');
      let body = '';
      res.on('data', (data: any) => {
        body += data;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject('Failed to parse json');
        }
      });
    })
      .on('error', (e: any) => reject(e));
  });
