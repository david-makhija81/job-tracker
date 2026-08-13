const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const fetchJobs = async () => {
  const response = await fetch(`${API_URL}/jobs`);
  if (!response.ok) throw new Error('Failed to fetch jobs');
  return response.json();
};

export const createJob = async (jobData) => {
  const response = await fetch(`${API_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) throw new Error('Failed to create job');
  return response.json();
};

export const updateJob = async (id, jobData) => {
  const response = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) throw new Error('Failed to update job');
  return response.json();
};

export const deleteJob = async (id) => {
  const response = await fetch(`${API_URL}/jobs/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete job');
  return response.json();
};
