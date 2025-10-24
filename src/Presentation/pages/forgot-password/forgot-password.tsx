import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { useTheme } from '@/Application/hooks';

const ForgotPassword = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Navigation handlers
  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      console.log('Submitting forgot password form with', values);
      
      try {
        // TODO: Implement actual password reset logic here
        // For now, just simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message (you might want to add a success state)
        alert('Password reset email sent! Please check your inbox.');
        navigate('/login');
      } catch (err: any) {
        console.error('Password reset failed:', err);
        setFieldError('email', 'Failed to send reset email. Please try again.');
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
        <h1 className="text-xl font-bold mb-8 text-center">Reset Password</h1>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
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
              placeholder="Enter your email address"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleBackToLogin}
            className={`w-full py-2 rounded-lg border transition ${
              theme === 'dark' 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
