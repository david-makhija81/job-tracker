import React, { useState } from 'react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { Input } from '../components/Input';

const rawCompanies = [
  "Linkedin", "Microsoft", "Google", "Atlassian", "Adobe", "Salesforce", "Intuit", "Apple", "Twitter", "Indeed", 
  "Expedia", "Nvidia", "VMWare", "Flipkart", "Inmobi", "Nutanix", "Citrix", "JP Morgan", "Uber", "Tower Research", 
  "Amazon", "Goldman Sachs", "Morgan Stanley", "Codenation", "Zomato", "DE Shaw", "Sprinklr", "Arcesium", "Harness", "Coinbase", 
  "Rippling", "Rubrik", "Udaan", "Sumologic", "Cure Fit", "Swiggy", "Ola", "Directi", "ServiceNow", "Stripe", 
  "Sharechat", "Postman", "Oracle (OCI)", "Compass", "HealthifyMe", "Aviso", "Target", "Palo Alto Networks", "Vizury", 
  "Qubole", "Practo", "Whatfix", "World Quant", "Alphonso", "App Dynamics", "Cohesity", "MotorQ", "Hasura", "Quadeye", 
  "Bloomreach", "Instabase", "AirBnB", "Cisco", "Samsung", "Walmart", "Slack", "Blackbuck", "Oracle (other than OCI)", "Visa", 
  "Intel", "Qualcomm", "ARM", "Broadcom", "Texas Instruments", "Mentor Graphics", "Cred", "Upgrad", "Paypal", "Dunzo", 
  "Unacademy", "BigBasket", "Cloudera", "Twilio", "Box8", "MyGate", "Jio", "MakeMyTrip", "BrowserStack", "Razorpay", 
  "Juniper Networks", "SanDisk", "Redhat", "Chowbotics (DoorDash)", "Hotstar", "Paytm", "Wissen", "Oyo", "Dream11"
];

// Deduplicate just in case
const companiesList = [...new Set(rawCompanies)];

const TopCompanies = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companiesList.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', position: 'relative', padding: '0 20px' }}>
      
      {/* Decorative Floating Elements */}
      <Badge color="blue" tilt={-5} style={{ position: 'absolute', top: '0px', left: '-5%', zIndex: 50 }}>Dream Big</Badge>
      <Badge color="yellow" tilt={10} style={{ position: 'absolute', top: '150px', right: '-5%', zIndex: 50 }}>Top Paying!</Badge>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 className="pixel-font" style={{ fontSize: '2rem' }}>Top Companies</h2>
        <p className="pixel-font" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
          India's highest paying tech giants
        </p>
      </div>

      <Card title="Company Directory">
        
        <div style={{ marginBottom: '24px' }}>
          <Input 
            label="Search"
            name="search"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div style={{ 
          maxHeight: '600px', 
          overflowY: 'auto', 
          border: '4px solid #111', 
          borderRadius: '8px',
          background: 'rgba(255, 255, 255, 0.5)'
        }}>
          {/* Table Header */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '80px 1fr 180px', 
            padding: '16px', 
            borderBottom: '4px solid #111',
            background: 'var(--accent-dark)',
            color: 'white',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <div className="pixel-font" style={{ fontSize: '12px' }}>RANK</div>
            <div className="pixel-font" style={{ fontSize: '12px' }}>COMPANY</div>
            <div className="pixel-font" style={{ fontSize: '12px', textAlign: 'right' }}>ACTION</div>
          </div>

          {/* Table Body */}
          {filteredCompanies.map((company, index) => {
            const originalIndex = companiesList.indexOf(company) + 1;
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(company + ' careers India')}`;

            return (
              <div key={company} style={{ 
                display: 'grid', 
                gridTemplateColumns: '80px 1fr 180px', 
                padding: '12px 16px', 
                borderBottom: index !== filteredCompanies.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                alignItems: 'center',
                transition: 'background 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div className="pixel-font" style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>#{originalIndex}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{company}</div>
                <div style={{ textAlign: 'right' }}>
                  <Button 
                    href={searchUrl} 
                    target="_blank" 
                    color="blue" 
                    innerStyle={{ padding: '8px 12px', fontSize: '10px' }}>
                    CAREERS &gt;
                  </Button>
                </div>
              </div>
            )
          })}

          {filteredCompanies.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No companies found matching "{searchTerm}"
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TopCompanies;
