import { db } from '../src/shared/lib/db';

async function main() {
  const user = await db.user.findFirst({
    where: { email: "alexandra.chen@apextechnologies.io" },
    include: { accounts: true }
  });
  console.dir(user, { depth: null });
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
