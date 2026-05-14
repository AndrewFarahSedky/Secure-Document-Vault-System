const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Document = require('../models/Document');
const { encryptFile, decryptFile, generateHash, signHash, verifySignature } = require('../services/encryptionService');
const { getKeys } = require('../services/keyService');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Upload document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { privateKey } = getKeys();
    const tempPath = req.file.path;
    const storedName = crypto.randomUUID() + '.enc';
    const encryptedPath = path.join(UPLOADS_DIR, storedName);

    const hash = generateHash(tempPath);
    const signature = signHash(hash, privateKey);

    await encryptFile(tempPath, encryptedPath);
    fs.unlinkSync(tempPath);

    const doc = await Document.create({
      user_id: req.user.id,
      original_name: req.file.originalname,
      stored_name: storedName,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      hash,
      signature,
    });

    res.status(201).json({ message: 'Document uploaded successfully', document: doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user documents
exports.getDocuments = async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { user_id: req.user.id };
    const docs = await Document.findAll({ where });
    res.json({ documents: docs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Download document
exports.downloadDocument = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (req.user.role === 'user' && doc.user_id !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    const encryptedPath = path.join(UPLOADS_DIR, doc.stored_name);
    const tempPath = path.join(UPLOADS_DIR, 'temp_' + doc.original_name);

    await decryptFile(encryptedPath, tempPath);
    res.download(tempPath, doc.original_name, () => {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    if (req.user.role === 'user' && doc.user_id !== req.user.id)
      return res.status(403).json({ message: 'Access denied' });

    const encryptedPath = path.join(UPLOADS_DIR, doc.stored_name);
    if (fs.existsSync(encryptedPath)) fs.unlinkSync(encryptedPath);
    await doc.destroy();

    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify document integrity
exports.verifyDocument = async (req, res) => {
  try {
    const doc = await Document.findByPk(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const { publicKey } = getKeys();
    const encryptedPath = path.join(UPLOADS_DIR, doc.stored_name);
    const tempPath = path.join(UPLOADS_DIR, 'verify_' + doc.original_name);

    await decryptFile(encryptedPath, tempPath);
    const currentHash = generateHash(tempPath);
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

    const hashMatch = currentHash === doc.hash;
    const signatureValid = verifySignature(doc.hash, doc.signature, publicKey);

    res.json({
      verified: hashMatch && signatureValid,
      hashMatch,
      signatureValid,
      originalHash: doc.hash,
      currentHash,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};