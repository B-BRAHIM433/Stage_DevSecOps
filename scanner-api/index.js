const express = require('express');
const uploadRoute = require('./routes/uploadResult');
const app = express();
const PORT = process.env.PORT || 3001;

app.use('/upload', uploadRoute);

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
