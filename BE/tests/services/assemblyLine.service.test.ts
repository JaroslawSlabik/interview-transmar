import {
  getAllAssemblyLines,
  createAssemblyLine,
  updateAssemblyLine,
  deleteAssemblyLine,
} from '../../services/assemblyLine.service';
import { pool } from '../../config/db';

jest.mock('../../config/db', () => ({
  pool: { query: jest.fn() },
}));

const mockLine = {
  id: BigInt(1),
  product_id: BigInt(2),
  name: 'Linia A',
  is_active: true,
  created_at: new Date(),
};

describe('getAllAssemblyLines', () => {
  beforeEach(() => jest.clearAllMocks());

  it('powinien zwrócić wszystkie linie bez filtra', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockLine] });

    const result = await getAllAssemblyLines({});

    expect(result).toEqual([mockLine]);
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM assembly_lines ORDER BY name DESC',
      []
    );
  });

  it('powinien filtrować po productId gdy podano', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockLine] });

    await getAllAssemblyLines({ productId: BigInt(2) });

    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM assembly_lines WHERE product_id = $1 ORDER BY name DESC',
      [BigInt(2)]
    );
  });
});

describe('createAssemblyLine', () => {
  beforeEach(() => jest.clearAllMocks());

  it('powinien wstawić linię i zwrócić ją', async () => {
    const dto = { product_id: BigInt(2), name: 'Linia B', is_active: true };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: BigInt(4), ...dto, created_at: new Date() }] });

    const result = await createAssemblyLine(dto);

    expect(result.name).toBe('Linia B');
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO assembly_lines (product_id, name, is_active) VALUES ($1, $2, $3) RETURNING *',
      [BigInt(2), 'Linia B', true]
    );
  });

  it('powinien użyć domyślnego is_active=true gdy nie podano', async () => {
    const dto = { product_id: BigInt(2), name: 'Linia C' };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: BigInt(5), ...dto, is_active: true, created_at: new Date() }] });

    await createAssemblyLine(dto);

    expect(pool.query).toHaveBeenCalledWith(
      expect.any(String),
      [BigInt(2), 'Linia C', true]
    );
  });
});

describe('updateAssemblyLine', () => {
  beforeEach(() => jest.clearAllMocks());

  it('powinien zaktualizować linię i zwrócić ją', async () => {
    const dto = { name: 'Zaktualizowana', is_active: false };
    const updated = { ...mockLine, ...dto };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [updated] });

    const result = await updateAssemblyLine('1', dto);

    expect(result).toEqual(updated);
    expect(pool.query).toHaveBeenCalledWith(
      'UPDATE assembly_lines SET name = $1, is_active = $2 WHERE id = $3 RETURNING *',
      ['Zaktualizowana', false, '1']
    );
  });
});

describe('deleteAssemblyLine', () => {
  beforeEach(() => jest.clearAllMocks());

  it('powinien usunąć linię montażową', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    await deleteAssemblyLine('1');

    expect(pool.query).toHaveBeenCalledWith(
      'DELETE FROM assembly_lines WHERE id = $1',
      ['1']
    );
  });
});
