import { db } from './src/shared/lib/db';
import bcrypt from 'bcrypt';

async function main() {
  const email = 'alexandra.chen@apextechnologies.io';
  const password = 'password123';
  
  const user = await db.user.findUnique({
    where: { email },
    include: { accounts: true }
  });
  
  if (!user) {
    console.log("User not found!");
    return;
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const credentialAccount = user.accounts.find(a => a.providerId === 'credential');
  
  if (credentialAccount) {
    await db.account.update({
      where: { id: credentialAccount.id },
      data: { password: hashedPassword }
    });
    console.log(`Password updated for ${email}`);
  } else {
    await db.account.create({
      data: {
        userId: user.id,
        accountId: user.id, // better-auth uses user.id for credential accounts
        providerId: 'credential',
        password: hashedPassword
      }
    });
    console.log(`Password created for ${email}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => db.$disconnect());
