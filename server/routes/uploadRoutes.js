const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Files will be saved in 'backend/uploads'
  },
  filename(req, file, cb) {
    // Naming: fieldname-timestamp.extension
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter (Images only)
const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpg, jpeg, png, webp)'));
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Upload endpoint
router.post('/', upload.single('image'), (req, res) => {
  if (req.file) {
    // Return the path that the frontend can use to access the image
    // Note: We replace backslashes for Windows compatibility
    res.send(`/${req.file.path.replace(/\\/g, '/')}`); 
  } else {
    res.status(400).send('No file uploaded');
  }
});

module.exports = router;