const express = require('express');
const cors = require('cors');
const app = express();

// Correct way to import the router
const uploadRoute = require('./routes/upload');

app.use(cors());
app.use(express.json());
app.use('/upload', uploadRoute); // ✅ using actual router function

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
