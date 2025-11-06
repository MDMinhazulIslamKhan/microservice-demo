import { CorsOptions } from 'cors';
import config from '.';

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    return config.client_urls.includes(origin)
      ? callback(null, true)
      : callback(new Error('CORS blocked'));
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Req-Id'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  maxAge: 600,
};
