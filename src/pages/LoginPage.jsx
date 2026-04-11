import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { validateEmail, validatePassword } from '../lib/validation';
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/home';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Welcome back!', {
          description: 'You\'re now signed in. Let\'s craft some emails!',
        });
        navigate(from, { replace: true });
      } else {
        toast.error('Login failed', {
          description: result.error || 'Please check your credentials and try again.',
        });
      }
    } catch (error) {
      toast.error('Something went wrong', {
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 bg-brand-blue rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-serif font-bold text-navy-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-navy-600">
              Sign in to continue crafting amazing emails
            </p>
          </div>

          {/* Form */}
          <Card variant="bordered">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                  <Input
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    className="pl-12"
                    autoComplete="email"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                  <Input
                    name="password"
                    type="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    className="pl-12"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-navy-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-navy-400">or</span>
              </div>
            </div>

            {/* Register Link */}
            <p className="text-center text-navy-600 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-brand-blue hover:text-navy-700 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-navy-400 hover:text-navy-600 transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage;
