export const PROFILE_BASE = "/api/v1/profile";
export const PROFILE_ME_BASE = `${PROFILE_BASE}/me`;
export const PROFILE_IIDX_BASE = `${PROFILE_BASE}/iidx`;
export const PROFILE_IIDX_ME_BASE = `${PROFILE_IIDX_BASE}/me`;

export const PROFILE_USER_ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;
