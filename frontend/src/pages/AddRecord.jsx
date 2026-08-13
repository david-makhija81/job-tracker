import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../api';
import Card from '../components/Card';
import { Input, Select } from '../components/Input';
import Button from '../components/Button';
import Badge from '../components/Badge';

const AddRecord = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    recruitingHrManager: '',
    status: 'Yet to Apply',
    applyLink: '',
    trackApplication: '',
    nextInterviewDate: '',
    appliedDate: '',
    salaryRange: '',
    location: '',
    requirements: '',
    resume: 'Experience + Projects',
    usedReferral: 'Not Used',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJob(formData);
      navigate('/table');
    } catch (err) {
      console.error(err);
      alert('Error saving application');
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < totalSteps - 1) setCurrentStep(s => s + 1);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const getCardStyle = (index) => {
    const isActive = index === currentStep;
    const isPast = index < currentStep;
    const isFuture = index > currentStep;

    let transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
    let zIndex = 10;
    let opacity = 1;

    if (isActive) {
      transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
      zIndex = 10;
      opacity = 1;
    } else if (isPast) {
      // Slide out left
      transform = 'translate(-150%, -50%) scale(0.8) rotate(-20deg)';
      zIndex = 5;
      opacity = 0;
    } else if (isFuture) {
      // Stack behind (messy peeking)
      const offset = (index - currentStep) * 18;
      const rotation = (index % 2 === 0 ? 1 : -1) * (index - currentStep) * 3;
      transform = `translate(calc(-50% + ${offset}px), calc(-50% + ${offset}px)) scale(${1 - (index - currentStep)*0.02}) rotate(${rotation}deg)`;
      zIndex = 10 - index;
      opacity = 1 - (index - currentStep) * 0.1;
    }

    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      transform,
      zIndex,
      opacity,
      pointerEvents: isActive ? 'auto' : 'none'
    };
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', position: 'relative' }}>
      {/* Decorative Floating Elements */}
      <Badge color="blue" tilt={-5} style={{ position: 'absolute', top: '20px', left: '-10%', zIndex: 50 }}>New Opportunity</Badge>
      <Badge color="yellow" tilt={10} style={{ position: 'absolute', top: '150px', right: '5%', zIndex: 50 }}>Shoot your shot!</Badge>
      <Badge color="green" tilt={-15} style={{ position: 'absolute', bottom: '100px', left: '5%', zIndex: 50 }}>Get that bread</Badge>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 className="pixel-font" style={{ fontSize: '2rem' }}>Add Application</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', width: '100%', height: '520px', maxWidth: '600px', margin: '0 auto' }}>
          
          {/* Card 0: Core Info */}
          <div style={getCardStyle(0)}>
            <Card title="Core Information">
              <Input label="Company" name="company" value={formData.company} onChange={handleChange} required />
              <Input label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
              <Input label="Recruiting HR/Manager" name="recruitingHrManager" value={formData.recruitingHrManager} onChange={handleChange} required />
            </Card>
          </div>

          {/* Card 1: Status & Outcome */}
          <div style={getCardStyle(1)}>
            <Card title="Current Status">
              <Select 
                label="Status/Outcome" 
                name="status" 
                value={formData.status} 
                onChange={handleChange} 
                options={['Yet to Apply', 'No Response Yet', 'Interviewing', 'Selected', 'Rejected', 'Closed']} 
              />
              <Input type="date" label="Applied Date" name="appliedDate" value={formData.appliedDate} onChange={handleChange} />
              <Input type="date" label="Next Interview Date" name="nextInterviewDate" value={formData.nextInterviewDate} onChange={handleChange} />
            </Card>
          </div>

          {/* Card 2: Links & Details */}
          <div style={getCardStyle(2)}>
            <Card title="Details">
              <Input label="Apply Link" name="applyLink" value={formData.applyLink} onChange={handleChange} />
              <Input label="Track Application Link" name="trackApplication" value={formData.trackApplication} onChange={handleChange} />
              <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
              <Input label="Salary Range" name="salaryRange" value={formData.salaryRange} onChange={handleChange} />
            </Card>
          </div>

          {/* Card 3: Extras */}
          <div style={getCardStyle(3)}>
            <Card title="Extras">
              <Input label="Requirements" name="requirements" value={formData.requirements} onChange={handleChange} />
              <Select 
                label="Resume Used" 
                name="resume" 
                value={formData.resume} 
                onChange={handleChange} 
                options={['Experience + Projects', 'Experience Only', 'Not Used']} 
              />
              <Select 
                label="Used Referral" 
                name="usedReferral" 
                value={formData.usedReferral} 
                onChange={handleChange} 
                options={['Not Used', 'Asked for it', 'Yes']} 
              />
            </Card>
          </div>
        </div>

        {/* Navigation Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '40px', position: 'relative', zIndex: 20 }}>
          {currentStep > 0 && (
            <Button color="dark" type="button" onClick={handlePrev}>&lt; PREVIOUS</Button>
          )}
          
          {currentStep < totalSteps - 1 ? (
            <Button color="blue" type="button" onClick={handleNext}>NEXT &gt;</Button>
          ) : (
            <Button color="green" type="submit">SAVE APPLICATION</Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddRecord;
