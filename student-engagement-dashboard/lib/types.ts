export interface ClassSession {
  id: string;
  name: string;
  num_students: number;
  start_time: Date;
  duration: number;
  average_engagement: number;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  average_engagement: number;
  total_sessions: number;
  classes: string;
}
