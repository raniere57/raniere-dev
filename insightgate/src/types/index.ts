export type Theme = 'dark' | 'light';

export type NavPage =
  | 'dashboard'
  | 'reports'
  | 'publish'
  | 'catalog'
  | 'users'
  | 'history'
  | 'powerbi'
  | 'exports'
  | 'alerts'
  | 'settings'
  | 'about';

export interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  workspace: string;
  responsible: string | null;
  responsibleEmail: string | null;
  status: 'published' | 'draft' | 'archived' | 'attention';
  sensitivity: 'public' | 'internal' | 'attention';
  tags: string[];
  lastUpdate: string;
  lastAccess: string;
  views: number;
  dataset: string;
  refreshFrequency: string;
  lastRefresh: string;
  refreshStatus: 'success' | 'failed' | 'delayed' | 'running';
  link: string;
  groups: string[];
  usersAccessed: string[];
  totalAccesses: number;
  isFavorite: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Gestor' | 'Visualizador';
  groups: string[];
  lastAccess: string;
  status: 'active' | 'inactive';
  reportsAllowed: number;
  avatar: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  users: number;
  reports: number;
  color: string;
}

export interface AccessEvent {
  id: string;
  datetime: string;
  user: string;
  action: string;
  report: string;
  ip: string;
  device: string;
  duration: string;
}

export interface Dataset {
  id: string;
  name: string;
  workspace: string;
  report: string;
  lastRefresh: string;
  nextRefresh: string;
  status: 'success' | 'failed' | 'delayed' | 'running';
  duration: string;
}

export interface ExportSchedule {
  id: string;
  name: string;
  report: string;
  format: 'PDF' | 'PPTX' | 'CSV';
  frequency: string;
  recipients: string;
  nextRun: string;
  status: 'active' | 'paused' | 'failed';
}

export interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'resolved' | 'ignored';
  report: string;
  datetime: string;
  responsible: string | null;
  description: string;
}
