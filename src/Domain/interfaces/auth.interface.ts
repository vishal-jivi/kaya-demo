export interface LoginCredentials {
    email: string;
    password: string;
  }

export interface SignupCredentials {
    email: string;
    password: string;
    role: 'admin' | 'editor' | 'viewer';
  }
  