import { Router } from 'express';
import { AuthProxy } from './services/auth';
import { ProductProxy } from './services/product';
import { OrderProxy } from './services/order';

const router = Router();

router.use('/auth', AuthProxy);

router.use('/product', ProductProxy);

router.use('/order', OrderProxy);

export default router;
