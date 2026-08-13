import React, { useEffect, useState } from 'react';
import { fetchJobs, deleteJob } from '../api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import JobModal from '../components/JobModal';

const JobTable = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  const loadJobs = () => {
    setLoading(true);
    fetchJobs()
      .then(data => {
        // Sort logic: 
        // Primary: Interviewing > Selected > No Response Yet > Rejected/Closed
        const getScore = (job) => {
          if (job.status === 'Interviewing') return 6;
          if (job.status === 'Selected') return 5;
          if (job.status === 'No Response Yet') return job.staleFlag ? 2 : 4;
          if (job.status === 'Yet to Apply') return 3;
          if (job.status === 'Rejected' || job.status === 'Closed') return 1;
          return 2.5; 
        };

        const sorted = data.sort((a, b) => {
          const scoreA = getScore(a);
          const scoreB = getScore(b);
          if (scoreA !== scoreB) {
            return scoreB - scoreA; // Descending
          }
          // Secondary sort: Applied Date (Newest first)
          if (a.appliedDate && b.appliedDate) {
            return new Date(b.appliedDate) - new Date(a.appliedDate);
          }
          return 0;
        });

        setJobs(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteJob(id);
        loadJobs();
      } catch (e) {
        alert('Failed to delete job.');
      }
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 className="pixel-font" style={{ fontSize: '2rem' }}>Applications Table</h2>
      </div>

      <Card>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ overflowX: 'visible', paddingRight: '60px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', border: '4px solid black' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ccc', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                  <th style={{ padding: '16px' }}>Company</th>
                  <th style={{ padding: '16px' }}>Job Title</th>
                  <th style={{ padding: '16px' }}>Status/Outcome</th>
                  <th style={{ padding: '16px', textAlign: 'center' }}>Link</th>
                  <th style={{ padding: '16px' }}>Location</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr 
                    key={job.id} 
                    onClick={() => setSelectedJob(job)}
                    style={{ 
                      borderBottom: '1px solid #eee', 
                      transition: 'background 0.2s',
                      backgroundColor: job.staleFlag ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = job.staleFlag ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0,0,0,0.03)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = job.staleFlag ? 'rgba(239, 68, 68, 0.1)' : 'transparent'}
                  >
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>{job.company}</td>
                    <td style={{ padding: '16px' }}>{job.jobTitle}</td>
                    <td style={{ padding: '16px' }}>
                      <Badge color={
                        job.status === 'Selected' ? 'green' : 
                        job.status === 'Rejected' || job.status === 'Closed' ? 'red' : 
                        job.status === 'Interviewing' ? 'blue' : 'yellow'
                      }>{job.status}</Badge>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {job.status === 'Yet to Apply' && job.applyLink ? (
                        <Button onClick={(e) => e.stopPropagation()} href={job.applyLink} target="_blank" rel="noopener noreferrer" color="blue" innerStyle={{ padding: '6px 10px', fontSize: '10px' }} style={{ display: 'inline-block' }}>APPLY</Button>
                      ) : job.status !== 'Yet to Apply' && job.trackApplication ? (
                        <Button onClick={(e) => e.stopPropagation()} href={job.trackApplication} target="_blank" rel="noopener noreferrer" color="green" innerStyle={{ padding: '6px 10px', fontSize: '10px' }} style={{ display: 'inline-block' }}>TRACK</Button>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td style={{ padding: '16px' }}>{job.location || 'Unknown'}</td>
                    <td style={{ padding: '16px', position: 'relative', textAlign: 'right' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(job.id); }}
                        style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer', textDecoration: 'underline' }}
                      >Delete</button>
                      
                      {job.staleFlag && (
                        <div className="wobble-anim pixel-font" style={{ 
                          position: 'absolute', 
                          right: '-60px', 
                          top: '50%', 
                          marginTop: '-10px', 
                          background: 'var(--accent-red)', 
                          color: 'white', 
                          padding: '4px 8px', 
                          fontSize: '10px', 
                          borderRadius: '4px',
                          boxShadow: '2px 2px 0px var(--accent-red-shadow)',
                          zIndex: 10
                        }}>
                          STALE
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {jobs.length === 0 && <p style={{ textAlign: 'center', marginTop: '20px' }}>No records found.</p>}
          </div>
        )}
      </Card>

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} onUpdate={loadJobs} />}
    </div>
  );
};

export default JobTable;
