import { pool } from '../config/db';
import { WorkstationWithOrder } from '../models/allocation.model';
import { UpdateAllocationsDto } from '../dto/allocation.dto';

export const getAllocationsByLine = async (lineId: string): Promise<WorkstationWithOrder[]> => {
  const query = `
    SELECT
        w.*, alw.display_order
    FROM
        workstations w
        JOIN assembly_line_workstations alw ON w.id = alw.workstation_id AND alw.assembly_line_id = $1
    ORDER BY
        alw.display_order ASC;
  `;
  const result = await pool.query<WorkstationWithOrder>(query, [lineId]);
  return result.rows;
};

export const updateAllocations = async (lineId: string, dto: UpdateAllocationsDto) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query('DELETE FROM assembly_line_workstations WHERE assembly_line_id = $1', [lineId]);

    for (let i = 0; i < dto.workstationIds.length; i++) {
      await client.query(
        `INSERT INTO
            assembly_line_workstations (assembly_line_id, workstation_id, display_order)
         VALUES
            ($1, $2, $3)`,
        [lineId, dto.workstationIds[i], i]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const removeAllocation = async (lineId: string, workstationId: string) => {
  await pool.query(
    'DELETE FROM assembly_line_workstations WHERE assembly_line_id = $1 AND workstation_id = $2',
    [lineId, workstationId]
  );
};
