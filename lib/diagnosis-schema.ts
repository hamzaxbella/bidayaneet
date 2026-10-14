import { z } from "zod";
import { ageAt } from "./matching";
const text = (max = 200) => z.string().trim().min(1).max(max);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v,
  );
const timestamp = z.iso.datetime({ offset: true });
export const diagnosisSchema = z
  .object({
    location: z.object({latitude:z.number().min(-90).max(90),longitude:z.number().min(-180).max(180),accuracy:z.number().min(0).max(100000).nullable(),capturedAt:timestamp,consent:z.literal(true)}).refine(v=>Date.parse(v.capturedAt)<=Date.now()+60000,{message:"Date de localisation invalide."}).optional(),
    name: text(120),
    birthDate: date,
    gender: z.enum(["F", "M"]),
    phone: z.string().regex(/^\+?[0-9\s-]{8,20}$/),
    commune: text(100),
    rural: z.boolean(),
    education: z.enum(["none", "college", "bac", "qualified"]),
    situation: z.enum(["inactive", "seeking"]),
    skills: text(500),
    interests: text(500),
    mobility: z.enum(["local", "regional"]),
    childcare: z.boolean(),
    availability: z.enum(["flexible", "part-time"]),
    profile: z.enum(["A", "B", "C"]),
    consent: z.literal(true),
    partnerConsent: z.boolean(),
    guardianName: z.string().trim().max(120),
    consentAt: timestamp,
  })
  .superRefine((d, ctx) => {
    const age = ageAt(d.birthDate);
    if (age < 15 || age > 29)
      ctx.addIssue({
        code: "custom",
        message: "Âge attendu : 15 à 29 ans.",
        path: ["birthDate"],
      });
    if (age < 18 && d.guardianName.length < 2)
      ctx.addIssue({
        code: "custom",
        message: "Le consentement du représentant légal est requis.",
        path: ["guardianName"],
      });
    if (Date.parse(d.consentAt) > Date.now() + 60_000)
      ctx.addIssue({
        code: "custom",
        message: "Date de consentement invalide.",
        path: ["consentAt"],
      });
  });
