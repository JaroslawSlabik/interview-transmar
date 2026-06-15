import { Request, Response } from 'express';
import { CreateProductDto } from '../dto/product.dto';
import { getAllProducts, createProduct } from '../services/product.service';

export const getProducts = async (_req: Request, res: Response) => {
  const products = await getAllProducts();
  res.json(products);
};

export const postProduct = async (
  req: Request<Record<string, string>, unknown, CreateProductDto>,
  res: Response
) => {
  const { name } = req.body as CreateProductDto;

  try {
    const product = await createProduct({ name });
    res.status(201).json(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};
