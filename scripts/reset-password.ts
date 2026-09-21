import { db } from '../src/shared/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'alexandra.chen@apextechnologies.io';
  
  // Find user
  const user = await db.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    console.log("User not found!");
    return;
  }
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Update account password
  await db.account.updateMany({
    where: { userId: user.id },
    data: { password: hashedPassword }
  });
  
  console.log(`Password for ${email} has been reset to: password123`);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
