export enum TaskStatus {
  DRAFT = 'DRAFT',
  AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
  ARCHIVED = 'ARCHIVED',
}

export enum TemplateStatus {
  DRAFT = 'DRAFT',
  AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
  ARCHIVED = 'ARCHIVED',
}

export enum Specialty {
  BE = 'BE',
  FE = 'FE',
  QA = 'QA',
  MOB = 'MOB',
  DEVOPS = 'DEVOPS',
}

export enum SectionType {
  REQUIREMENTS = 'REQUIREMENTS',
  CALCULATION = 'CALCULATION',
  DATA_MODEL = 'DATA_MODEL',
  API = 'API',
  HLD = 'HLD',
  LLD = 'LLD',
  RISKS = 'RISKS',
}

export enum RoomStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface ScoreScale {
  score: number;
  comment: string;
}

export interface Task {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: number;
  name: string;
  specialty: Specialty | null;
  status: TemplateStatus;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: number;
  template_id: number;
  name: string;
  description: string | null;
  order: number;
  type: SectionType;
  score_scale: ScoreScale[];
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: number;
  name: string;
  description: string | null;
  task_id: number;
  template_id: number;
  started_at: string;
  ended_at: string;
  candidate_token: string;
  reviewer_token: string;
  status: RoomStatus;
  created_at: string;
  updated_at: string;
}

export interface RoomAnswer {
  id: number;
  room_id: number;
  section_id: number;
  section_order: number;
  candidate_answer: string | null;
  reviewer_comment: string | null;
  mark: number | null;
  created_at: string;
  updated_at: string;
}

export interface RoomWithDetails extends Room {
  task: Task;
  template: Template;
  answers: (RoomAnswer & { section: Section })[];
}

export type UserRole = 'candidate' | 'reviewer';

export interface RoomSession {
  room: RoomWithDetails;
  role: UserRole;
  token: string;
}

// Flow types
export enum WayDecision {
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
}

export enum WayStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum FlowSectionType {
  HR = 'HR',
  TECH = 'TECH',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
  TEAM = 'TEAM',
}

export enum SectionDecision {
  REFUSE = 'REFUSE',
  RECOMMENDED = 'RECOMMENDED',
  PENDING = 'PENDING',
}

export enum SectionStatus {
  DRAFT = 'DRAFT',
  AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION',
  CONFIRMED = 'CONFIRMED',
  ARCHIVED = 'ARCHIVED',
}

export enum WaySectionStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  END = 'END',
}

export interface Tag {
  id: number;
  name: string;
  color: string | null;
}

export interface Candidate {
  id: number;
  full_name: string;
  description: string | null;
  specialty: string;
  links: Array<{ label?: string; url: string }>;
  created_at: string;
}

export interface WaySection {
  id: number;
  way_id: number;
  name: string;
  type: FlowSectionType;
  status: SectionStatus;
  review: string | null;
  decision: SectionDecision;
  sort_order: number;
  skill_assessments: Array<{ skill: string; score: number; comment?: string }>;
}

export interface CandidateWay {
  id: number;
  candidate_id: number;
  period_start: string | null;
  period_end: string | null;
  specialty: string;
  decision: WayDecision;
  status: WayStatus;
  created_at: string;
  tags: Tag[];
  sections: WaySection[];
  candidate: Candidate | null;
}

// Tech interview types
export enum TechTaskType {
  THEORY = 'THEORY',
  PRACTICE = 'PRACTICE',
}

export interface TechTask {
  id: number;
  name: string;
  type: TechTaskType;
  description: string | null;
  score_scale: ScoreScale[];
}

export interface TechRoomAnswer {
  id: number;
  room_id: number;
  task_id: number;
  order: number;
  candidate_answer: string | null;
  reviewer_comment: string | null;
  score: Record<string, number> | null;
  task: TechTask;
}

export interface TechRoom {
  id: number;
  name: string;
  description: string | null;
  started_at: string;
  ended_at: string;
  candidate_token: string;
  reviewer_token: string;
  status: RoomStatus;
  answers: TechRoomAnswer[];
}

export interface TechRoomSession {
  room: TechRoom;
  role: UserRole;
  token: string;
}
