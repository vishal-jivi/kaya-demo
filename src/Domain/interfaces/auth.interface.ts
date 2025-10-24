export interface LoginCredentials {
    email: string;
    password: string;
  }

export interface SignupCredentials {
    email: string;
    password: string;
    role: 'admin' | 'editor' | 'viewer';
  }

  export interface UserDocument {
    id: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    displayName?: string;
    createdAt: number;
    updatedAt: number;
  }
  