import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

config({
  path: '.env.local',
});

const runProductionMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is required for production migrations');
  }

  console.log('🚀 Running production migrations...');

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  const start = Date.now();
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  const end = Date.now();

  console.log('✅ Production migrations completed in', end - start, 'ms');
  
  await connection.end();
  process.exit(0);
};

runProductionMigrate().catch((err) => {
  console.error('❌ Production migration failed');
  console.error(err);
  process.exit(1);
});
