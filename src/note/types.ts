export type NoteType = Record<string, any> | null;

export type NoteState = {
  notes: NoteType[];
  loading: boolean;
};

export type NoteContextValue = {
  notes: NoteType[];
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
