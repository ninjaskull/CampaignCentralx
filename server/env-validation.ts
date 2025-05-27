
// Environment variables validation
export function validateEnvironment() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'ACCESS_PASSWORD',
    'ENCRYPTION_KEY'
  ];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Validate encryption key length (should be 64 characters for 32-byte key)
  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length !== 64) {
    throw new Error('ENCRYPTION_KEY must be exactly 64 characters long (32 bytes hex)');
  }
}
