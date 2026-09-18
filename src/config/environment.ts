import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const environment = {
  baseUrl: process.env.BASE_URL ?? 'https://light-it-qa-challenge.vercel.app',
  email: required('TEST_USER_EMAIL'),
  password: required('TEST_USER_PASSWORD'),
  expectedEmail: process.env.EXPECTED_USER_EMAIL ?? process.env.TEST_USER_EMAIL,
  headless: process.env.HEADLESS === 'true'
};