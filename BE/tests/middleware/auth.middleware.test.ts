import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { redisClient } from '../../config/redis';

jest.mock('../../config/redis', () => ({
  redisClient: {
    get: jest.fn(),
  },
}));

describe('authMiddleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = { headers: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('powinien zwrócić 401 gdy brak nagłówka Authentication', async () => {
    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
      message: 'Brakuje nagłówka Authentication.',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('powinien zwrócić 401 gdy token nie istnieje w Redis', async () => {
    mockRequest.headers = { authentication: 'nieznany-token' };
    (redisClient.get as jest.Mock).mockResolvedValue(null);

    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Unauthorized',
      message: 'Token wygasł lub jest nieprawidłowy.',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('powinien wywołać next() gdy token jest prawidłowy', async () => {
    mockRequest.headers = { authentication: 'prawidłowy-token' };
    (redisClient.get as jest.Mock).mockResolvedValue('42');

    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('powinien zwrócić 500 gdy Redis rzuca błąd', async () => {
    mockRequest.headers = { authentication: 'jakis-token' };
    (redisClient.get as jest.Mock).mockRejectedValue(new Error('Redis unavailable'));

    await authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction as NextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Błąd wewnętrzny serwera autoryzacji' })
    );
  });
});
