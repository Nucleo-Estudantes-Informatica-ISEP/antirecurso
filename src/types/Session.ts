import User from './User';

export interface Session {
  token: string;
  user: User;
}
