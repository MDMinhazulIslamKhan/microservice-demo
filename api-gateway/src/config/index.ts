import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z
    .string({ error: 'Port is required.' })
    .regex(/^\d+$/)
    .transform(Number),
  CLIENT_URLS: z.string({ error: 'Client urls is required.' }),
  AUTH_SERVICE: z.url({ error: 'Auth service url is required.' }),
  PRODUCT_SERVICE: z.url({ error: 'Product service url is required.' }),
  ORDER_SERVICE: z.url({ error: 'Order service url is required.' }),
  JWT_ACCESS_TOKEN_SECRET: z
    .string()
    .min(5, 'JWT access token secret is required'),
  REQUEST_TIMEOUT_MS: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default(30000),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default(900000),
  RATE_LIMIT_MAX: z.string().regex(/^\d+$/).transform(Number).default(1000),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment variables:');

  const tree = z.treeifyError(parsedEnv.error);

  function flattenTree(node: any, parentKey = ''): Record<string, string[]> {
    let result: Record<string, string[]> = {};

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
  client_urls: env.CLIENT_URLS?.split(','),
  serviceRoutes: {
    authService: env.AUTH_SERVICE,
    productService: env.PRODUCT_SERVICE,
    orderService: env.ORDER_SERVICE,
  },
  jwt: {
    accessTokenSecret: env.JWT_ACCESS_TOKEN_SECRET,
  },
  requestTimeoutMS: env.REQUEST_TIMEOUT_MS,
  rateLimitWindowMS: env.RATE_LIMIT_WINDOW_MS,
  rateLimitMax: env.RATE_LIMIT_MAX,
};
