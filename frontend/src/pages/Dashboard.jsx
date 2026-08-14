import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Card from '../components/Card';
import { fetchJobs } from '../api';

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs().then(setJobs).catch(console.error);
  }, []);

  const total = jobs.length;
  const interviewing = jobs.filter(j => j.status === 'Interviewing').length;
  const selected = jobs.filter(j => j.status === 'Selected').length;
  const closed = jobs.filter(j => j.status === 'Closed' || j.status === 'Rejected').length;

  const normalizeLocation = (loc) => {
    if (!loc) return 'Unknown';
    const l = loc.toLowerCase();
    if (l.includes('remote')) return 'Remote';
    if (l.includes('bangalore') || l.includes('bengaluru')) return 'Bengaluru';
    return loc; // Original capitalization if not matched
  };

  const normalizeTitle = (title) => {
    if (!title) return 'Unknown';
    const t = title.toLowerCase();
    if (t.includes('sde') || t.includes('swe') || t.includes('software engineer') || t.includes('full stack') || t.includes('developer')) {
      return 'Software Engineer';
    }
    if (t.includes('data')) return 'Data Roles';
    if (t.includes('devops') || t.includes('system') || t.includes('linux') || t.includes('cloud')) {
      return 'DevOps/Systems';
    }
    if (t.includes('ai') || t.includes('machine learning')) return 'AI/ML Engineer';
    return title;
  };

  // Process data for Location Pie Chart
  const locationData = jobs.reduce((acc, job) => {
    const loc = normalizeLocation(job.location);
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});
  const locationChartData = Object.keys(locationData).map(key => ({ name: key, value: locationData[key] }));

  // Process data for Job Title Pie Chart
  const titleData = jobs.reduce((acc, job) => {
    const title = normalizeTitle(job.jobTitle);
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});
  const titleChartData = Object.keys(titleData).map(key => ({ name: key, value: titleData[key] }));

  const CustomLegend = (props) => {
    const { payload } = props;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', padding: '20px 10px 0 10px', fontSize: '10px', fontFamily: '"Press Start 2P", cursive' }}>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: entry.color, borderRadius: '2px', flexShrink: 0 }}></div>
            <span style={{ color: entry.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={entry.value}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Hero Section */}
      <div style={{ position: 'relative', textAlign: 'center', margin: '80px 0', minHeight: '300px' }}>
        <Badge color="blue" tilt={-10} style={{ position: 'absolute', top: '-20px', left: '20%' }}>Software Engineer</Badge>
        <Badge color="green" tilt={5} style={{ position: 'absolute', top: '20px', right: '15%' }}>Job Tracker</Badge>
        <Badge color="yellow" tilt={15} style={{ position: 'absolute', bottom: '0px', left: '25%' }}>Money Chaser</Badge>

        <h1 className="pixel-font" style={{ fontSize: '4rem', marginBottom: '20px', display: 'inline-block' }}>Job Hunt</h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
          Tracking <span style={{ color: 'var(--accent-blue)' }}>{total}</span> applications so far.
        </p>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Button color="dark" onClick={() => navigate('/add')}>ADD APPLICATION</Button>
          <Button color="green" onClick={() => navigate('/table')}>VIEW TABLE</Button>
        </div>
      </div>

      {/* Stats Section - 2x2 Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '40px' }}>

        {/* Top Left: Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px' }}>
            <div className="pixel-font" style={{ fontSize: '10px', color: 'var(--text-primary)', marginBottom: '16px', lineHeight: '1.6' }}>TOTAL</div>
            <div className="pixel-font" style={{ fontSize: '2rem' }}>{total}</div>
          </Card>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px' }}>
            <div className="pixel-font" style={{ fontSize: '10px', color: 'var(--accent-blue)', marginBottom: '16px', lineHeight: '1.6' }}>INTERVIEWING FOR</div>
            <div className="pixel-font" style={{ fontSize: '2rem', color: 'var(--accent-blue)' }}>{interviewing}</div>
          </Card>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px' }}>
            <div className="pixel-font" style={{ fontSize: '10px', color: 'var(--accent-green)', marginBottom: '16px', lineHeight: '1.6' }}>SELECTED</div>
            <div className="pixel-font" style={{ fontSize: '2rem', color: 'var(--accent-green)' }}>{selected}</div>
          </Card>
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '30px' }}>
            <div className="pixel-font" style={{ fontSize: '10px', color: 'var(--accent-red)', marginBottom: '16px', lineHeight: '1.6' }}>CLOSED</div>
            <div className="pixel-font" style={{ fontSize: '2rem', color: 'var(--accent-red)' }}>{closed}</div>
          </Card>
        </div>

        {/* Top Right: By Location */}
        <Card title="By Location">
          <div style={{ height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {locationChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
                  <Pie data={locationChartData} cx="50%" cy="50%" outerRadius={110} innerRadius={50} fill="#8884d8" dataKey="value">
                    {locationChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center' }}>No Data</p>
            )}
          </div>
        </Card>

        {/* Bottom Row: By Job Title - spans both columns */}
        <Card title="By Job Title" style={{ gridColumn: '1 / -1' }}>
          <div style={{ height: '450px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {titleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{ fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }}>
                  <Pie data={titleChartData} cx="50%" cy="50%" outerRadius={130} innerRadius={60} fill="#8884d8" dataKey="value">
                    {titleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: '"Press Start 2P", cursive', fontSize: '10px' }} />
                  <Legend content={<CustomLegend />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ textAlign: 'center' }}>No Data</p>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Dashboard;
