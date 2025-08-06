const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const uploadRoute = require('./routes/uploadResult');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS pour permettre les requêtes depuis le dashboard React
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Middleware pour parser JSON
app.use(express.json());

// Routes existantes
app.use('/upload', uploadRoute);

// Fonction temporaire pour parser les données Snyk
const parseSnykReport = (data) => {
  const vulnerabilities = data.vulnerabilities || [];
  
  return {
    critical: vulnerabilities.filter(v => v.severity === 'critical').length,
    high: vulnerabilities.filter(v => v.severity === 'high').length,
    medium: vulnerabilities.filter(v => v.severity === 'medium').length,
    low: vulnerabilities.filter(v => v.severity === 'low').length,
    total: vulnerabilities.length
  };
};

// Fonction temporaire pour lire les rapports
const getReportsByType = (type) => {
  const reports = [];
  const folder = path.join(__dirname, '..', 'results', 'snyk');
  
  if (!fs.existsSync(folder)) {
    return reports;
  }

  try {
    const files = fs.readdirSync(folder);
    const typeFiles = files.filter(file => 
      file.startsWith(`${type}-project`) && file.endsWith('.json')
    );

    typeFiles.forEach(file => {
      try {
        const filePath = path.join(folder, file);
        const fileStats = fs.statSync(filePath);
        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);
        
        const vulnerabilityCounts = parseSnykReport(data);
        
        reports.push({
          type: type,
          date: fileStats.mtime.toISOString(),
          filename: file,
          repository: data.projectName || 'Unknown',
          ...vulnerabilityCounts
        });
      } catch (err) {
        console.error(`Erreur lors de la lecture du fichier ${file}:`, err);
      }
    });
  } catch (err) {
    console.error(`Erreur lors de la lecture du dossier ${type}:`, err);
  }

  return reports;
};

// Route temporaire pour /results
app.get('/results', (req, res) => {
  try {
    const allReports = [];
    
    // Lire les rapports de code
    const codeReports = getReportsByType('code');
    allReports.push(...codeReports);
    
    // Lire les rapports Docker
    const dockerReports = getReportsByType('docker');
    allReports.push(...dockerReports);
    
    // Trier par date (plus récent en premier)
    allReports.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(allReports);
  } catch (error) {
    console.error('Erreur lors de la récupération des rapports:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des rapports',
      message: error.message 
    });
  }
});

// Route temporaire pour /stats
app.get('/stats', (req, res) => {
  try {
    const allReports = [];
    allReports.push(...getReportsByType('code'));
    allReports.push(...getReportsByType('docker'));
    
    const stats = {
      totalReports: allReports.length,
      totalCritical: allReports.reduce((sum, r) => sum + r.critical, 0),
      totalHigh: allReports.reduce((sum, r) => sum + r.high, 0),
      totalMedium: allReports.reduce((sum, r) => sum + r.medium, 0),
      totalLow: allReports.reduce((sum, r) => sum + r.low, 0),
      cleanReports: allReports.filter(r => r.total === 0).length,
      lastScanDate: allReports.length > 0 ? 
        new Date(Math.max(...allReports.map(r => new Date(r.date)))).toISOString() : null
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
    res.status(500).json({ 
      error: 'Erreur lors du calcul des statistiques',
      message: error.message 
    });
  }
});

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Security Scanner API is running 👍',
    endpoints: {
      upload: {
        code: 'POST /upload/code',
        docker: 'POST /upload/docker'
      },
      results: {
        all: 'GET /results',
        stats: 'GET /stats'
      }
    },
    version: '1.0.0'
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('Erreur:', err.stack);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: err.message 
  });
});

// Middleware pour les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    availableEndpoints: ['/upload/code', '/upload/docker', '/results', '/stats']
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Security Scanner API running on port ${PORT}`);
  console.log(`📊 Dashboard endpoints available at http://localhost:${PORT}/results`);
  console.log(`📁 Upload endpoints available at http://localhost:${PORT}/upload/`);
});