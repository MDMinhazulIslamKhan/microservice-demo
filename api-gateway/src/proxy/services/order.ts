import { Router } from 'express';
import config from '../../config';
import { buildProxyMiddleware } from '../proxy';
import auth from '../../middleware/auth';
import { ENUM_USER_ROLE } from '../../enum';

const router = Router();

const defaultProxy = buildProxyMiddleware({
  url: config.serviceRoutes.orderService,
  name: 'order-service-default',
  pathRewrite: (path: string, req: any) => {
    const original = (req.originalUrl || req.url || path) as string;
    return original.replace('/api/order/', '/api/v1/');
  },
});

router.use('/admin', auth(ENUM_USER_ROLE.ADMIN), defaultProxy);

router.use(auth(), defaultProxy);

export const OrderProxy = router;
