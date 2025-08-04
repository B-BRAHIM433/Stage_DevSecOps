import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/results')
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Security Scan Reports</h1>
      {reports.map((r,i) => (
        <div key={i} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
          <p><strong>Type:</strong> {r.type}</p>
          <p><strong>Date:</strong> {r.date}</p>
          <p><strong>Critical:</strong> {r.critical}</p>
          <p><strong>High:</strong> {r.high}</p>
          <p><strong>Medium:</strong> {r.medium}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
