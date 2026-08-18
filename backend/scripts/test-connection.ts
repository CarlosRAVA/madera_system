import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function testConnection() {
  console.log('🔌 Testing database connection...');
  console.log(
    `📍 DATABASE_URL: ${process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@') ?? 'NOT SET'}`,
  );

  try {
    await prisma.$connect();
    console.log('✅ Connected to database successfully');

    const result = await prisma.$queryRaw<[{ now: Date }]>`SELECT NOW()`;
    console.log(`✅ Query result — Server time: ${result[0].now}`);

    console.log('\n🎉 Database connection is working correctly!');
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }
}

void testConnection();
