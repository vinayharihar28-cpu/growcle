const getBetterAuthUrl = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3001";
};

export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'BETTER_AUTH_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `[Warning] Missing environment variables: ${missing.join(', ')}. Using fallbacks if available.`
    );
  }
}

// Call validation immediately upon module resolution
validateEnv();

export const authConfig = {
  secret: process.env.BETTER_AUTH_SECRET || "growcle_white_label_saas_super_secret_auth_key_32bytes_minimum",
  baseURL: getBetterAuthUrl(),
  isDev: process.env.NODE_ENV === 'development',
};
