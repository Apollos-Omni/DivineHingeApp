// src/hardware/interface.ts
export interface HardwareInterface {
  initialize(): Promise<void>;
  read(): Promise<Record<string, any>>;
  write(data: Record<string, any>): Promise<void>;
}
