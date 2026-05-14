const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const documentController = require('../controllers/documentController');
const { authenticate } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../uploads/temp'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('File type not allowed'));
  },
});

router.post('/upload', authenticate, upload.single('document'), documentController.uploadDocument);
router.get('/', authenticate, documentController.getDocuments);
router.get('/download/:id', authenticate, documentController.downloadDocument);
router.delete('/:id', authenticate, documentController.deleteDocument);
router.get('/verify/:id', authenticate, documentController.verifyDocument);

module.exports = router;