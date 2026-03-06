/**
 * Simple script to create admin user
 * Usage: node scripts/create-admin.js
 * 
 * Make sure to set DATABASE_URL in your .env file or as an environment variable
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Use direct connection for one-off scripts to avoid pooler limits
// Replace ?pgbouncer=true with direct connection if available
let databaseUrl = process.env.DATABASE_URL || '';
if (databaseUrl.includes('pooler.supabase.com') && databaseUrl.includes('pgbouncer=true')) {
  // Try to use direct connection instead of pooler for scripts
  databaseUrl = databaseUrl
    .replace('pooler.supabase.com', 'supabase.co')
    .replace(':6543', ':5432')
    .replace('?pgbouncer=true&connection_limit=1', '')
    .replace('&pgbouncer=true', '')
    .replace('?connection_limit=1', '');
  console.log('ℹ️  Using direct connection for script (bypassing pooler)...');
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl || process.env.DATABASE_URL,
    },
  },
});

async function createAdmin() {
  try {
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@infiniteproperties.com';
    const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    
    console.log('🔍 Checking if admin user exists...');
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('ℹ️  Admin user already exists!');
      console.log(`📧 Email: ${email}`);
      console.log('💡 If you forgot the password, you can reset it or create a new admin user with a different email.');
      return;
    }

    console.log('🔐 Creating admin user...');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 'P1001') {
      console.error('💡 Database connection failed. Check your DATABASE_URL in .env file.');
    } else if (error.message.includes('MaxClientsInSessionMode')) {
      console.error('💡 Connection pool limit reached. Try:');
      console.error('   1. Wait a few seconds and try again');
      console.error('   2. Use direct connection string (port 5432) instead of pooler (port 6543)');
      console.error('   3. Or create admin via API: POST /api/auth/register');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    // Give it a moment to close connections
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

createAdmin();
