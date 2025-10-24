import { useAuth, useTheme } from '@/Application/hooks';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import type { SignupCredentials } from '@/Domain/interfaces';

const Signup = () => {
  const { theme } = useTheme();
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Navigation handlers
  const handleLogin = () => {
    navigate('/login');
  };

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    role: Yup.string()
      .oneOf(['admin', 'editor', 'viewer'], 'Please select a valid role')
      .required('Role is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      role: '' as 'admin' | 'editor' | 'viewer' | '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      console.log('Submitting signup form with', values);
      
      // Type assertion to ensure role is not empty string
      const signupData: SignupCredentials = {
        email: values.email,
        password: values.password,
        role: values.role as 'admin' | 'editor' | 'viewer',
      };
      
      try {
        await signup(signupData);
        // Handle successful signup - redirect to login or dashboard
        navigate('/login');
      } catch (err: any) {
        console.error('Signup failed:', err);
        // Set a general error or field-specific error
        setFieldError('email', 'Email already exists or signup failed');
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

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 rounded-lg border ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.role}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Back to Login
          </button>
        </div>

        <div className={`mt-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} text-sm`}>
          <p className="font-semibold mb-2">Role Descriptions:</p>
          <p><strong>Admin:</strong> Full access to all features</p>
          <p><strong>Editor:</strong> Can create and edit diagrams</p>
          <p><strong>Viewer:</strong> Can only view diagrams</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
