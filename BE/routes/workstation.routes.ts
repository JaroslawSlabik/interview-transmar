import { Router } from 'express';
import { getWorkstations, postWorkstation } from '../controllers/workstation.controller';
import { CreateWorkstationDto } from '../dto/workstation.dto';
import { validationMiddleware } from '../middleware/validation.middleware';

const router = Router();

router.get('/', getWorkstations);
router.post('/', validationMiddleware(CreateWorkstationDto), postWorkstation);

export default router;

