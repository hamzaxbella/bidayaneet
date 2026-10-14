import type { JourneyEvent } from "./journey";
export type Role = "admin" | "mediator" | "partner" | "neet";
export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  organization: string;
};
export type CaptureLocation = { latitude:number;longitude:number;accuracy:number|null;capturedAt:string;consent:true };
export type Diagnosis = {
  location?: CaptureLocation;
  name: string;
  birthDate: string;
  gender: "F" | "M";
  phone: string;
  commune: string;
  rural: boolean;
  education: "none" | "college" | "bac" | "qualified";
  situation: "inactive" | "seeking";
  skills: string;
  interests: string;
  mobility: "local" | "regional";
  childcare: boolean;
  availability: "flexible" | "part-time";
  profile: "A" | "B" | "C";
  consent: boolean;
  partnerConsent: boolean;
  guardianName: string;
  consentAt: string;
};
export type Youth = {
  id: string;
  mediator_id: string;
  user_id: string | null;
  data: Diagnosis;
  status: string;
  review_note: string;
  created_at: string;
  updated_at: string;
  version: number;
};
export type OfferData = {
  programId?: string;
  title: string;
  organization: string;
  type: "Emploi" | "Formation" | "Stage" | "Entrepreneuriat";
  commune: string;
  minAge: number;
  maxAge: number;
  education: "any" | "bac" | "qualified";
  skills: string;
  capacity: number;
  deadline: string;
  partTime: boolean;
  childcare: boolean;
  description: string;
};
export type Offer = {
  id: string;
  partner_id: string;
  data: OfferData;
  active: boolean;
};
export type Activity = {
  id: string;
  data: {
    title: string;
    commune: string;
    date: string;
    capacity: number;
    category: string;
  };
};
export type Referral = {
  id: string;
  youth_id: string;
  offer_id: string;
  score: number;
  reasons: string[];
  status: string;
  youth_agreed: boolean;
  created_at: string;
};
export type Followup = {
  id: string;
  youth_id: string;
  due_date: string;
  note: string;
  outcome: string;
};
export type Appointment = {
  id: string;
  youth_id: string;
  starts_at: string;
  title: string;
  location: string;
};
export type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
};
export type AccessRequest = {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: string;
  status: string;
};
export type PlatformData = {
  user: User;
  journeys?: JourneyEvent[];
  people: Youth[];
  offers: Offer[];
  activities: Activity[];
  referrals: Referral[];
  followups: Followup[];
  appointments: Appointment[];
  messages: Message[];
  contacts: User[];
  participations: {
    id: string;
    youth_id: string;
    activity_id: string;
    attended: boolean;
  }[];
  requests: AccessRequest[];
  audit: {
    id: string;
    actor_id: string;
    action: string;
    entity_id: string;
    created_at: string;
  }[];
};
