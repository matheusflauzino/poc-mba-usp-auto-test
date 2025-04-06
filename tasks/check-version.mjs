import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

const getPackageVersion = () => {
  return JSON.parse(readFileSync('./package.json')).version;
};

dotenv.config({ path: './tests/api/.env' });

const serverUrl = process.env.API_URL;

if (!serverUrl) {
  throw new Error('Please set env variable API_URL');
}

const serverResponse = await (await fetch(`${serverUrl}/healthcheck`)).json();

console.log('Server version: ', serverResponse.version);
console.log('Packge.json version: ', getPackageVersion());

if (serverResponse.version !== getPackageVersion()) {
  throw new Error('Server version mismatch. Please wait for deploy');
}
