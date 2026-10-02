export const authRoles = ["neet", "mediator", "admin", "partner"] as const;
export const authModes = [
  "sign-in",
  "register",
  "forgot-password",
  "reset-password",
] as const;
export type AuthRole = (typeof authRoles)[number];
export type AuthMode = (typeof authModes)[number];
export const roleLabels: Record<AuthRole, string> = {
  neet: "Espace jeune",
  mediator: "Espace médiateur",
  admin: "Administration régionale",
  partner: "Espace partenaire",
};
