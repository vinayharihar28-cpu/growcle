import { auth } from '../src/lib/auth/auth';
import { db } from '../src/shared/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  // 1. Ensure testuser@example.com exists & password set
  let testUser = await db.user.findUnique({ where: { email: 'testuser@example.com' } });
  if (!testUser) {
    console.log("Creating testuser@example.com via Better Auth...");
    await auth.api.signUpEmail({
      body: {
        email: 'testuser@example.com',
        password: 'password123',
        name: 'Test User'
      }
    });
  } else {
    // Update account record for testuser
    await db.account.updateMany({
      where: { userId: testUser.id, providerId: 'credential' },
      data: {
        password: passwordHash,
        issuer: 'local:credential'
      }
    });
    console.log("Updated password for testuser@example.com to password123");
  }

  // 2. Ensure alexandra.chen@apextechnologies.io exists & password set
  let alexUser = await db.user.findUnique({ where: { email: 'alexandra.chen@apextechnologies.io' } });
  if (alexUser) {
    await db.account.updateMany({
      where: { userId: alexUser.id, providerId: 'credential' },
      data: {
        password: passwordHash,
        issuer: 'local:credential'
      }
    });
    console.log("Updated password & issuer for alexandra.chen@apextechnologies.io to password123");
  }

  console.log("\nAll accounts synchronized! You can log in with:");
  console.log("1. Email: testuser@example.com | Password: password123");
  console.log("2. Email: alexandra.chen@apextechnologies.io | Password: password123");
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
