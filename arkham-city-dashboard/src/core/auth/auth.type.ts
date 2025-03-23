export interface LogInData {
  accessToken: string;
  refreshToken: string;
  metadata: User;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  __v: number;
}
