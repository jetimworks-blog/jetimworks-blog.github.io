import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { configAPI, authAPI } from '../lib/api';
import { Settings, Key, Eye, EyeOff, CheckCircle, AlertTriangle, ExternalLink, Trash2 } from 'lucide-react';

export const SettingsPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showDeleteConfigModal, setShowDeleteConfigModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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

  const handleDeleteConfig = async () => {
    setIsDeleting(true);
    try {
      await configAPI.delete();
      setHasApiKey(false);
      setShowDeleteConfigModal(false);
      toast.success('API key deleted', {
        description: 'Your Resend API key has been removed.',
      });
    } catch (error) {
      toast.error('Failed to delete API key', {
        description: error.response?.data?.error || 'Something went wrong.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast.error('Please enter your password');
      return;
    }

    setIsDeletingAccount(true);
    try {
      await authAPI.deleteAccount(deletePassword);
      // Clear local storage and redirect
      localStorage.clear();
      toast.success('Account deleted', {
        description: 'Your account has been permanently deleted.',
      });
      window.location.href = '/features';
    } catch (error) {
      toast.error('Failed to delete account', {
        description: error.response?.data?.error || 'Something went wrong.',
      });
    } finally {
      setIsDeletingAccount(false);
      setDeletePassword('');
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

              {hasApiKey && (
                <Button
                  variant="ghost"
                  className="w-full text-red-600 hover:bg-red-50"
                  onClick={() => setShowDeleteConfigModal(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete API Key
                </Button>
              )}
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

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Card className="border-red-200 bg-red-50">
            <h3 className="font-serif font-bold text-red-800 mb-2">
              Danger Zone
            </h3>
            <p className="text-sm text-red-600 mb-4">
              Once you delete your account, there is no going back. All your data will be permanently deleted.
            </p>
            <Button
              variant="danger"
              onClick={() => setShowDeleteAccountModal(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Delete Config Modal */}
      {showDeleteConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <h3 className="text-lg font-serif font-bold text-navy-900 mb-2">
              Delete API Key?
            </h3>
            <p className="text-navy-600 mb-6">
              This will remove your Resend API key from our system. You can add it again later.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfigModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfig}
                loading={isDeleting}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
          >
            <h3 className="text-lg font-serif font-bold text-red-900 mb-2">
              Delete Account?
            </h3>
            <p className="text-navy-600 mb-4">
              This action cannot be undone. All your data, including your API key and email history, will be permanently deleted.
            </p>
            <p className="text-sm text-navy-500 mb-4">
              Please enter your password to confirm.
            </p>
            <div className="relative mb-6">
              <Input
                type={showDeletePassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowDeletePassword(!showDeletePassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
              >
                {showDeletePassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeletePassword('');
                }}
                disabled={isDeletingAccount}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                loading={isDeletingAccount}
              >
                Delete Account
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
};

export default SettingsPage;
