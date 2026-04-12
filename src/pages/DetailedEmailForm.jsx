import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import { ArrowLeft, Send, Sparkles, ChevronRight, ChevronLeft, Eye, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = ['Basics', 'Tone & Style', 'Content', 'Preview'];

const toneOptions = [
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'friendly', label: 'Friendly', icon: '😊' },
  { value: 'casual', label: 'Casual', icon: '😎' },
  { value: 'formal', label: 'Formal', icon: '🎩' },
  { value: 'persuasive', label: 'Persuasive', icon: '🔥' },
];

const styleOptions = [
  { value: 'minimal', label: 'Minimal', desc: 'Clean and simple' },
  { value: 'bold', label: 'Bold', desc: 'Make a statement' },
  { value: 'elegant', label: 'Elegant', desc: 'Sophisticated touch' },
  { value: 'corporate', label: 'Corporate', desc: 'Business-ready' },
];

const fontOptions = [
  { value: 'serif', label: 'Serif', desc: 'Classic, elegant' },
  { value: 'sans-serif', label: 'Sans-Serif', desc: 'Modern, clean' },
  { value: 'modern', label: 'Modern', desc: 'Fresh approach' },
  { value: 'playful', label: 'Playful', desc: 'Fun and creative' },
];

export const DetailedEmailForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Basics
    to: '',
    subject: '',
    prompt: '',
    // Step 2: Tone & Style
    tone: 'professional',
    style: 'minimal',
    font: 'serif',
    // Step 3: Content
    wordCountMin: 50,
    wordCountMax: 150,
    keyMessage: '',
    includeCTA: false,
    ctaText: '',
  });
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [errors, setErrors] = useState({});

  // Preload form data from history if available
  useEffect(() => {
    const historyData = location.state?.historyItem;
    if (historyData) {
      setFormData(prev => ({
        ...prev,
        to: historyData.to || prev.to,
        subject: historyData.subject || prev.subject,
        prompt: historyData.prompt || prev.prompt,
      }));
      // Clear the state so refreshing doesn't keep preloaded data
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!validateEmail(formData.to)) {
        newErrors.to = 'Please enter a valid email address';
      }
      if (!validateRequired(formData.subject, 'Subject')) {
        newErrors.subject = 'Subject is required';
      }
      if (!validateRequired(formData.prompt, 'Main message')) {
        newErrors.prompt = 'Please tell us what your email is about';
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

  const buildEnhancedPrompt = () => {
    let enhancedPrompt = formData.prompt;
    enhancedPrompt += `\n\nTone: ${formData.tone}`;
    enhancedPrompt += `\nStyle: ${formData.style}`;
    enhancedPrompt += `\nFont preference: ${formData.font}`;
    enhancedPrompt += `\nWord count: ${formData.wordCountMin}-${formData.wordCountMax} words`;
    if (formData.keyMessage) {
      enhancedPrompt += `\nKey message to convey: ${formData.keyMessage}`;
    }
    if (formData.includeCTA && formData.ctaText) {
      enhancedPrompt += `\nCall to action: ${formData.ctaText}`;
    }
    return enhancedPrompt;
  };

  const handleGeneratePreview = async () => {
    setIsLoading(true);
    
    // Variable step durations for loading animation
    const stepDurations = [5000, 10000, 5000, 5000, 10000, 5000];
    let currentDurationIndex = 0;
    
    const progressStep = () => {
      setLoadingStep(prev => {
        if (prev < 6) {
          currentDurationIndex = prev;
          setTimeout(progressStep, stepDurations[prev]);
          return prev + 1;
        }
        return prev;
      });
    };
    
    setTimeout(progressStep, stepDurations[0]);

    try {
      // Generate HTML preview using process 'gen'
      const enhancedPrompt = buildEnhancedPrompt();
      
      const previewPayload = {
        process: 'gen',
        prompt: enhancedPrompt,
      };

      const previewResponse = await emailAPI.execute(previewPayload);
      
      if (previewResponse.data.success) {
        setGeneratedHtml(previewResponse.data.output || '');
        setCurrentStep(3); // Go to Preview step
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
      setLoadingStep(0);
    }
  };

  const handleRegeneratePreview = async () => {
    setIsLoading(true);
    
    const stepDurations = [5000, 10000, 5000, 5000, 10000, 5000];
    let currentDurationIndex = 0;
    
    const progressStep = () => {
      setLoadingStep(prev => {
        if (prev < 6) {
          currentDurationIndex = prev;
          setTimeout(progressStep, stepDurations[prev]);
          return prev + 1;
        }
        return prev;
      });
    };
    
    setTimeout(progressStep, stepDurations[0]);

    try {
      const enhancedPrompt = buildEnhancedPrompt();
      
      const previewPayload = {
        process: 'gen',
        prompt: enhancedPrompt,
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
      setLoadingStep(0);
    }
  };

  const handleSendEmail = async () => {
    setIsLoading(true);
    
    const stepDurations = [5000, 10000, 5000, 5000, 10000, 5000];
    let currentDurationIndex = 0;
    
    const progressStep = () => {
      setLoadingStep(prev => {
        if (prev < 6) {
          currentDurationIndex = prev;
          setTimeout(progressStep, stepDurations[prev]);
          return prev + 1;
        }
        return prev;
      });
    };
    
    setTimeout(progressStep, stepDurations[0]);

    try {
      // Confirm and send email with pre-generated HTML
      const confirmPayload = {
        process: 'email',
        to: formData.to,
        subject: formData.subject,
        html: generatedHtml,
      };

      const sendResponse = await emailAPI.confirm(confirmPayload);
      
      if (sendResponse.data.success) {
        toast.success('Email sent! ✨', {
          description: `Your email has been delivered to ${formData.to}.`,
        });
        navigate('/result', { 
          state: { 
            email: generatedHtml,
            subject: formData.subject,
            to: formData.to,
            mode: 'detailed',
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
      setLoadingStep(0);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-serif font-bold text-navy-800 mb-2">
              The Basics 📧
            </h2>
            <p className="text-navy-600 mb-6">
              Let\'s start with who\'s receiving this and what it\'s about.
            </p>
            
            <div className="space-y-4">
              <Input
                label="Recipient Email"
                type="email"
                placeholder="hello@recipient.com"
                value={formData.to}
                onChange={(e) => updateFormData('to', e.target.value)}
                error={errors.to}
              />
              
              <Input
                label="Subject Line"
                placeholder="Quick question about..."
                value={formData.subject}
                onChange={(e) => updateFormData('subject', e.target.value)}
                error={errors.subject}
              />
              
              <Textarea
                label="What do you want to say?"
                placeholder="I need to reach out to the marketing team about the upcoming product launch. They need to review the deck and give their feedback by Friday..."
                value={formData.prompt}
                onChange={(e) => updateFormData('prompt', e.target.value)}
                error={errors.prompt}
                rows={4}
              />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-serif font-bold text-navy-800 mb-2">
              Tone & Style 🎨
            </h2>
            <p className="text-navy-600 mb-6">
              Set the mood. How do you want this email to feel?
            </p>
            
            <div className="space-y-6">
              {/* Tone */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-3">
                  Choose a tone
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => updateFormData('tone', tone.value)}
                      className={`
                        p-3 rounded-xl border-2 transition-all text-left
                        ${formData.tone === tone.value 
                          ? 'border-brand-blue bg-brand-blue/5' 
                          : 'border-navy-200 hover:border-navy-300'}
                      `}
                    >
                      <span className="text-2xl mb-1 block">{tone.icon}</span>
                      <span className="text-sm font-medium text-navy-800">{tone.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-3">
                  Email style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {styleOptions.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => updateFormData('style', style.value)}
                      className={`
                        p-3 rounded-xl border-2 transition-all text-left
                        ${formData.style === style.value 
                          ? 'border-brand-blue bg-brand-blue/5' 
                          : 'border-navy-200 hover:border-navy-300'}
                      `}
                    >
                      <span className="text-sm font-medium text-navy-800 block">{style.label}</span>
                      <span className="text-xs text-navy-500">{style.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-3">
                  Font feel
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {fontOptions.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => updateFormData('font', font.value)}
                      className={`
                        p-3 rounded-xl border-2 transition-all text-left
                        ${formData.font === font.value 
                          ? 'border-brand-blue bg-brand-blue/5' 
                          : 'border-navy-200 hover:border-navy-300'}
                      `}
                    >
                      <span className="text-sm font-medium text-navy-800 block">{font.label}</span>
                      <span className="text-xs text-navy-500">{font.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-serif font-bold text-navy-800 mb-2">
              Content Details 📏
            </h2>
            <p className="text-navy-600 mb-6">
              Fine-tune the specifics. Make it perfect.
            </p>
            
            <div className="space-y-6">
              {/* Word Count */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-3">
                  Preferred word count
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateFormData('wordCountMin', Math.max(20, formData.wordCountMin - 25))}
                      className="p-2 rounded-lg border border-navy-200 hover:bg-navy-50"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-medium">{formData.wordCountMin}</span>
                    <button
                      onClick={() => updateFormData('wordCountMin', Math.min(formData.wordCountMax - 25, formData.wordCountMin + 25))}
                      className="p-2 rounded-lg border border-navy-200 hover:bg-navy-50"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-navy-400">to</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateFormData('wordCountMax', Math.max(formData.wordCountMin + 25, formData.wordCountMax - 25))}
                      className="p-2 rounded-lg border border-navy-200 hover:bg-navy-50"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-medium">{formData.wordCountMax}</span>
                    <button
                      onClick={() => updateFormData('wordCountMax', Math.min(500, formData.wordCountMax + 25))}
                      className="p-2 rounded-lg border border-navy-200 hover:bg-navy-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Message */}
              <Textarea
                label="Key message (optional)"
                placeholder="The most important thing I want them to remember or do after reading this..."
                value={formData.keyMessage}
                onChange={(e) => updateFormData('keyMessage', e.target.value)}
                rows={2}
              />

              {/* CTA Toggle */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-navy-700">
                    Include a call-to-action button?
                  </label>
                  <button
                    onClick={() => updateFormData('includeCTA', !formData.includeCTA)}
                    className={`
                      w-12 h-6 rounded-full transition-colors relative
                      ${formData.includeCTA ? 'bg-brand-blue' : 'bg-navy-200'}
                    `}
                  >
                    <div className={`
                      w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform
                      ${formData.includeCTA ? 'translate-x-6' : 'translate-x-0.5'}
                    `} />
                  </button>
                </div>
                
                <AnimatePresence>
                  {formData.includeCTA && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Input
                        placeholder="Book a call →"
                        value={formData.ctaText}
                        onChange={(e) => updateFormData('ctaText', e.target.value)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-xl font-serif font-bold text-navy-800 mb-2">
              Review Your Email Preview 👀
            </h2>
            <p className="text-navy-600 mb-6">
              Here\'s what your email looks like. If it needs changes, regenerate or go back to edit.
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
                className="p-6 bg-white max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: generatedHtml || '<p class="text-navy-400">No preview generated</p>' }}
              />
            </div>
            
            {/* Summary */}
            <div className="space-y-3">
              <div className="p-3 bg-navy-50 rounded-lg">
                <p className="text-xs text-navy-500 mb-1">To</p>
                <p className="text-sm font-medium text-navy-800">{formData.to}</p>
              </div>
              
              <div className="p-3 bg-navy-50 rounded-lg">
                <p className="text-xs text-navy-500 mb-1">Subject</p>
                <p className="text-sm font-medium text-navy-800">{formData.subject}</p>
              </div>
              
              <div className="p-3 bg-navy-50 rounded-lg">
                <p className="text-xs text-navy-500 mb-1">Tone & Style</p>
                <p className="text-sm font-medium text-navy-800 capitalize">
                  {formData.tone} • {formData.style} • {formData.font} font
                </p>
              </div>
              
              <div className="p-3 bg-navy-50 rounded-lg">
                <p className="text-xs text-navy-500 mb-1">Your message</p>
                <p className="text-sm text-navy-800">{formData.prompt}</p>
              </div>
              
              {formData.keyMessage && (
                <div className="p-3 bg-navy-50 rounded-lg">
                  <p className="text-xs text-navy-500 mb-1">Key message</p>
                  <p className="text-sm font-navy-800">{formData.keyMessage}</p>
                </div>
              )}
              
              {formData.includeCTA && formData.ctaText && (
                <div className="p-3 bg-brand-blue/10 rounded-lg border border-brand-blue/20">
                  <p className="text-xs text-brand-blue mb-1">Call to action</p>
                  <p className="text-sm font-medium text-brand-blue">{formData.ctaText}</p>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <MagicLoader 
            currentStep={loadingStep}
            title={currentStep === 3 ? 'Generating preview...' : 'Crafting your masterpiece...'}
            subtitle={currentStep === 3 ? 'Creating HTML email' : 'Every detail matters'}
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
            <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-navy-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-navy-900">
                Craft with Care
              </h1>
              <p className="text-navy-500">Every detail, perfected</p>
            </div>
          </div>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <ProgressSteps steps={steps} currentStep={currentStep} />
        </div>

        {/* Form Card */}
        <Card variant="bordered">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-navy-100">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep === 0 && (
              <Button onClick={handleNext}>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {currentStep === 1 && (
              <Button onClick={handleNext}>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {currentStep === 2 && (
              <Button onClick={handleGeneratePreview}>
                <Eye className="w-4 h-4 mr-2" />
                Generate Preview
              </Button>
            )}

            {currentStep === 3 && (
              <Button onClick={handleSendEmail} className="bg-gradient-to-r from-brand-blue to-navy-600 hover:from-brand-blue/90 hover:to-navy-600/90">
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

export default DetailedEmailForm;