import { Workstation } from './workstation.model';

export interface WorkstationWithOrder extends Workstation {
  display_order: number;
}
