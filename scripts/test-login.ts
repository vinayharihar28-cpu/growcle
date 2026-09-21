import { auth } from '../src/lib/auth/auth';

async function main() {
  const email = 'testuser@example.com';
  const password = 'password123';

  try {
    const session = await auth.api.signInEmail({
      body: {
        email,
        password,
      }
    });
    console.log("Success!", session);
  } catch (e: any) {
    console.error("Failed to sign in:", e.message, e.body);
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));
