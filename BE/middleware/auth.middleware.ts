import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../config/redis';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authentication'];

  if (!token || typeof token !== 'string') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Brakuje nagłówka Authentication.'
    });
  }

  try {

    const userId = await redisClient.get(token);

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token wygasł lub jest nieprawidłowy.'
      });
    }

    (req as any).userId = userId;

    next();
  } catch (err: any) {
    res.status(500).json({
      error: 'Błąd wewnętrzny serwera autoryzacji',
      message: err.message
    });
  }
};
