// src/types/database.ts
import type {
  User,
  Avatar,
  HingeEvent,
  KarmaRecord,
  Notification,
  UserAura,
  NeuralMirror,
  VisionTrail,
  Vision,
  Profile,
} from "../types/types";

// Optional: JSON helper type (handy if you later add JSON columns)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      avatars: {
        Row: Avatar;
        Insert: Partial<Avatar>;
        Update: Partial<Avatar>;
        Relationships: [];
      };
      users: {
        Row: User;
        Insert: Partial<User>;
        Update: Partial<User>;
        Relationships: [];
      };
      hinge_events: {
        Row: HingeEvent;
        Insert: Partial<HingeEvent>;
        Update: Partial<HingeEvent>;
        Relationships: [];
      };
      karma_records: {
        Row: KarmaRecord;
        Insert: Partial<KarmaRecord>;
        Update: Partial<KarmaRecord>;
        Relationships: [];
      };
      notifications: {
        Row: Notification;
        Insert: Partial<Notification>;
        Update: Partial<Notification>;
        Relationships: [];
      };
      user_auras: {
        Row: UserAura;
        Insert: Partial<UserAura>;
        Update: Partial<UserAura>;
        Relationships: [];
      };
      neural_mirrors: {
        Row: NeuralMirror;
        Insert: Partial<NeuralMirror>;
        Update: Partial<NeuralMirror>;
        Relationships: [];
      };
      vision_trails: {
        Row: VisionTrail;
        Insert: Partial<VisionTrail>;
        Update: Partial<VisionTrail>;
        Relationships: [];
      };
      visions: {
        Row: Vision;
        Insert: Partial<Vision>;
        Update: Partial<Vision>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
