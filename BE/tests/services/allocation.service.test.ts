import { getAllocationsByLine, updateAllocations, removeAllocation } from '../../services/allocation.service';
import { pool } from '../../config/db';

const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

jest.mock('../../config/db', () => ({
  pool: {
    query: jest.fn(),
    connect: jest.fn(),
  },
}));

describe('getAllocationsByLine', () => {
  beforeEach(() => jest.clearAllMocks());

  it('powinien zwrócić stanowiska przypisane do linii z kolejnością wyświetlania', async () => {
    const mockRows = [
      { id: BigInt(1), short_name: 'W1', name: 'WS1', pc_name: 'PC1', created_at: new Date(), display_order: 0 },
      { id: BigInt(2), short_name: 'W2', name: 'WS2', pc_name: 'PC2', created_at: new Date(), display_order: 1 },
    ];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockRows });

    const result = await getAllocationsByLine('10');

    expect(result).toEqual(mockRows);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('assembly_line_id = $1'),
      ['10']
    );
  });

  it('powinien zwrócić pustą tablicę gdy brak przypisań', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    const result = await getAllocationsByLine('99');

    expect(result).toEqual([]);
  });
});

describe('updateAllocations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.query.mockResolvedValue({});
    mockClient.release.mockReturnValue(undefined);
    (pool.connect as jest.Mock).mockResolvedValue(mockClient);
  });

  it('powinien wykonać BEGIN, DELETE, INSERT dla każdego stanowiska i COMMIT', async () => {
    await updateAllocations('1', { workstationIds: [BigInt(3), BigInt(5)] });

    const calls = mockClient.query.mock.calls.map((c: unknown[]) => c[0]);
    expect(calls[0]).toBe('BEGIN');
    expect(calls[1]).toBe('DELETE FROM assembly_line_workstations WHERE assembly_line_id = $1');
    expect(calls[calls.length - 1]).toBe('COMMIT');
    // BEGIN + DELETE + 2x INSERT + COMMIT = 5
    expect(mockClient.query).toHaveBeenCalledTimes(5);
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('powinien przypisać poprawną kolejność (display_order) stanowiskom', async () => {
    await updateAllocations('1', { workstationIds: [BigInt(10), BigInt(20)] });

    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO'),
      ['1', BigInt(10), 0]
    );
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO'),
      ['1', BigInt(20), 1]
    );
  });

  it('powinien wykonać ROLLBACK i zwolnić klienta gdy INSERT się nie powiedzie', async () => {
    const dbError = new Error('constraint violation');
    mockClient.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({}) // DELETE
      .mockRejectedValueOnce(dbError); // first INSERT fails

    await expect(updateAllocations('1', { workstationIds: [BigInt(3)] })).rejects.toThrow('constraint violation');

    expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK');
    expect(mockClient.release).toHaveBeenCalled();
  });

  it('powinien poprawnie obsłużyć pustą listę stanowisk (tylko BEGIN/DELETE/COMMIT)', async () => {
    await updateAllocations('1', { workstationIds: [] });

    expect(mockClient.query).toHaveBeenCalledTimes(3); // BEGIN + DELETE + COMMIT
    expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
  });
});

describe('removeAllocation', () => {
  beforeEach(() => jest.clearAllMocks());

  it('powinien usunąć przypisanie stanowiska do linii', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    await removeAllocation('1', '5');

    expect(pool.query).toHaveBeenCalledWith(
      'DELETE FROM assembly_line_workstations WHERE assembly_line_id = $1 AND workstation_id = $2',
      ['1', '5']
    );
  });
});
