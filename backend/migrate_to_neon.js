const sqlite3 = require('sqlite3').verbose();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const db = new sqlite3.Database('./prisma/dev.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  db.all(`SELECT * FROM Job`, async (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log(`Found ${rows.length} jobs to migrate.`);
    for (const row of rows) {
      // Remove 'id' so Postgres can auto-increment natively
      const { id, ...dataToInsert } = row;
      
      // Convert SQLite integer boolean (0/1) to true/false for Prisma
      dataToInsert.staleFlag = Boolean(dataToInsert.staleFlag);
      
      // Convert SQLite ISO strings to JS Date objects for Prisma DateTime fields
      if (dataToInsert.createdAt) dataToInsert.createdAt = new Date(dataToInsert.createdAt);
      if (dataToInsert.updatedAt) dataToInsert.updatedAt = new Date(dataToInsert.updatedAt);
      
      try {
        await prisma.job.create({ data: dataToInsert });
        console.log(`Migrated: ${row.company} - ${row.jobTitle}`);
      } catch (e) {
        console.error(`Failed to migrate ${row.company}:`, e.message);
      }
    }
    console.log('Migration complete.');
    db.close();
    await prisma.$disconnect();
  });
});
