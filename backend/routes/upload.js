const express = require('express');
const multer = require('multer');
const { PythonShell } = require('python-shell');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dohfbsepn/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'AroraOpticals'; // Set this in your Cloudinary dashboard.
const CLOUDINARY_DELETE_URL = 'https://api.cloudinary.com/v1_1/dohfbsepn/image/destroy';
const CLOUDINARY_API_SECRET = "mGc4mgrnhkCrBuvXaN2vFnt5f_s";
const CLOUDINARY_API_KEY = '192436767777992';

cloudinary.config({
  cloud_name: 'dohfbsepn',
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'CancerDetectionSystem'
      });
      
      console.log("✅ Image uploaded to cloudinary");
  
      const outputLines = [];
  
      const shell = new PythonShell('python/segment.py', {
        args: [uploadResult.secure_url]
      });
  
      shell.on('message', function (message) {
        console.log('🐍 Python stdout:', message);
        outputLines.push(message);
      });
  
      shell.on('stderr', function (stderr) {
        console.error('🐍 Python stderr:', stderr);
      });
  
      shell.end((err, code, signal) => {
        fs.unlinkSync(req.file.path);
        console.log("🗑️ Deleted local uploaded image");
  
        if (err) {
          console.error('❌ Python script failed:', err);
          return res.status(500).json({ error: 'Python script failed' });
        }
  
        const maskUrl = outputLines.find(line => line.startsWith('http'));
        if (!maskUrl) {
          return res.status(500).json({ error: 'No URL returned from Python' });
        }
  
        console.log('✅ Final mask URL:', maskUrl);
        res.json({ maskUrl });
      });
  
    } catch (err) {
      console.error('❌ Upload route failed:', err);
      res.status(500).json({ error: 'Unexpected server error' });
    }
  });

module.exports = router;
