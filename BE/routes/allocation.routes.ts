import { Router } from 'express';
import { getAllocations, postAllocations, deleteAllocation } from '../controllers/allocation.controller';
import { UpdateAllocationsDto } from '../dto/allocation.dto';
import { validationMiddleware } from '../middleware/validation.middleware';

const router = Router();

router.get('/line/:lineId', getAllocations);
router.post('/line/:lineId', validationMiddleware(UpdateAllocationsDto), postAllocations);
router.delete('/line/:lineId/workstation/:workstationId', deleteAllocation);

export default router;
