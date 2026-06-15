import { Request, Response } from 'express';
import { CreateWorkstationDto } from '../dto/workstation.dto';
import { getAllWorkstations, createWorkstation } from '../services/workstation.service';

export const getWorkstations = async (_req: Request, res: Response) => {
  const workstations = await getAllWorkstations();
  res.json(workstations);
};

export const postWorkstation = async (
  req: Request<Record<string, string>, unknown, CreateWorkstationDto>,
  res: Response
) => {
  try {
    const workstation = await createWorkstation(req.body);
    res.status(201).json(workstation);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
};
