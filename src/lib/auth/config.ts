export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL'
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Failed to start application. Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Call validation immediately upon module resolution
validateEnv();

export const authConfig = {
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL!,
  isDev: process.env.NODE_ENV === 'development',
};
