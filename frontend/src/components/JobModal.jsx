import React, { useEffect, useState } from 'react';
import Badge from './Badge';
import Button from './Button';
import ComboSelect from './ComboSelect';
import { updateJob } from '../api';

const JobModal = ({ job, onClose, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [categoryValue, setCategoryValue] = useState(job?.jobCategory || '');
  const [postingIdValue, setPostingIdValue] = useState(job?.jobPostingId || '');
  const [editingPostingId, setEditingPostingId] = useState(false);

  const handleStatusChange = async (newStatus) => {
    let updates = { status: newStatus };

    if (newStatus === 'No Response Yet' && job.status === 'Yet to Apply') {
      const link = window.prompt("Enter a link to track this application (optional):");
      if (link) {
        updates.trackApplication = link;
      }
    }

    setUpdating(true);
    try {
      await updateJob(job.id, updates);
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      alert("Failed to update status.");
      setUpdating(false);
    }
  };
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!job) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        className="modal-pop glass-panel"
        style={{
          width: '85vw',
          height: '85vh',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '40px',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="pixel-font"
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'var(--accent-red)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            boxShadow: '2px 2px 0px var(--accent-red-shadow)',
            zIndex: 10
          }}
        >
          X
        </button>

        {/* Bento Box Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          gridAutoFlow: 'dense'
        }}>

          {/* Header Panel (Spans multiple columns if possible) */}
          <div style={{
            gridColumn: '1 / -1',
            background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-blue-shadow) 100%)',
            color: 'white',
            borderRadius: '16px',
            padding: '32px',
            position: 'relative',
            boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.2)'
          }}>
            <h1 className="pixel-font" style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: '800' }}>{job.company}</h1>
            <h2 className="pixel-font" style={{ fontSize: '1.2rem', opacity: 0.9 }}>{job.jobTitle}</h2>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', opacity: 0.8, fontSize: '0.9rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {job.jobCategory && <span>📁 {job.jobCategory}</span>}
              {postingIdValue ? (
                <span>🏷️ {postingIdValue}</span>
              ) : !editingPostingId ? (
                <span
                  onClick={() => setEditingPostingId(true)}
                  style={{ cursor: 'pointer', opacity: 0.6, textDecoration: 'underline dotted' }}
                  title="Click to add Job Posting ID"
                >🏷️ Add Job ID</span>
              ) : (
                <span style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. REQ-12345"
                    value={postingIdValue}
                    onChange={(e) => setPostingIdValue(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter' && postingIdValue.trim()) {
                        setUpdating(true);
                        try {
                          await updateJob(job.id, { jobPostingId: postingIdValue.trim() });
                          setEditingPostingId(false);
                          if (onUpdate) onUpdate();
                        } catch { alert('Failed to save.'); }
                        finally { setUpdating(false); }
                      }
                      if (e.key === 'Escape') setEditingPostingId(false);
                    }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.5)',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '0.85rem',
                      outline: 'none',
                      width: '130px',
                    }}
                  />
                  <button
                    type="button"
                    disabled={updating || !postingIdValue.trim()}
                    onClick={async () => {
                      setUpdating(true);
                      try {
                        await updateJob(job.id, { jobPostingId: postingIdValue.trim() });
                        setEditingPostingId(false);
                        if (onUpdate) onUpdate();
                      } catch { alert('Failed to save.'); }
                      finally { setUpdating(false); }
                    }}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }}
                    title="Save"
                  >✓</button>
                  <button
                    type="button"
                    onClick={() => { setPostingIdValue(''); setEditingPostingId(false); }}
                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem', opacity: 0.7 }}
                    title="Cancel"
                  >✕</button>
                </span>
              )}
            </div>
            {job.staleFlag && (
              <Badge color="red" style={{ position: 'absolute', top: '32px', right: '32px', transform: 'rotate(10deg)' }}>⚠️ STALE</Badge>
            )}
          </div>

          {/* Status & Outcome */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '8px solid var(--accent-yellow)', display: 'flex', flexDirection: 'column' }}>
            <h3 className="pixel-font" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>PIPELINE STATUS</h3>

            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px' }}>Current Phase</span>
                <Badge color={
                  job.status === 'Selected' ? 'green' :
                    job.status === 'Rejected' || job.status === 'Closed' ? 'red' :
                      job.status === 'Interviewing' ? 'blue' : 'yellow'
                }>{job.status}</Badge>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1, justifyContent: 'center', marginBottom: '24px' }}>
                {job.applyLink && (
                  <Button href={job.applyLink} target="_blank" color="blue" innerStyle={{ padding: '8px 16px', fontSize: '12px', textAlign: 'center', display: 'block' }} style={{ display: 'block', width: '100%' }}>APPLY LINK</Button>
                )}
                {job.trackApplication && (
                  <Button href={job.trackApplication} target="_blank" color="green" innerStyle={{ padding: '8px 16px', fontSize: '12px', textAlign: 'center', display: 'block' }} style={{ display: 'block', width: '100%' }}>TRACK PORTAL</Button>
                )}
              </div>

              {/* Dynamic Status Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.1)', justifyContent: 'flex-end' }}>
                {job.status === 'Yet to Apply' && (
                  <Button onClick={() => handleStatusChange('No Response Yet')} color="blue" innerStyle={{ padding: '6px 12px', fontSize: '10px' }} disabled={updating}>MARK AS APPLIED</Button>
                )}
                {job.status === 'No Response Yet' && (
                  <>
                    <Button onClick={() => handleStatusChange('Interviewing')} color="blue" innerStyle={{ padding: '6px 12px', fontSize: '10px' }} disabled={updating}>MOVE TO INTERVIEWING</Button>
                    <Button onClick={() => handleStatusChange('Rejected')} color="red" innerStyle={{ padding: '6px 12px', fontSize: '10px' }} disabled={updating}>REJECTED</Button>
                  </>
                )}
                {job.status === 'Interviewing' && (
                  <>
                    <Button onClick={() => handleStatusChange('Selected')} color="green" innerStyle={{ padding: '6px 12px', fontSize: '10px' }} disabled={updating}>OFFER RECEIVED!</Button>
                    <Button onClick={() => handleStatusChange('Rejected')} color="red" innerStyle={{ padding: '6px 12px', fontSize: '10px' }} disabled={updating}>REJECTED</Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Key Details */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '8px solid var(--accent-green)' }}>
            <h3 className="pixel-font" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>THE OPPORTUNITY</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Job Category</div>
                {!editingCategory ? (
                  <div
                    onClick={() => setEditingCategory(true)}
                    style={{ fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    title="Click to edit"
                  >
                    {categoryValue || 'Uncategorized'}
                    <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>✏️</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <ComboSelect
                        name="jobCategory"
                        value={categoryValue}
                        onChange={(e) => setCategoryValue(e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={updating}
                      onClick={async () => {
                        setUpdating(true);
                        try {
                          await updateJob(job.id, { jobCategory: categoryValue });
                          setEditingCategory(false);
                          if (onUpdate) onUpdate();
                        } catch {
                          alert('Failed to update category.');
                        } finally {
                          setUpdating(false);
                        }
                      }}
                      style={{
                        background: 'var(--accent-green)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        fontFamily: '"Press Start 2P", cursive',
                        fontSize: '10px',
                        marginBottom: '16px',
                        boxShadow: '2px 2px 0px var(--accent-green-shadow)',
                      }}
                    >
                      SAVE
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryValue(job.jobCategory || '');
                        setEditingCategory(false);
                      }}
                      style={{
                        background: 'var(--accent-red)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 16px',
                        cursor: 'pointer',
                        fontFamily: '"Press Start 2P", cursive',
                        fontSize: '10px',
                        marginBottom: '16px',
                        boxShadow: '2px 2px 0px var(--accent-red-shadow)',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Location</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{job.location || 'Unknown'}</div>
              </div>
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Salary Range</div>
                <div className="pixel-font" style={{ fontSize: '1rem', color: 'var(--accent-green-shadow)' }}>{job.salaryRange || 'Unspecified'}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Requirements</div>
                <div style={{ fontStyle: job.requirements ? 'normal' : 'italic' }}>{job.requirements || 'None listed.'}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '8px solid var(--accent-blue)' }}>
            <h3 className="pixel-font" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>TIMELINE</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Applied Date</div>
                <div className="pixel-font" style={{ fontSize: '1rem' }}>{job.appliedDate || 'N/A'}</div>
              </div>

              <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Next Interview</div>
                <div className="pixel-font" style={{ fontSize: '1rem', color: 'var(--accent-green-shadow)' }}>{job.nextInterviewDate || 'Not Scheduled'}</div>
              </div>
            </div>
          </div>

          {/* Strategy & Contacts */}
          <div className="glass-panel" style={{ padding: '24px', gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', borderTop: '8px solid var(--accent-dark)' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Resume Used</div>
              <div style={{ fontWeight: '600', fontSize: '1.2rem', marginTop: '4px' }}>{job.resume || 'Not Specified'}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Referral Status</div>
              <div style={{ fontWeight: '600', fontSize: '1.2rem', marginTop: '4px' }}>{job.usedReferral || 'Not Used'}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Recruiting Contact</div>
              <div style={{ fontWeight: '600', fontSize: '1.2rem', marginTop: '4px' }}>{job.recruitingHrManager || 'Unknown'}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobModal;
