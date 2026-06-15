import { pool } from '../config/db';
import { Workstation } from '../models/workstation.model';
import { CreateWorkstationDto } from '../dto/workstation.dto';

export const getAllWorkstations = async (): Promise<Workstation[]> => {
  const result = await pool.query<Workstation>('SELECT * FROM workstations ORDER BY short_name DESC');
  return result.rows;
};

export const createWorkstation = async (dto: CreateWorkstationDto): Promise<Workstation> => {
  const result = await pool.query<Workstation>(
    'INSERT INTO workstations (short_name, name, pc_name) VALUES ($1, $2, $3) RETURNING *',
    [dto.short_name, dto.name, dto.pc_name]
  );
  return result.rows[0];
};
