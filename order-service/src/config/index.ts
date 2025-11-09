/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envSchema = z.object({
  DATABASE_URL: z.url({ error: 'Database url is required' }),
  KAFKA_BROKERS: z.string({ error: 'Kafka brokers are required' }),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z
    .string({ error: 'Port is required.' })
    .regex(/^\d+$/, { message: 'Port must be a number.' })
    .transform(Number),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:');

  const tree = z.treeifyError(parsedEnv.error);

  function flattenTree(node: any, parentKey = ''): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    if (node.errors && node.errors.length > 0) {
      result[parentKey] = node.errors.map((e: any) => e.message ?? String(e));
    }

    if (node.properties) {
      for (const [key, value] of Object.entries(node.properties)) {
        Object.assign(result, flattenTree(value, key));
      }
    }

    return result;
  }

  console.error(flattenTree(tree));
  process.exit(1);
}

const env = parsedEnv.data;

export default {
  env: env.NODE_ENV,
  port: env.PORT,
};
