import { User } from '../user/user.types';
export enum Status {
  new = 'new',
  inProgress = 'in-progress',
  cancelled = 'cancelled',
  resolved = 'resolved',
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status?: Status;
  assignee?: User;
}
