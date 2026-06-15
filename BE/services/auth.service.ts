import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { pool } from '../config/db';
import { redisClient } from '../config/redis';
import { User } from '../models/user.model';
import { LoginResponseDto, LogoutResponseDto } from '../dto/auth.dto';
import { AppError } from '../errors/AppError';

export const loginUser = async (username: string, password: string): Promise<LoginResponseDto> => {
  const userResult = await pool.query<User>('SELECT * FROM users WHERE username = $1', [username]);
  const user = userResult.rows[0];

  if (!user) {
    throw new AppError(401, 'Invalid username or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError(401, 'Invalid username or password');
  }

  const token = randomUUID();

  await redisClient.set(token, String(user.id), { EX: 3600 });

  return { message: 'Login successful', token, expires_in: '1h' };
};

export const logoutUser = async (token: string): Promise<LogoutResponseDto> => {
  try {

    await redisClient.del(token);

    return {
        message: "OK"
    }

  } catch (err: any) {
    return {
        message: err.message
    }
  }
};
