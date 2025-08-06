import React, { useEffect, useState } from 'react';
// Note: Dans votre projet, gardez axios. Ici on utilise fetch pour la démo

function App() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReports();
    // Rafraîchissement automatique toutes les 30 secondes
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/results');
      const data = await response.json();
      setReports(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des rapports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity, count) => {
    if (count === 0) return '#e8f5e8';
    switch(severity) {
      case 'critical': return '#ffebee';
      case 'high': return '#fff3e0';
      case 'medium': return '#f3e5f5';
      default: return '#f5f5f5';
    }
  };

  const getTotalVulnerabilities = (report) => {
    return (report.critical || 0) + (report.high || 0) + (report.medium || 0);
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    if (filter === 'critical') return report.critical > 0;
    if (filter === 'high') return report.high > 0;
    if (filter === 'clean') return getTotalVulnerabilities(report) === 0;
    return report.type === filter;
  });

  const stats = {
    total: reports.length,
    critical: reports.reduce((sum, r) => sum + (r.critical || 0), 0),
    high: reports.reduce((sum, r) => sum + (r.high || 0), 0),
    medium: reports.reduce((sum, r) => sum + (r.medium || 0), 0),
    clean: reports.filter(r => getTotalVulnerabilities(r) === 0).length
  };

  if (loading && reports.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'sans-serif'
      }}>
        <div>Chargement des rapports de sécurité...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
          🛡️ Dashboard de Sécurité
        </h1>
        <p style={{ color: '#6c757d', margin: 0 }}>
          Surveillance en temps réel des vulnérabilités
        </p>
      </header>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          border: '1px solid #f5c6cb'
        }}>
          {error}
          <button 
            onClick={fetchReports}
            style={{
              marginLeft: '1rem',
              padding: '0.25rem 0.5rem',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Statistiques globales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Total Scans</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>
            {stats.total}
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Critiques</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>
            {stats.critical}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Élevées</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>
            {stats.high}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Moyennes</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f1c40f' }}>
            {stats.medium}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Sains</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>
            {stats.clean}
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div style={{
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>Filtres</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Tous', color: '#6c757d' },
            { key: 'critical', label: 'Critiques', color: '#e74c3c' },
            { key: 'high', label: 'Élevées', color: '#f39c12' },
            { key: 'clean', label: 'Sains', color: '#27ae60' },
            { key: 'code', label: 'Code', color: '#3498db' },
            { key: 'docker', label: 'Docker', color: '#2980b9' }
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: filter === key ? color : 'white',
                color: filter === key ? 'white' : color,
                border: `1px solid ${color}`,
                borderRadius: '0.25rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des rapports */}
      <div style={{
        display: 'grid',
        gap: '1rem'
      }}>
        {filteredReports.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center',
            color: '#6c757d'
          }}>
            Aucun rapport trouvé pour ce filtre
          </div>
        ) : (
          filteredReports
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((report, index) => {
              const totalVulns = getTotalVulnerabilities(report);
              const isClean = totalVulns === 0;
              
              return (
                <div 
                  key={index} 
                  style={{
                    backgroundColor: 'white',
                    border: `2px solid ${isClean ? '#27ae60' : '#e74c3c'}`,
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <h3 style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: '#2c3e50',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        {report.type === 'code' ? '💻' : '🐳'} 
                        Scan {report.type === 'code' ? 'Code' : 'Docker'}
                        {isClean && <span style={{ color: '#27ae60' }}>✅</span>}
                      </h3>
                      <p style={{ 
                        margin: 0, 
                        color: '#6c757d',
                        fontSize: '0.875rem'
                      }}>
                        📅 {new Date(report.date).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: isClean ? '#27ae60' : '#e74c3c'
                    }}>
                      {totalVulns} vuln{totalVulns !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '1rem'
                  }}>
                    {[
                      { key: 'critical', label: 'Critiques', color: '#e74c3c' },
                      { key: 'high', label: 'Élevées', color: '#f39c12' },
                      { key: 'medium', label: 'Moyennes', color: '#f1c40f' }
                    ].map(({ key, label, color }) => (
                      <div 
                        key={key}
                        style={{
                          backgroundColor: getSeverityColor(key, report[key] || 0),
                          padding: '1rem',
                          borderRadius: '0.375rem',
                          textAlign: 'center',
                          border: `1px solid ${color}30`
                        }}
                      >
                        <div style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: 'bold', 
                          color: color 
                        }}>
                          {report[key] || 0}
                        </div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: '#6c757d',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {report.repository && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.5rem',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      color: '#6c757d'
                    }}>
                      📁 Repository: {report.repository}
                    </div>
                  )}
                </div>
              );
            })
        )}
      </div>

      <footer style={{
        marginTop: '2rem',
        textAlign: 'center',
        color: '#6c757d',
        fontSize: '0.875rem'
      }}>
        <p>
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')} | 
          Rafraîchissement automatique toutes les 30 secondes
        </p>
      </footer>
    </div>
  );
}

export default App;