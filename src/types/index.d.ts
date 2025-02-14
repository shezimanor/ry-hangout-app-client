export interface Toast {
  id?: number;
  type: 'primary' | 'success' | 'error' | 'warning' | 'info';
  timeout: number; // ms
  content: string;
}
export interface Message {
  userId: string;
  userName: string;
  content: string;
}

export interface User {
  id: string;
  name: string;
}
export interface Users {
  [i: string]: string;
}
