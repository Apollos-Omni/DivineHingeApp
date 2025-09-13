import { HomeLayout } from "../types/home";

export const sampleHome: HomeLayout = {
  id: "home-1",
  name: "Galveston Bungalow",
  rooms: [
    {
      id: "living",
      name: "Living",
      polygon: [
        { x: 0.05, y: 0.08 },
        { x: 0.46, y: 0.08 },
        { x: 0.46, y: 0.42 },
        { x: 0.05, y: 0.42 },
      ],
    },
    {
      id: "kitchen",
      name: "Kitchen",
      polygon: [
        { x: 0.46, y: 0.08 },
        { x: 0.9, y: 0.08 },
        { x: 0.9, y: 0.3 },
        { x: 0.46, y: 0.3 },
      ],
    },
    {
      id: "hall",
      name: "Hall",
      polygon: [
        { x: 0.46, y: 0.3 },
        { x: 0.9, y: 0.3 },
        { x: 0.9, y: 0.5 },
        { x: 0.46, y: 0.5 },
      ],
    },
    {
      id: "bed1",
      name: "Bedroom",
      polygon: [
        { x: 0.05, y: 0.42 },
        { x: 0.5, y: 0.42 },
        { x: 0.5, y: 0.9 },
        { x: 0.05, y: 0.9 },
      ],
    },
    {
      id: "bath",
      name: "Bath",
      polygon: [
        { x: 0.5, y: 0.42 },
        { x: 0.9, y: 0.42 },
        { x: 0.9, y: 0.7 },
        { x: 0.5, y: 0.7 },
      ],
    },
  ],
  doors: [
    // Living -> Hall
    {
      id: "d-living-hall",
      name: "Living Door",
      center: { x: 0.46, y: 0.36 },
      width: 0.06,
      thickness: 0.01,
      angle: 0,
      status: "unlocked",
      targetRoomIds: ["living", "hall"],
    },
    // Kitchen -> Hall
    {
      id: "d-kitchen-hall",
      name: "Kitchen Door",
      center: { x: 0.68, y: 0.3 },
      width: 0.08,
      thickness: 0.01,
      angle: 90,
      status: "locked",
      targetRoomIds: ["kitchen", "hall"],
    },
    // Hall -> Bath
    {
      id: "d-hall-bath",
      name: "Bath Door",
      center: { x: 0.7, y: 0.42 },
      width: 0.06,
      thickness: 0.01,
      angle: 90,
      status: "ajar",
      targetRoomIds: ["hall", "bath"],
    },
    // Hall -> Bedroom
    {
      id: "d-hall-bed",
      name: "Bedroom Door",
      center: { x: 0.5, y: 0.5 },
      width: 0.1,
      thickness: 0.01,
      angle: 90,
      status: "unlocked",
      targetRoomIds: ["hall", "bed1"],
    },
  ],
};
