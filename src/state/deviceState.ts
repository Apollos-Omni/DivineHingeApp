import { create } from "zustand";

export type Device = {
  id: string;
  name: string;
  isLocked: boolean;
  createdAt: number;
};

type DeviceState = {
  devices: Device[];
  addDevice: (name: string) => void;
  renameDevice: (id: string, name: string) => void;

  /** Explicitly set a device's lock state */
  setLock: (id: string, locked: boolean) => void;

  toggleLock: (id: string) => void;
  lockAll: () => void;
  unlockAll: () => void;
  removeDevice: (id: string) => void;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const useDeviceState = create<DeviceState>((set) => ({
  devices: [],

  addDevice: (name) =>
    set((s) => ({
      devices: [
        ...s.devices,
        {
          id: uid(),
          name: name.trim() || "Door",
          isLocked: true,
          createdAt: Date.now(),
        },
      ],
    })),

  renameDevice: (id, name) =>
    set((s) => ({
      devices: s.devices.map((d) => (d.id === id ? { ...d, name } : d)),
    })),

  setLock: (id, locked) =>
    set((s) => ({
      devices: s.devices.map((d) =>
        d.id === id ? { ...d, isLocked: !!locked } : d
      ),
    })),

  toggleLock: (id) =>
    set((s) => ({
      devices: s.devices.map((d) =>
        d.id === id ? { ...d, isLocked: !d.isLocked } : d
      ),
    })),

  lockAll: () =>
    set((s) => ({
      devices: s.devices.map((d) => ({ ...d, isLocked: true })),
    })),

  unlockAll: () =>
    set((s) => ({
      devices: s.devices.map((d) => ({ ...d, isLocked: false })),
    })),

  removeDevice: (id) =>
    set((s) => ({ devices: s.devices.filter((d) => d.id !== id) })),
}));
