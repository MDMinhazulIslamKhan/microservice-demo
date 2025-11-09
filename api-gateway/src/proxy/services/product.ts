import { Router } from 'express';
import config from '../../config';
import { buildProxyMiddleware } from '../proxy';
import auth from '../../middleware/auth';

const router = Router();

const defaultProxy = buildProxyMiddleware({
  url: config.serviceRoutes.productService,
  name: 'product-service-default',
  pathRewrite: (path: string, req: any) => {
    const original = (req.originalUrl || req.url || path) as string;
    return original.replace('/api/product/', '/api/v1/');
  },
});

router.use('/public', defaultProxy);

router.use(auth(), defaultProxy);

export const ProductProxy = router;
