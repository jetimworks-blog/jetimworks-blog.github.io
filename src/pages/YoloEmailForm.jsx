import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Card } from '../components/ui/Card';
import { MagicLoader } from '../components/ui/MagicLoader';
import { ProgressSteps } from '../components/ui/ProgressSteps';
import { emailAPI } from '../lib/api';
import { validateEmail, validateRequired } from '../lib/validation';
import { ArrowLeft, Send, Mail, Zap, ChevronRight, Eye, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = ['Recipient', 'Details', 'Preview', 'Send'];

export const YoloEmailForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    prompt: '',
  });
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [errors, setErrors] = useState({});

  // Preload form data from history if available
  useEffect(() => {
    const historyData = location.state?.historyItem;
    if (historyData) {
      setFormData({
        to: historyData.to || '',
        subject: historyData.subject || '',
        prompt: historyData.prompt || '',
      });
      // Clear the state so refreshing doesn't keep preloaded data
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!validateEmail(formData.to)) {
        newErrors.to = 'Please enter a valid email address';
      }
    }
    
    if (step === 1) {
      const subjectValidation = validateRequired(formData.subject, 'Subject');
      if (!subjectValidation.valid) {
        newErrors.subject = subjectValidation.message;
      }
      
      const promptValidation = validateRequired(formData.prompt, 'Prompt');
      if (!promptValidation.valid) {
        newErrors.prompt = promptValidation.message;
      } else if (formData.prompt.length < 10) {
        newErrors.prompt = 'Please provide a bit more detail (at least 10 characters)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleGeneratePreview = async () => {
    if (!validateStep(1)) return;

    setIsLoading(true);

    try {
      // Step 1: Generate HTML preview using process 'gen'
      const previewPayload = {
        process: 'gen',
        prompt: formData.prompt,
      };

      const previewResponse = await emailAPI.execute(previewPayload);
      
      if (previewResponse.data.success) {
        setGeneratedHtml(previewResponse.data.output || '');
        setCurrentStep(2); // Go to Preview step
        toast.success('Preview generated!', {
          description: 'Review your email below before sending.',
        });
      } else {
        const errorMsg = previewResponse.data.error || 'Failed to generate preview.';
        toast.error('Preview failed', {
          description: errorMsg,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
      toast.error('Failed to generate preview', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegeneratePreview = async () => {
    setIsLoading(true);

    try {
      const previewPayload = {
        process: 'gen',
        prompt: formData.prompt,
      };

      const previewResponse = await emailAPI.execute(previewPayload);
      
      if (previewResponse.data.success) {
        setGeneratedHtml(previewResponse.data.output || '');
        toast.success('Preview regenerated!', {
          description: 'Check out the new version.',
        });
      } else {
        const errorMsg = previewResponse.data.error || 'Failed to regenerate preview.';
        toast.error('Regeneration failed', {
          description: errorMsg,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
      toast.error('Failed to regenerate preview', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    setIsLoading(true);

    try {
      // Step 3: Confirm and send email with pre-generated HTML
      const confirmPayload = {
        process: 'email',
        to: formData.to,
        subject: formData.subject,
        html: generatedHtml,
      };

      const sendResponse = await emailAPI.confirm(confirmPayload);
      
      if (sendResponse.data.success) {
        toast.success('Email sent! 🎉', {
          description: `Your email has been delivered to ${formData.to}.`,
        });
        navigate('/result', { 
          state: { 
            email: generatedHtml,
            subject: formData.subject,
            to: formData.to,
          }
        });
      } else {
        const errorMsg = sendResponse.data.error || 'Failed to send email.';
        toast.error('Send failed', {
          description: errorMsg,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
      toast.error('Failed to send email', {
        description: errorMessage,
      });
      navigate('/result', {
        state: { error: errorMessage }
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <MagicLoader 
            title={currentStep === 2 ? 'Generating preview...' : 'Crafting your email...'}
            subtitle={currentStep === 2 ? 'Creating HTML email' : 'This is the fun part!'}
            variant="generating"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-navy-600 hover:text-navy-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
                YOLO Quick Send
              </h1>
              <p className="text-navy-500">Just tell us what you need</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <ProgressSteps steps={steps} currentStep={currentStep} />
        </div>

        {/* Form Card */}
        <Card variant="bordered">
          {/* Step 0: Recipient */}
          {currentStep === 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-serif font-bold text-navy-800 mb-4">
                Who's getting this email? 📧
              </h2>
              <p className="text-navy-600 mb-6">
                Enter the recipient's email address. We'll make sure they receive something worth opening.
              </p>
              
              <div className="mb-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
                  <Input
                    name="to"
                    type="email"
                    placeholder="friend@amazing.com"
                    value={formData.to}
                    onChange={handleChange}
                    error={errors.to}
                    className="pl-12"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1: Details */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-serif font-bold text-navy-800 mb-4">
                What's this about? 📝
              </h2>
              <p className="text-navy-600 mb-6">
                Give us the subject line and a rough idea of what you want to say. Don't worry about perfect words — that's our job!
              </p>
              
              <div className="space-y-4">
                <Input
                  name="subject"
                  label="Subject Line"
                  placeholder="Quick question about the project..."
                  value={formData.subject}
                  onChange={handleChange}
                  error={errors.subject}
                />
                
                <Textarea
                  name="prompt"
                  label="Your Email Idea"
                  placeholder="I need to follow up with the team about the presentation next week. Something friendly but professional that gets them to take action..."
                  value={formData.prompt}
                  onChange={handleChange}
                  error={errors.prompt}
                  rows={5}
                  maxLength={1000}
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Preview */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-xl font-serif font-bold text-navy-800 mb-4">
                Review Your Email Preview 👀
              </h2>
              <p className="text-navy-600 mb-6">
                Here's what your email looks like. If it needs changes, regenerate or go back to edit.
              </p>
              
              {/* Preview Section */}
              <div className="border border-navy-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-navy-50 px-4 py-2 border-b border-navy-200 flex items-center justify-between">
                  <span className="text-sm font-medium text-navy-600">Email Preview</span>
                  <button
                    onClick={handleRegeneratePreview}
                    className="flex items-center gap-1 text-sm text-brand-blue hover:text-brand-blue/80 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </button>
                </div>
                <div 
                  className="p-6 bg-white max-h-96 overflow-auto [&_table]:w-full [&_*]:max-w-full"
                  dangerouslySetInnerHTML={{ __html: generatedHtml || '<p class="text-navy-400">No preview generated</p>' }}
                />
              </div>
              
              {/* Summary */}
              <div className="space-y-2 p-4 bg-navy-50 rounded-xl">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy-500">To:</span>
                  <span className="font-medium text-navy-800">{formData.to}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy-500">Subject:</span>
                  <span className="font-medium text-navy-800">{formData.subject}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-navy-100">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep === 0 && (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {currentStep === 1 && (
              <Button onClick={handleGeneratePreview}>
                <Eye className="w-4 h-4 mr-2" />
                Generate Preview
              </Button>
            )}

            {currentStep === 2 && (
              <Button onClick={handleSendEmail} className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                <Send className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default YoloEmailForm;