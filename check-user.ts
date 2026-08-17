import { db } from './src/shared/lib/db';

async function main() {
  const user = await db.user.findUnique({
    where: { email: 'alexandra.chen@apextechnologies.io' },
    include: { accounts: true }
  });
  
  if (user) {
    console.log("User found:", user.email);
    console.log("Accounts:", user.accounts.map(a => ({ provider: a.providerId, hasPassword: !!a.password })));
    
    const credentialAccount = user.accounts.find(a => a.providerId === 'credential');
    if (!credentialAccount) {
        console.log("No credential account found. The user does not have a password set!");
    }
  } else {
    console.log("User not found in DB.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => db.$disconnect());
