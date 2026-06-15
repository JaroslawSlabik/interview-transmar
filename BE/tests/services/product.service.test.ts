import { getAllProducts, createProduct } from '../../services/product.service';
import { pool } from '../../config/db';

jest.mock('../../config/db', () => ({
  pool: { query: jest.fn() },
}));

describe('getAllProducts', () => {
  beforeEach(() => jest.clearAllMocks());

  it('powinien zwrócić listę produktów', async () => {
    const mockProducts = [
      { id: BigInt(1), name: 'Produkt A', created_at: new Date() },
      { id: BigInt(2), name: 'Produkt B', created_at: new Date() },
    ];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockProducts });

    const result = await getAllProducts();

    expect(result).toEqual(mockProducts);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM products ORDER BY name DESC');
  });

  it('powinien zwrócić pustą tablicę gdy brak produktów', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    const result = await getAllProducts();

    expect(result).toEqual([]);
  });
});

describe('createProduct', () => {
  beforeEach(() => jest.clearAllMocks());

  it('powinien wstawić produkt i zwrócić go', async () => {
    const newProduct = { id: BigInt(3), name: 'Nowy Produkt', created_at: new Date() };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [newProduct] });

    const result = await createProduct({ name: 'Nowy Produkt' });

    expect(result).toEqual(newProduct);
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO products (name) VALUES ($1) RETURNING *',
      ['Nowy Produkt']
    );
  });
});
