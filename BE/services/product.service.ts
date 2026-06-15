import { pool } from '../config/db';
import { Product } from '../models/product.model';
import { CreateProductDto } from '../dto/product.dto';

export const getAllProducts = async (): Promise<Product[]> => {
  const result = await pool.query<Product>('SELECT * FROM products ORDER BY name DESC');
  return result.rows;
};

export const createProduct = async (dto: CreateProductDto): Promise<Product> => {
  const result = await pool.query<Product>(
    'INSERT INTO products (name) VALUES ($1) RETURNING *',
    [dto.name]
  );
  return result.rows[0];
};
