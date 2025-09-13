import { create } from "zustand";
type SettingsState = {
  recordingLengthSec: number;
  motionTimestampsEnabled: boolean;
  setRecordingLength: (sec: number) => void;
  setMotionEnabled: (enabled: boolean) => void;
};
export const useSettingsState = create<SettingsState>((set) => ({
  recordingLengthSec: 10,
  motionTimestampsEnabled: true,
  setRecordingLength: (sec) =>
    set({ recordingLengthSec: Math.max(1, Math.floor(sec)) }),
  setMotionEnabled: (motionTimestampsEnabled) =>
    set({ motionTimestampsEnabled }),
}));
