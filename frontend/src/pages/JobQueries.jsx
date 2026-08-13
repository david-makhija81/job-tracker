import React from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

const queries = [
  {
    title: "AI Engineer (1-3 yrs)",
    description: "Finds AI and LLM roles while strictly excluding senior, lead, and MLOps positions.",
    query: `("AI engineer" OR "AI application engineer" OR "generative AI engineer" OR "LLM application engineer" OR "AI product engineer") AND ("2+ years" OR "1-3 years" OR "associate") NOT ("machine learning engineer" OR "ML engineer" OR "MLOps" OR "senior" OR "lead" OR "principal" OR "5+ years")`
  },
  {
    title: "Cloud Solutions Engineer",
    description: "Targets customer-facing cloud engineering roles for mid-level experience.",
    query: `("cloud solutions engineer" OR "cloud consultant" OR "customer engineer" OR "cloud implementation engineer" OR "cloud support engineer" OR "technical account manager" OR "partner solutions engineer") AND ("2+ years" OR "1-3 years" OR "associate") NOT ("security" OR "senior" OR "lead" OR "principal")`
  },
  {
    title: "Forward Deployed Engineer",
    description: "Searches for field engineering and forward deployed software roles.",
    query: `("forward deployed engineer" OR "forward deployed software engineer" OR "deployment engineer" OR "field engineer" software) AND ("2+ years" OR "1-3 years")`
  },
  {
    title: "Software Engineer - Mid Level",
    description: "A robust search for standard SDE/Full Stack roles while excluding embedded/hardware and senior levels.",
    query: `("software engineer" OR "software developer" OR "SDE" OR "full stack developer" OR "backend developer") AND ("2 years" OR "2-3 years" OR "SDE 1" OR "SDE II") NOT ("senior" OR "staff" OR "lead" OR "principal" OR "embedded" OR "firmware" OR "C++" OR "RTOS" OR "microcontroller" OR "device driver" OR "bare metal" OR "systems engineer" OR "hardware")`
  }
];

const JobQueries = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', position: 'relative', padding: '0 20px' }}>
      <Badge color="red" tilt={-5} style={{ position: 'absolute', top: '0px', left: '-5%', zIndex: 50 }}>Boolean Magic!</Badge>
      <Badge color="green" tilt={10} style={{ position: 'absolute', top: '150px', right: '-5%', zIndex: 50 }}>Find The One</Badge>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 className="pixel-font" style={{ fontSize: '2rem' }}>Saved Queries</h2>
        <p className="pixel-font" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.6' }}>
          One-click complex LinkedIn searches
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        {queries.map((q, index) => {
          const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(q.query)}`;
          
          return (
            <Card key={index} title={q.title}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                {q.description}
              </p>
              
              <div style={{ 
                background: 'rgba(0,0,0,0.05)', 
                padding: '16px', 
                borderRadius: '8px', 
                fontFamily: 'monospace', 
                fontSize: '13px',
                color: '#333',
                marginBottom: '24px',
                border: '1px solid rgba(0,0,0,0.1)',
                wordBreak: 'break-word'
              }}>
                {q.query}
              </div>

              <div style={{ textAlign: 'right' }}>
                <Button href={linkedinUrl} target="_blank" color="blue" innerStyle={{ padding: '12px 24px', fontSize: '12px' }}>
                  SEARCH LINKEDIN &gt;
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default JobQueries;
