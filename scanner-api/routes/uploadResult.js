const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const saveReport = (type, data) => {
  const folder = path.join(__dirname, '..', 'results', type);
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  const filename = `report-${new Date().toISOString()}.json`;
  fs.writeFileSync(path.join(folder, filename), JSON.stringify(data, null, 2));
};

router.post('/code', express.json(), (req, res) => {
  saveReport('code', req.body);
  res.json({ message: 'Code report saved' });
});

router.post('/docker', express.json(), (req, res) => {
  saveReport('docker', req.body);
  res.json({ message: 'Docker report saved' });
});

module.exports = router;
