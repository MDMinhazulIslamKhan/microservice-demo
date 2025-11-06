import express from 'express';
import { ProductRoutes } from '../modules/product/product.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/',
    route: ProductRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export const ApplicationRouters = router;
