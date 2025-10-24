import { useAuth, useTheme } from '@/Application/hooks';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import type { LoginCredentials } from '@/Domain/interfaces';

const Login = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  // Navigation handlers
  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values: LoginCredentials, { setSubmitting, setFieldError }) => {
      console.log('Submitting login form with', values);
      
      try {
        await login(values);
        // Handle successful login - user state will be updated automatically
      } catch (err: any) {
        console.error('Login failed:', err);
        // Set a general error or field-specific error
        setFieldError('password', 'Invalid email or password');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const inputBg = theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`${cardBg} rounded-lg shadow-xl p-8 w-full max-w-md`}>
        <h1 className="text-xl font-bold mb-8 text-center">Kaya Diagrams</h1>
        
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleSignUp}
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={handleForgotPassword}
            className={`w-full py-2 rounded-lg border transition ${
              theme === 'dark' 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Forgot Password?
          </button>
        </div>

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