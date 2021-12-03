import fs from 'fs';

const cert = fs.readFileSync('src/config/localhost.crt');
const key = fs.readFileSync('src/config/localhost.pem');

export { cert, key };
