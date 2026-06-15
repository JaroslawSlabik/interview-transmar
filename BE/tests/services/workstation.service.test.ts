import { getAllWorkstations, createWorkstation } from '../../services/workstation.service';
import { pool } from '../../config/db';

jest.mock('../../config/db', () => ({
  pool: { query: jest.fn() },
}));

const mockWorkstation = {
  id: BigInt(1),
  short_name: 'W1',
  name: 'Stanowisko 1',
  pc_name: 'PC-W1',
  created_at: new Date(),
};

describe('getAllWorkstations', () => {
  beforeEach(() => jest.clearAllMocks());

  it('powinien zwrócić listę stanowisk', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockWorkstation] });

    const result = await getAllWorkstations();

    expect(result).toEqual([mockWorkstation]);
    expect(pool.query).toHaveBeenCalledWith('SELECT * FROM workstations ORDER BY short_name DESC');
  });

  it('powinien zwrócić pustą tablicę gdy brak stanowisk', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    const result = await getAllWorkstations();

    expect(result).toEqual([]);
  });
});

describe('createWorkstation', () => {
  beforeEach(() => jest.clearAllMocks());

  it('powinien wstawić stanowisko i zwrócić je', async () => {
    const dto = { short_name: 'W2', name: 'Stanowisko 2', pc_name: 'PC-W2' };
    const created = { id: BigInt(2), ...dto, created_at: new Date() };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [created] });

    const result = await createWorkstation(dto);

    expect(result).toEqual(created);
    expect(pool.query).toHaveBeenCalledWith(
      'INSERT INTO workstations (short_name, name, pc_name) VALUES ($1, $2, $3) RETURNING *',
      ['W2', 'Stanowisko 2', 'PC-W2']
    );
  });
});
