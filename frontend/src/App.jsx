import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddRecord from './pages/AddRecord';
import JobTable from './pages/JobTable';
import TopCompanies from './pages/TopCompanies';
import JobQueries from './pages/JobQueries';

function App() {
  return (
    <Router>
      <div style={{ position: 'relative', zIndex: 10 }}>
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '16px', 
          padding: '24px',
          position: 'sticky',
          top: 0,
          background: '#f7f9fc',
          borderBottom: '2px solid rgba(0,0,0,0.1)',
          zIndex: 100
        }}>
          <Link to="/" className="chunky-btn chunky-btn-dark" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <span className="chunky-btn-inner" style={{ padding: '8px 16px', fontSize: '12px' }}>HOME</span>
          </Link>
          <Link to="/add" className="chunky-btn chunky-btn-green" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <span className="chunky-btn-inner" style={{ padding: '8px 16px', fontSize: '12px' }}>ADD APPLICATION</span>
          </Link>
          <Link to="/table" className="chunky-btn chunky-btn-blue" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <span className="chunky-btn-inner" style={{ padding: '8px 16px', fontSize: '12px' }}>TABLE</span>
          </Link>
          <Link to="/top-companies" className="chunky-btn chunky-btn-yellow" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <span className="chunky-btn-inner" style={{ padding: '8px 16px', fontSize: '12px' }}>TOP COMPANIES</span>
          </Link>
          <Link to="/queries" className="chunky-btn chunky-btn-red" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <span className="chunky-btn-inner" style={{ padding: '8px 16px', fontSize: '12px' }}>QUERIES</span>
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddRecord />} />
          <Route path="/table" element={<JobTable />} />
          <Route path="/top-companies" element={<TopCompanies />} />
          <Route path="/queries" element={<JobQueries />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
