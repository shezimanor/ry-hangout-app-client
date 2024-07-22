export interface Toast {
  id?: number;
  type: 'primary' | 'success' | 'error' | 'warning' | 'info';
  timeout: number; // ms
  content: string;
}
