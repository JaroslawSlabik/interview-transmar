import { Request, Response } from 'express';
import { LoginRequestDto } from '../dto/auth.dto';
import { loginUser, logoutUser } from '../services/auth.service';
import { AppError } from '../errors/AppError';

export const login = async (
  req: Request<Record<string, string>, unknown, LoginRequestDto>,
  res: Response
) => {
  const { username, password } = req.body;

  try {
    const result = await loginUser(username, password);
    res.json(result);
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: 'Błąd wewnętrzny serwera autoryzacji', message });
  }
};

export const logout = async (
  req: Request<Record<string, string>, unknown, unknown>,
  res: Response
) => {
  const token = req.headers['authentication'];

  if (!token || typeof token !== 'string') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Brakuje nagłówka Authentication.'
    });
  }

  try {
    const result = await logoutUser(token);
    res.json(result);
  } catch (err) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: 'Błąd wewnętrzny serwera autoryzacji', message });
  }
};
