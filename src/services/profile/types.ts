export type Profile = {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
  readonly avatarUrl: string | null;
};

export type UpdateProfileInput = {
  readonly displayName?: string;
  readonly avatarUrl?: string | null;
};
