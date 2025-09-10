export type Session = {
  user: { id: string; email?: string | null } | null;
  access_token?: string;
  refresh_token?: string;
  // add fields as you actually use them
};
