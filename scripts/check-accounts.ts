import { db } from '../src/shared/lib/db';

async function main() {
  const account = await db.account.findFirst();
  console.log("Account:", account);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
