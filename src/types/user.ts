// ==============================================
// File: src/types/user.ts
// Purpose: app-local user types that won't collide with library `User`
// ==============================================
export interface ActiveVision {
title: string;
id?: string;
}


export interface AppUser {
id?: string;
name?: string | null;
role?: string | null;
karma: number; // required in-app
activeVision?: ActiveVision | null;
avatarUrl?: string | null;
}