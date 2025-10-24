import { useAuth, useTheme } from '@/Application/hooks';
import { useState } from 'react';
import type { LoginCredentials } from '@/Domain/interfaces';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting login form with', { email, password });
        
    const credentials: LoginCredentials = {
      email,
      password,
    };
    
    try {
      await login(credentials);
      // Handle successful login - user state will be updated automatically
    } catch (err: any) {
      console.error('Login failed:', err);
      // Error is already handled by the useAuth hook
    }
  };

  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`${cardBg} rounded-lg shadow-xl p-8 w-full max-w-md`}>
        <h1 className="text-xl font-bold mb-8 text-center">Kaya Diagrams</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              {/* <AlertCircle size={16} /> */}
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} text-sm`}>
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Editor: editor@test.com / qwerty</p>
          <p>Viewer: viewer@test.com / qwerty</p>
        </div>
      </div>
    </div>
  );
};

export default Login