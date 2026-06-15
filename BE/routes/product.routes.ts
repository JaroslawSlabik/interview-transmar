import { Router } from 'express';
import { getProducts, postProduct } from '../controllers/product.controller';
import { CreateProductDto } from '../dto/product.dto';
import { validationMiddleware } from '../middleware/validation.middleware';

const router = Router();

router.get('/', getProducts);
router.post('/', validationMiddleware(CreateProductDto), postProduct);

export default router;

