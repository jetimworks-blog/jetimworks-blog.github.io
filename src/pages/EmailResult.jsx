import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Copy, Check, Mail, Sparkles, ArrowLeft, Home } from 'lucide-react';
import { useState } from 'react';

export const EmailResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, subject, to, mode } = location.state || {};
  const [copied, setCopied] = useState(false);

  if (!email) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Card>
            <p className="text-navy-600 mb-4">No email content found. Let's create one!</p>
            <Button onClick={() => navigate('/home')}>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success('Copied to clipboard!', {
        description: 'Paste it anywhere you like.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy', {
        description: 'Please try selecting and copying manually.',
      });
    }
  };

  const handleSendAnother = () => {
    navigate('/home');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Check className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-2">
            {mode === 'detailed' ? 'Your Masterpiece is Ready! ✨' : 'Email Crafted! 🎉'}
          </h1>
          <p className="text-lg text-navy-600">
            {mode === 'detailed' 
              ? 'Every detail has been perfected. Review your creation below.' 
              : 'Quick and painless. Your email is ready to send.'
            }
          </p>
        </motion.div>

        {/* Email Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated" className="overflow-hidden">
            {/* Email Header Info */}
            <div className="bg-navy-50 border-b border-navy-100 p-4">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-navy-400" />
                <span className="text-sm font-medium text-navy-700">Email Preview</span>
                {mode === 'detailed' && (
                  <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-xs rounded-full flex items-center gap-1">
                    <Sparkles size={12} />
                    Crafted with Care
                  </span>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-navy-500 w-16 flex-shrink-0">To:</span>
                  <span className="text-navy-800 font-medium">{to}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-navy-500 w-16 flex-shrink-0">Subject:</span>
                  <span className="text-navy-800 font-medium">{subject}</span>
                </div>
              </div>
            </div>

            {/* Email Content */}
            <div className="p-6 md:p-8">
              <div 
                className="prose prose-navy max-w-none"
                dangerouslySetInnerHTML={{ __html: email }}
              />
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="lg"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                Copy to Clipboard
              </>
            )}
          </Button>

          <Button
            onClick={handleSendAnother}
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Send Another
          </Button>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="inline-block">
            <p className="text-navy-500 text-sm">
              <span className="font-medium text-navy-700">Tip:</span> You can copy the HTML directly and paste it into your email platform for best results. Most email clients render HTML beautifully! 📧
            </p>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default EmailResult;
