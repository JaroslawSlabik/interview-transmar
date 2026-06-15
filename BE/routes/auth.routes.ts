import { Router } from 'express';
import { login, logout } from '../controllers/auth.controller';
import { LoginRequestDto } from '../dto/auth.dto';
import { validationMiddleware } from '../middleware/validation.middleware';

const router = Router();

router.post('/login', validationMiddleware(LoginRequestDto), login);
router.post('/logout', logout);

export default router;
