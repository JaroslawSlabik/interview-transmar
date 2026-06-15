import { Request, Response } from 'express';
import { AssemblyLineQueryDto, CreateAssemblyLineDto, UpdateAssemblyLineDto } from '../dto/assemblyLine.dto';
import {
  getAllAssemblyLines,
  createAssemblyLine,
  updateAssemblyLine,
  deleteAssemblyLine,
} from '../services/assemblyLine.service';

export const getAssemblyLines = async (
  req: Request<Record<string, string>, unknown, unknown, AssemblyLineQueryDto>,
  res: Response
) => {
  const lines = await getAllAssemblyLines(req.query);
  res.json(lines);
};

export const postAssemblyLine = async (
  req: Request<Record<string, string>, unknown, CreateAssemblyLineDto>,
  res: Response
) => {
  try {
    const line = await createAssemblyLine(req.body);
    res.status(201).json(line);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const putAssemblyLine = async (
  req: Request<{ id: string }, unknown, UpdateAssemblyLineDto>,
  res: Response
) => {
  try {
    const line = await updateAssemblyLine(req.params.id, req.body);
    res.json(line);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const deleteAssemblyLineHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  await deleteAssemblyLine(req.params.id);
  res.status(204).send();
};
