import { db } from '../src/shared/lib/db';

async function main() {
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
    }
  });
  
  console.log("Users in Database:");
  console.table(users);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
