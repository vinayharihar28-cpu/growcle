import { auth } from '../src/lib/auth/auth';
import { db } from '../src/shared/lib/db';

async function main() {
  const email = 'testuser@example.com';
  const password = 'password123';
  const name = 'Test User';

  try {
    // Check if user exists
    const existing = await db.user.findUnique({
      where: { email }
    });
    
    if (existing) {
      console.log("User already exists, deleting first...");
      await db.user.delete({ where: { email } });
    }

    // Call Better Auth to create the user properly
    const newUser = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name
      }
    });

    console.log("Successfully created test user via Better Auth!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    // Also, create a Member profile for them so they can test the Dashboard features!
    // 1. Get an organization
    let org = await db.organization.findFirst();
    if (!org) {
      org = await db.organization.create({
        data: { name: 'Test Org', slug: 'test-org' }
      });
    }

    // 2. Get a chapter
    let chapter = await db.chapter.findFirst();
    if (!chapter) {
      chapter = await db.chapter.create({
        data: { name: 'Test Chapter', organizationId: org.id }
      });
    }
    
    // 3. Create the Member profile
    // Make sure we have the actual DB user to link to
    const dbUser = await db.user.findUnique({ where: { email } });
    
    if (dbUser) {
            await db.member.create({
          data: {
            userId: dbUser.id,
            firstName: 'Test',
            lastName: 'User',
            email: email,
            organizationId: org.id,
            chapterId: chapter.id,
            status: 'ACTIVE',
            business: {
              create: {
                businessName: 'Acme Test Corp',
                industry: 'Technology',
              }
            }
          }
        });
        console.log("Created Member profile linked to Test User.");
    }

  } catch (error) {
    console.error("Error creating user:", error);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
