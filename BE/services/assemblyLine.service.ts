import { pool } from '../config/db';
import { AssemblyLine } from '../models/assemblyLine.model';
import { AssemblyLineQueryDto, CreateAssemblyLineDto, UpdateAssemblyLineDto } from '../dto/assemblyLine.dto';

export const getAllAssemblyLines = async (query: AssemblyLineQueryDto): Promise<AssemblyLine[]> => {
  let sql = 'SELECT * FROM assembly_lines';
  const params: (string | bigint)[] = [];

  if (query.productId) {
    sql += ' WHERE product_id = $1';
    params.push(query.productId);
  }

  sql += ' ORDER BY name DESC';
  const result = await pool.query<AssemblyLine>(sql, params);
  return result.rows;
};

export const createAssemblyLine = async (dto: CreateAssemblyLineDto): Promise<AssemblyLine> => {
  const result = await pool.query<AssemblyLine>(
    'INSERT INTO assembly_lines (product_id, name, is_active) VALUES ($1, $2, $3) RETURNING *',
    [dto.product_id, dto.name, dto.is_active ?? true]
  );
  return result.rows[0];
};

export const updateAssemblyLine = async (id: string, dto: UpdateAssemblyLineDto): Promise<AssemblyLine> => {
  const result = await pool.query<AssemblyLine>(
    'UPDATE assembly_lines SET name = $1, is_active = $2 WHERE id = $3 RETURNING *',
    [dto.name, dto.is_active ?? true, id]
  );
  return result.rows[0];
};

export const deleteAssemblyLine = async (id: string) => {
  await pool.query('DELETE FROM assembly_lines WHERE id = $1', [id]);
};
