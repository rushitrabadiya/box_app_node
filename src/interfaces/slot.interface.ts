import { IPgBase } from './pg/base.interface';

export interface ISlot extends IPgBase {
  id: number;
  slotNumber: number;
  status: 'available' | 'occupied' | 'maintenance';
  vehicleType: 'car' | 'bike' | 'truck';
  price: number;
  isReserved: boolean;
  reservedUntil?: Date;
  vehicleId?: string;
  userId?: number;
  lastOccupiedAt?: Date;
  lastVacatedAt?: Date;
  totalOccupancyTime?: number;
  totalRevenue?: number;
  notes?: string;
}

export interface ISlotCreation extends Omit<ISlot, 'id' | 'createdAt' | 'updatedAt' | 'lastOccupiedAt' | 'lastVacatedAt' | 'totalOccupancyTime' | 'totalRevenue'> {}
