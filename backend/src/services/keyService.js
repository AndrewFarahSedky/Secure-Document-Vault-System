const fs = require('fs');
const path = require('path');
const { generateKeyPair } = require('./encryptionService');

const PRIVATE_KEY_PATH = path.join(__dirname, '../../certs/private.pem');
const PUBLIC_KEY_PATH = path.join(__dirname, '../../certs/public.pem');

function getKeys() {
  if (!fs.existsSync(PRIVATE_KEY_PATH) || !fs.existsSync(PUBLIC_KEY_PATH)) {
    const { privateKey, publicKey } = generateKeyPair();
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey);
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);
  }
  return {
    privateKey: fs.readFileSync(PRIVATE_KEY_PATH, 'utf8'),
    publicKey: fs.readFileSync(PUBLIC_KEY_PATH, 'utf8'),
  };
}

module.exports = { getKeys };