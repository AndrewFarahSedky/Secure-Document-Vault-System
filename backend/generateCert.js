const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Create certs folder if it doesn't exist
const certsDir = path.join(__dirname, 'certs');

if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

// Generate self-signed SSL certificate using OpenSSL
const result = spawnSync('openssl', [
  'req',
  '-x509',
  '-newkey',
  'rsa:2048',
  '-keyout',
  'certs/key.pem',
  '-out',
  'certs/cert.pem',
  '-days',
  '365',
  '-nodes',
  '-subj',
  '/CN=localhost'
], {
  stdio: 'inherit'
});

// Check for errors
if (result.error) {
  console.error('❌ OpenSSL is not installed or not found in PATH');
  console.error(result.error.message);
} else {
  console.log('✅ SSL Certificate generated successfully!');
  console.log('📁 Files created:');
  console.log('   - certs/key.pem');
  console.log('   - certs/cert.pem');
}