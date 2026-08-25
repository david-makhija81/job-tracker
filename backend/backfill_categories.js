const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

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
  if (t.includes('solution')) return 'Solutions Engineer';
  return title;
};

async function backfill() {
  const jobs = await prisma.job.findMany({ where: { jobCategory: null } });
  console.log(`Found ${jobs.length} jobs without a category. Backfilling...`);

  for (const job of jobs) {
    const category = normalizeTitle(job.jobTitle);
    await prisma.job.update({
      where: { id: job.id },
      data: { jobCategory: category },
    });
    console.log(`  [${job.id}] "${job.jobTitle}" → "${category}"`);
  }

  console.log('Done!');
  await prisma.$disconnect();
}

backfill().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
