export type SchoolInfo = {
  readonly name: string;
  readonly address: string;
  readonly npsn: string;
  readonly principal: string;
  readonly phone: string;
  readonly accreditation: string;
};

export type ContributionStats = {
  readonly reportsCreated: number;
  readonly votesCount: number;
  readonly recommendationsCount: number;
  readonly pendingConfirmation: number;
  readonly inReview: number;
  readonly inRepair: number;
  readonly rejected: number;
  readonly resolved: number;
};

export type Profile = {
  readonly id: string;
  readonly displayName: string;
  readonly email: string;
  readonly avatarUrl: string | null;
};

export type UpdateProfileInput = {
  readonly displayName?: string;
  readonly avatarUrl?: string | null;
  readonly phone?: string;
  readonly birthDate?: string;
  readonly gender?: string;
  readonly classOrPosition?: string;
};

export type FullProfile = {
  readonly id: string;
  readonly email: string;
  readonly fullName: string;
  readonly role: string | null;
  readonly phone: string;
  readonly birthDate: string;
  readonly gender: string;
  readonly avatarUrl: string | null;
  readonly classOrPosition: string;
  readonly schoolInfo: SchoolInfo;
  readonly stats: ContributionStats;
};

export type ChangePasswordInput = {
  readonly currentPassword: string;
  readonly newPassword: string;
};
