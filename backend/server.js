const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Helper to update stale flags
const updateStaleFlags = async () => {
  const twentyDaysAgo = new Date();
  twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
  
  await prisma.job.updateMany({
    where: {
      status: 'No Response Yet',
      staleFlag: false,
      appliedDate: {
        not: null
      },
      // SQLite stores ISO strings, so we compare strings if stored as Date? Prisma handles DateTime mapping.
      // But we stored appliedDate as String in Prisma schema! We should fix this if we want date math.
    },
    data: {
      staleFlag: true
    }
  });
};

// GET all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    // Before returning jobs, let's just do a naive check for stale jobs
    // Note: Since appliedDate is stored as String (e.g. "2026-06-26"), 
    // we need to fetch and check them in JS or fix the schema.
    const jobs = await prisma.job.findMany();
    
    // Update stale flags in memory & DB
    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
    
    for (const job of jobs) {
      if (job.status === 'No Response Yet' && !job.staleFlag && job.appliedDate) {
        const appliedDate = new Date(job.appliedDate);
        if (!isNaN(appliedDate) && appliedDate < twentyDaysAgo) {
          job.staleFlag = true;
          await prisma.job.update({ where: { id: job.id }, data: { staleFlag: true } });
        }
      }
    }

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// POST a new job
app.post('/api/jobs', async (req, res) => {
  try {
    const newJob = await prisma.job.create({
      data: req.body
    });
    res.json(newJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// PUT update a job
app.put('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await prisma.job.update({
      where: { id: parseInt(id) },
      data: req.body
    });
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// DELETE a job
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.job.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
