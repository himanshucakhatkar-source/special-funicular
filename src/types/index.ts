// Core Types for Honourus Platform
export type AppMode = 'marketing' | 'tutorial' | 'workspace';

export type Theme = 'light' | 'dark' | 'ocean' | 'purple' | 'forest' | 'halloween' | 'christmas' | 'diwali' | 'winter' | 'spring' | 'desert' | 'cosmic' | 'arctic' | 'volcanic' | 'butterfly';

export type Priority = 'high' | 'medium' | 'low';

export type TaskStatus = 'todo' | 'in-progress' | 'in-review' | 'completed' | 'rejected';

export type TaskType = 'feature' | 'bug' | 'improvement' | 'research' | 'ideation';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member';
  credits: number;
  department?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  type: TaskType;
  assigneeId?: string;
  createdBy: string;
  reviewerId?: string;
  teamId?: string;
  dueDate?: Date;
  credits: number;
  requiresProof: boolean;
  proofUploaded: boolean;
  proofUrl?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  submittedAt?: Date;
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface Team {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  channelIds: string[];
  leaderId: string;
  createdAt: Date;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  teamId: string;
  memberIds: string[];
  isPrivate: boolean;
  createdAt: Date;
}

export interface Recognition {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  credits: number;
  type: 'achievement' | 'collaboration' | 'innovation' | 'leadership';
  createdAt: Date;
}

export interface Analytics {
  tasksCompleted: number;
  creditsEarned: number;
  recognitionsReceived: number;
  teamPerformance: number;
  productivityScore: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'recognition' | 'task_assigned' | 'task_completed' | 'team_invite' | 'credit_earned' | 'system';
  title: string;
  message: string;
  relatedId?: string;
  metadata?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export interface Integration {
  id: string;
  userId: string;
  service: 'jira' | 'clickup';
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  workspaceId?: string;
  workspaceName?: string;
  isActive: boolean;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditModifier {
  id: string;
  name: string;
  description?: string;
  multiplier: number;
  conditions: Record<string, any>;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface ActivityLogEntry {
  id: string;
  userId: string;
  activityType: string;
  details: Record<string, any>;
  creditsEarned: number;
  createdAt: Date;
}

// Database type helpers
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id'>;
        Update: Partial<Omit<User, 'id'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      teams: {
        Row: Team;
        Insert: Omit<Team, 'id' | 'createdAt'>;
        Update: Partial<Omit<Team, 'id' | 'createdAt'>>;
      };
      recognitions: {
        Row: Recognition;
        Insert: Omit<Recognition, 'id' | 'createdAt'>;
        Update: Partial<Omit<Recognition, 'id' | 'createdAt'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'createdAt'>;
        Update: Partial<Omit<Notification, 'id' | 'createdAt'>>;
      };
      integrations: {
        Row: Integration;
        Insert: Omit<Integration, 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Omit<Integration, 'id' | 'createdAt' | 'updatedAt'>>;
      };
      credit_modifiers: {
        Row: CreditModifier;
        Insert: Omit<CreditModifier, 'id' | 'createdAt'>;
        Update: Partial<Omit<CreditModifier, 'id' | 'createdAt'>>;
      };
      activity_log: {
        Row: ActivityLogEntry;
        Insert: Omit<ActivityLogEntry, 'id' | 'createdAt'>;
        Update: Partial<Omit<ActivityLogEntry, 'id' | 'createdAt'>>;
      };
    };
  };
}