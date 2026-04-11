import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { configAPI } from '../lib/api';
import { Settings, Key, Eye, EyeOff, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

export const SettingsPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await configAPI.get();
      setHasApiKey(response.data.has_resend_key || false);
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsSaving(true);
    try {
      await configAPI.set({ resend_api_key: apiKey.trim() });
      setHasApiKey(true);
      setApiKey('');
      toast.success('API key saved!', {
        description: 'Your Resend API key has been securely stored.',
      });
    } catch (error) {
      toast.error('Failed to save API key', {
        description: error.response?.data?.error || 'Something went wrong.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size={32} />
            <p className="text-navy-500">Loading settings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-navy-600 to-navy-800 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
                Settings
              </h1>
              <p className="text-navy-500">Configure your email sending setup</p>
            </div>
          </div>
        </motion.div>

        {/* API Key Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="bordered">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-brand-blue" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-bold text-navy-800">
                  Resend API Key
                </h2>
                <p className="text-sm text-navy-500">
                  Required for sending emails through Resend
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`mb-6 p-3 rounded-lg flex items-center gap-3 ${
              hasApiKey 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              {hasApiKey ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">API Key Configured</p>
                    <p className="text-xs text-green-600">You're ready to send emails!</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">API Key Required</p>
                    <p className="text-xs text-yellow-600">Add your Resend API key to send emails</p>
                  </div>
                </>
              )}
            </div>

            {/* API Key Input */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type={showKey ? 'text' : 'password'}
                  placeholder={hasApiKey ? '••••••••••••••••••••' : 're_xxxxxxxxxxxxxxxxxxxxxxxxxx'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                >
                  {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <Button
                onClick={handleSave}
                loading={isSaving}
                disabled={!apiKey.trim()}
                className="w-full"
              >
                {hasApiKey ? 'Update API Key' : 'Save API Key'}
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <Card className="bg-navy-50 border-navy-200">
            <h3 className="font-serif font-bold text-navy-800 mb-3">
              How to get your Resend API key
            </h3>
            <ol className="space-y-3 text-sm text-navy-600">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-navy-200 rounded-full flex items-center justify-center text-xs font-medium text-navy-700 flex-shrink-0">1</span>
                <span>Sign up for a free account at <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline flex items-center gap-1">Resend <ExternalLink size={12} /></a></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-navy-200 rounded-full flex items-center justify-center text-xs font-medium text-navy-700 flex-shrink-0">2</span>
                <span>Navigate to the API Keys section in your dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-navy-200 rounded-full flex items-center justify-center text-xs font-medium text-navy-700 flex-shrink-0">3</span>
                <span>Create a new API key and copy the key starting with <code className="bg-navy-100 px-1 rounded">re_</code></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-navy-200 rounded-full flex items-center justify-center text-xs font-medium text-navy-700 flex-shrink-0">4</span>
                <span>Paste it above and save. You're all set!</span>
              </li>
            </ol>
          </Card>
        </motion.div>

        {/* Security Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="border-green-200 bg-green-50">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">Your API key is secure</p>
                <p className="text-xs text-green-600 mt-1">
                  Your Resend API key is encrypted before being stored. We never share your credentials with third parties.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
