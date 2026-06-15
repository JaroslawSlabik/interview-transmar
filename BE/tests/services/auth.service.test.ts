import { loginUser } from '../../services/auth.service';
import { pool } from '../../config/db';
import { redisClient } from '../../config/redis';
import bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AppError } from '../../errors/AppError';

jest.mock('../../config/db', () => ({
  pool: { query: jest.fn() },
}));

jest.mock('../../config/redis', () => ({
  redisClient: {
    set: jest.fn(),
  },
}));

jest.mock('bcrypt');
jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('loginUser', () => {
  const mockUser = {
    id: BigInt(1),
    username: 'admin',
    password: 'hashed_password',
    first_name: 'Jan',
    last_name: 'Kowalski',
    created_at: new Date(),
    last_login_at: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (crypto.randomUUID as jest.Mock).mockReturnValue('test-uuid-1234');
    (redisClient.set as jest.Mock).mockResolvedValue('OK');
  });

  it('powinien rzucić AppError(401) gdy użytkownik nie istnieje', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    await expect(loginUser('nieznany', 'pass')).rejects.toBeInstanceOf(AppError);
    await expect(loginUser('nieznany', 'pass')).rejects.toMatchObject({ statusCode: 401 });
  });

  it('powinien rzucić AppError(401) gdy hasło jest nieprawidłowe', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(loginUser('admin', 'złe_hasło')).rejects.toBeInstanceOf(AppError);
    await expect(loginUser('admin', 'złe_hasło')).rejects.toMatchObject({ statusCode: 401 });
  });

  it('powinien zwrócić token gdy dane logowania są poprawne', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await loginUser('admin', 'poprawne_hasło');

    expect(result).toEqual({
      message: 'Login successful',
      token: 'test-uuid-1234',
      expires_in: '1h',
    });
  });

  it('powinien zapisać token w Redis z TTL 3600', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await loginUser('admin', 'poprawne_hasło');

    expect(redisClient.set).toHaveBeenCalledWith('test-uuid-1234', '1', { EX: 3600 });
  });

  it('powinien odpytać bazę danych z podaną nazwą użytkownika', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await loginUser('admin', 'poprawne_hasło');

    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE username = $1',
      ['admin']
    );
  });
});
