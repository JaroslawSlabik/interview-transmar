import { Request, Response } from 'express';
import { UpdateAllocationsDto } from '../dto/allocation.dto';
import { getAllocationsByLine, updateAllocations, removeAllocation } from '../services/allocation.service';

export const getAllocations = async (
  req: Request<{ lineId: string }>,
  res: Response
) => {
  const result = await getAllocationsByLine(req.params.lineId);
  res.json(result);
};

export const postAllocations = async (
  req: Request<{ lineId: string }, unknown, UpdateAllocationsDto>,
  res: Response
) => {
  const { workstationIds } = req.body;

  if (!Array.isArray(workstationIds)) {
    res.status(400).json({ error: 'workstationIds must be an array' });
    return;
  }

  try {
    await updateAllocations(req.params.lineId, { workstationIds });
    res.json({ message: 'Allocations updated successfully with preserved order' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};

export const deleteAllocation = async (
  req: Request<{ lineId: string; workstationId: string }>,
  res: Response
) => {
  try {
    await removeAllocation(req.params.lineId, req.params.workstationId);
    res.status(244).json({ message: 'Allocation removed' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
};
