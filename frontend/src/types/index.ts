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
