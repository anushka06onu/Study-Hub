export type SubjectData = {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  totalMinutes?: number;
  totalStudyTime?: number;
};

export type TaskData = {
  id?: string;
  _id?: string;
  subjectId: string;
  title?: string;
  name?: string;
  done?: boolean;
  completed?: boolean;
  dueDate?: string;
  createdAt?: string;
};

export type SessionData = { id?: string; _id?: string; subjectId?: string; startedAt?: string; startTime?: string; endedAt?: string; minutes?: number; duration?: number };
export type UserData = { id?: string; _id?: string; email: string; name: string; token?: string; };
