const crypto = require('crypto');
const fs = require('fs');
require('dotenv').config();

const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');

// Encrypt file
function encryptFile(inputPath, outputPath) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const input = fs.createReadStream(inputPath);
  const output = fs.createWriteStream(outputPath);

  return new Promise((resolve, reject) => {
    output.write(iv);
    input.pipe(cipher).pipe(output);
    output.on('finish', resolve);
    output.on('error', reject);
  });
}

// Decrypt file
function decryptFile(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const input = fs.createReadStream(inputPath);
    const chunks = [];
    input.on('data', chunk => chunks.push(chunk));
    input.on('end', () => {
      const data = Buffer.concat(chunks);
      const iv = data.slice(0, 16);
      const encrypted = data.slice(16);
      const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
      fs.writeFileSync(outputPath, decrypted);
      resolve();
    });
    input.on('error', reject);
  });
}

// Generate SHA-256 hash
function generateHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

// Generate key pair for signing (run once, store keys)
function generateKeyPair() {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
}

// Sign hash
function signHash(hash, privateKey) {
  const sign = crypto.createSign('SHA256');
  sign.update(hash);
  return sign.sign(privateKey, 'hex');
}

// Verify signature
function verifySignature(hash, signature, publicKey) {
  const verify = crypto.createVerify('SHA256');
  verify.update(hash);
  return verify.verify(publicKey, signature, 'hex');
}

module.exports = { encryptFile, decryptFile, generateHash, generateKeyPair, signHash, verifySignature };