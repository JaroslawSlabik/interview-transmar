import { Router } from 'express';
import {
  getAssemblyLines,
  postAssemblyLine,
  putAssemblyLine,
  deleteAssemblyLineHandler,
} from '../controllers/assemblyLine.controller';
import { CreateAssemblyLineDto, UpdateAssemblyLineDto } from '../dto/assemblyLine.dto';
import { validationMiddleware } from '../middleware/validation.middleware';

const router = Router();

router.get('/', getAssemblyLines);
router.post('/', validationMiddleware(CreateAssemblyLineDto), postAssemblyLine);
router.put('/:id', validationMiddleware(UpdateAssemblyLineDto), putAssemblyLine);
router.delete('/:id', deleteAssemblyLineHandler);

export default router;

