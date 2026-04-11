import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { ArrowLeft, Send, Sparkles, ChevronRight, ChevronLeft, Check, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = ['Basics', 'Tone & Style', 'Content', 'Review'];

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
  const [errors, setErrors] = useState({});

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

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Build enhanced prompt from detailed options
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

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < 4) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 700);

    try {
      const payload = {
        process: 'gen-email',
        to: formData.to,
        subject: formData.subject,
        prompt: enhancedPrompt,
      };

      const response = await emailAPI.execute(payload);
      
      clearInterval(stepInterval);
      
      // Check if email was sent successfully
      // success: true with HTTP 200 indicates success
      // Note: output may be empty if email was directly sent
      const isSuccess = response.data.success === true || response.status === 200;
      
      if (isSuccess) {
        toast.success('Email sent! ✨', {
          description: `Your email has been delivered to ${formData.to}.`,
        });
        navigate('/result', { 
          state: { 
            email: response.data.output || 'Email sent successfully!',
            subject: formData.subject,
            to: formData.to,
            mode: 'detailed',
          }
        });
      } else {
        const errorMsg = response.data.error || 'Something went wrong. Please try again.';
        toast.error('Crafting failed', {
          description: errorMsg,
        });
        navigate('/result', {
          state: { error: errorMsg }
        });
      }
    } catch (error) {
      clearInterval(stepInterval);
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
      toast.error('Failed to craft email', {
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
                      <Minus size={16} />
                    </button>
                    <span className="w-16 text-center font-medium">{formData.wordCountMin}</span>
                    <button
                      onClick={() => updateFormData('wordCountMin', Math.min(formData.wordCountMax - 25, formData.wordCountMin + 25))}
                      className="p-2 rounded-lg border border-navy-200 hover:bg-navy-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-navy-400">to</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateFormData('wordCountMax', Math.max(formData.wordCountMin + 25, formData.wordCountMax - 25))}
                      className="p-2 rounded-lg border border-navy-200 hover:bg-navy-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-16 text-center font-medium">{formData.wordCountMax}</span>
                    <button
                      onClick={() => updateFormData('wordCountMax', Math.min(500, formData.wordCountMax + 25))}
                      className="p-2 rounded-lg border border-navy-200 hover:bg-navy-50"
                    >
                      <Plus size={16} />
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
              Review & Craft ✨
            </h2>
            <p className="text-navy-600 mb-6">
              Everything looks good? Let\'s create something special!
            </p>
            
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
            title="Crafting your masterpiece..."
            subtitle="Every detail matters"
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

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <Sparkles className="w-4 h-4 mr-2" />
                Craft My Email!
              </Button>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default DetailedEmailForm;
