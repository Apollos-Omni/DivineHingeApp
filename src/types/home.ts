export type Vec2 = { x: number; y: number }; // normalized [0..1] in plan bounds

export type Room = {
  id: string;
  name: string;
  // polygon in normalized coords (clockwise)
  polygon: Vec2[];
};

export type DoorStatus = "locked" | "unlocked" | "ajar";

export type Door = {
  id: string;
  name?: string;
  // center and size normalized; angle in degrees (0=right)
  center: Vec2;
  width: number; // normalized width of door leaf/opening
  thickness: number; // normalized thickness (visual)
  angle: number;
  status: DoorStatus;
  targetRoomIds?: string[]; // rooms this door connects
};

export type HomeLayout = {
  id: string;
  name: string;
  rooms: Room[];
  doors: Door[];
  // walls can be derived from rooms, but you can add explicit walls if needed
  // walls?: { a: Vec2; b: Vec2 }[];
};
