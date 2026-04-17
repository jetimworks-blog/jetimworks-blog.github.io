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
import { emailAPI, configAPI } from '../lib/api';
import { validateEmail, validateRequired } from '../lib/validation';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Send, Sparkles, ChevronRight, ChevronLeft, Eye, RefreshCw, Pencil, List } from 'lucide-react';
import { Link } from 'react-router-dom';

// Helper function to extract name from email address
const extractNameFromEmail = (email) => {
  if (!email) return 'User';
  const localPart = email.split('@')[0];
  // Handle common patterns like john.doe, john_doe, johndoe, john
  const nameParts = localPart.split(/[._-]/);
  // Capitalize first letter of each part
  return nameParts
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

// Helper function to get the sender name to use in the instruction
const getSenderName = (user, fromName) => {
  if (fromName && fromName.trim() && fromName.trim() !== 'Anonymous') {
    return fromName.trim();
  }
  return extractNameFromEmail(user?.email);
};


const steps = ['Basics', 'Tone & Style', 'Content', 'Preview'];

const toneOptions = [
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'friendly', label: 'Friendly', icon: '😊' },
  { value: 'casual', label: 'Casual', icon: '😎' },
  { value: 'formal', label: 'Formal', icon: '🎩' },
  { value: 'persuasive', label: 'Persuasive', icon: '🔥' },
];

const customTonePlaceholder = `Describe the tone and style you want for your email...

Example: "Warm and approachable, like a mentor giving feedback over coffee. Professional but not stiff, with a touch of humor. Think of an email from your favorite professor who genuinely cares about your success."`;

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

const colorOptions = [
  { value: 'navy', label: 'Navy Blue', color: '#1e3a5f', icon: '🔵' },
  { value: 'ocean', label: 'Ocean Blue', color: '#0077b6', icon: '🌊' },
  { value: 'forest', label: 'Forest Green', color: '#2d6a4f', icon: '🌲' },
  { value: 'sunset', label: 'Sunset Orange', color: '#e76f51', icon: '🌅' },
  { value: 'berry', label: 'Berry Purple', color: '#7b2cbf', icon: '🍇' },
  { value: 'midnight', label: 'Midnight', color: '#1a1a2e', icon: '🌙' },
  { value: 'rose', label: 'Rose Gold', color: '#b76e79', icon: '🌹' },
  { value: 'slate', label: 'Slate Gray', color: '#4a5568', icon: '⬜' },
];

const feelOptions = [
  { value: 'professional', label: 'Professional', icon: '💼', desc: 'Business-ready' },
  { value: 'warm', label: 'Warm & Friendly', icon: '🤗', desc: 'Approachable' },
  { value: 'bold', label: 'Bold & Confident', icon: '💪', desc: 'Strong presence' },
  { value: 'elegant', label: 'Elegant', icon: '✨', desc: 'Sophisticated' },
  { value: 'playful', label: 'Playful', icon: '🎉', desc: 'Fun & energetic' },
  { value: 'minimal', label: 'Minimal', icon: '◻️', desc: 'Clean & simple' },
  { value: 'creative', label: 'Creative', icon: '🎨', desc: 'Artistic flair' },
  { value: 'trustworthy', label: 'Trustworthy', icon: '🛡️', desc: 'Reliable feel' },
];

const widthOptions = [
  { value: '50', label: 'Compact', desc: '50% width - narrow email' },
  { value: '70', label: 'Standard', desc: '70% width - balanced layout' },
  { value: '100', label: 'Full Width', desc: '100% width - expansive' },
];

const borderRadiusOptions = [
  { value: 'none', label: 'None', desc: 'Sharp corners' },
  { value: 'small', label: 'Small', desc: 'Subtle rounding' },
  { value: 'medium', label: 'Medium', desc: 'Moderate rounding' },
  { value: 'large', label: 'Large', desc: 'Rounded corners' },
  { value: 'pill', label: 'Pill', desc: 'Fully rounded' },
];

const shadowOptions = [
  { value: 'none', label: 'None', desc: 'Flat design' },
  { value: 'light', label: 'Light', desc: 'Subtle shadow' },
  { value: 'medium', label: 'Medium', desc: 'Moderate depth' },
  { value: 'heavy', label: 'Heavy', desc: 'Strong depth' },
];

const spacingOptions = [
  { value: 'tight', label: 'Tight', desc: 'Compact spacing' },
  { value: 'normal', label: 'Normal', desc: 'Balanced spacing' },
  { value: 'spacious', label: 'Spacious', desc: ' airy feel' },
];

const headerStyleOptions = [
  { value: 'none', label: 'None', desc: 'No header image' },
  { value: 'banner', label: 'Banner', desc: 'Full-width banner' },
  { value: 'logo', label: 'Logo Center', desc: 'Centered logo' },
  { value: 'split', label: 'Split Design', desc: 'Text + image' },
];

export const DetailedEmailForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fromName, setFromName] = useState('');
  const [formData, setFormData] = useState({
    // Step 1: Basics
    to: '',
    subject: '',
    prompt: '',
    // Step 2: Tone & Style
    tone: 'professional',
    style: 'minimal',
    font: 'serif',
    color: 'navy',
    feel: 'professional',
    emailWidth: '70',
    borderRadius: 'medium',
    shadow: 'light',
    spacing: 'normal',
    headerStyle: 'none',
    // Step 3: Content
    wordCountMin: 50,
    wordCountMax: 150,
    keyMessage: '',
    includeCTA: false,
    ctaText: '',
  });
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [errors, setErrors] = useState({});
  const [useCustomTone, setUseCustomTone] = useState(false);
  const [customTone, setCustomTone] = useState('');

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

  // Fetch config to get from_name
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await configAPI.get();
        setFromName(response.data.from_name || 'Anonymous');
      } catch (error) {
        console.error('Failed to load config:', error);
        setFromName('Anonymous');
      }
    };
    loadConfig();
  }, []);

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
    
    // Include tone - either from preset or custom description
    if (useCustomTone && customTone.trim()) {
      // Only use custom description, skip all preset styles
      enhancedPrompt += `\n\nTone & Style Description: ${customTone}`;
    } else {
      // Use preset styles
      enhancedPrompt += `\n\nTone: ${formData.tone}`;
      enhancedPrompt += `\nStyle: ${formData.style}`;
      enhancedPrompt += `\nFont preference: ${formData.font}`;
      enhancedPrompt += `\nColor theme: ${formData.color}`;
      enhancedPrompt += `\nOverall feel: ${formData.feel}`;
      enhancedPrompt += `\nEmail width: ${formData.emailWidth}%`;
      enhancedPrompt += `\nBorder radius: ${formData.borderRadius}`;
      enhancedPrompt += `\nShadow depth: ${formData.shadow}`;
      enhancedPrompt += `\nContent spacing: ${formData.spacing}`;
      enhancedPrompt += `\nHeader style: ${formData.headerStyle}`;
    }
    
    // Always include word count
    enhancedPrompt += `\nWord count: ${formData.wordCountMin}-${formData.wordCountMax} words`;
    if (formData.keyMessage) {
      enhancedPrompt += `\nKey message to convey: ${formData.keyMessage}`;
    }
    if (formData.includeCTA && formData.ctaText) {
      enhancedPrompt += `\nCall to action: ${formData.ctaText}`;
    }
    // Append sender name instruction
    const senderName = getSenderName(user, fromName);
    enhancedPrompt += `\n\nSign the email that it is from ${senderName}.`;
    return enhancedPrompt;
  };

  const handleGeneratePreview = async () => {
    setIsLoading(true);

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
        // Save prompt to sessionStorage for the confirm step
        sessionStorage.setItem('pendingPrompt', enhancedPrompt);
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
    }
  };

  const handleRegeneratePreview = async () => {
    setIsLoading(true);

    try {
      const enhancedPrompt = buildEnhancedPrompt();
      
      const previewPayload = {
        process: 'gen',
        prompt: enhancedPrompt,
      };

      const previewResponse = await emailAPI.execute(previewPayload);
      
      if (previewResponse.data.success) {
        setGeneratedHtml(previewResponse.data.output || '');
        // Update prompt in sessionStorage for the confirm step
        sessionStorage.setItem('pendingPrompt', enhancedPrompt);
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
      // Get the prompt from sessionStorage
      const savedPrompt = sessionStorage.getItem('pendingPrompt') || '';
      
      // Confirm and send email with pre-generated HTML
      const confirmPayload = {
        process: 'email',
        to: formData.to,
        subject: formData.subject,
        html: generatedHtml,
        prompt: savedPrompt,
      };

      const sendResponse = await emailAPI.confirm(confirmPayload);
      
      if (sendResponse.data.success) {
        // Clear the prompt from sessionStorage after successful send
        sessionStorage.removeItem('pendingPrompt');
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
              Let's start with who's receiving this and what it's about.
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
            
            <div className="space-y-8">
              {/* Tone Toggle */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-navy-700">
                    Choose how to define your tone
                  </label>
                </div>
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => setUseCustomTone(false)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all
                      ${!useCustomTone 
                        ? 'border-brand-blue bg-brand-blue/5' 
                        : 'border-navy-200 hover:border-navy-300'}
                    `}
                  >
                    <List className="w-4 h-4" />
                    <span className="text-sm font-medium">Pick presets</span>
                  </button>
                  <button
                    onClick={() => setUseCustomTone(true)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all
                      ${useCustomTone 
                        ? 'border-brand-blue bg-brand-blue/5' 
                        : 'border-navy-200 hover:border-navy-300'}
                    `}
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="text-sm font-medium">Describe my own</span>
                  </button>
                </div>
              </div>

              {/* Preset Tone Options */}
              <AnimatePresence>
                {!useCustomTone && (
                  <motion.div
                    key="preset-tone"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-navy-700 mb-3">
                      Choose a tone
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
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
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Custom Tone Input */}
              <AnimatePresence>
                {useCustomTone && (
                  <motion.div
                    key="custom-tone"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-navy-700 mb-3">
                      Describe your desired tone & style
                    </label>
                    <Textarea
                      placeholder={customTonePlaceholder}
                      value={customTone}
                      onChange={(e) => setCustomTone(e.target.value)}
                      rows={5}
                      className="bg-navy-50 border-navy-200 focus:bg-white"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* All other styling options - only show when using presets */}
              <AnimatePresence>
                {!useCustomTone && (
                  <motion.div
                    key="all-options"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Colors */}
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-3">
                        Color theme
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {colorOptions.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => updateFormData('color', color.value)}
                            className={`
                              p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3
                              ${formData.color === color.value 
                                ? 'border-brand-blue bg-brand-blue/5' 
                                : 'border-navy-200 hover:border-navy-300'}
                            `}
                          >
                            <span 
                              className="w-6 h-6 rounded-full flex-shrink-0 border border-navy-200" 
                              style={{ backgroundColor: color.color }}
                            />
                            <span className="text-sm font-medium text-navy-800">{color.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Feel */}
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-3">
                        Overall feel
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {feelOptions.map((feel) => (
                          <button
                            key={feel.value}
                            onClick={() => updateFormData('feel', feel.value)}
                            className={`
                              p-3 rounded-xl border-2 transition-all text-left
                              ${formData.feel === feel.value 
                                ? 'border-brand-blue bg-brand-blue/5' 
                                : 'border-navy-200 hover:border-navy-300'}
                            `}
                          >
                            <span className="text-xl mb-1 block">{feel.icon}</span>
                            <span className="text-sm font-medium text-navy-800 block">{feel.label}</span>
                            <span className="text-xs text-navy-500">{feel.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Email Width */}
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-3">
                        Email width
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {widthOptions.map((width) => (
                          <button
                            key={width.value}
                            onClick={() => updateFormData('emailWidth', width.value)}
                            className={`
                              p-3 rounded-xl border-2 transition-all text-left
                              ${formData.emailWidth === width.value 
                                ? 'border-brand-blue bg-brand-blue/5' 
                                : 'border-navy-200 hover:border-navy-300'}
                            `}
                          >
                            <span className="text-sm font-medium text-navy-800 block">{width.label}</span>
                            <span className="text-xs text-navy-500">{width.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Border Radius */}
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-3">
                        Corner style
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {borderRadiusOptions.map((radius) => (
                          <button
                            key={radius.value}
                            onClick={() => updateFormData('borderRadius', radius.value)}
                            className={`
                              p-3 rounded-xl border-2 transition-all text-left
                              ${formData.borderRadius === radius.value 
                                ? 'border-brand-blue bg-brand-blue/5' 
                                : 'border-navy-200 hover:border-navy-300'}
                            `}
                          >
                            <span className="text-sm font-medium text-navy-800 block">{radius.label}</span>
                            <span className="text-xs text-navy-500">{radius.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Shadow */}
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-3">
                        Shadow depth
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {shadowOptions.map((shadow) => (
                          <button
                            key={shadow.value}
                            onClick={() => updateFormData('shadow', shadow.value)}
                            className={`
                              p-3 rounded-xl border-2 transition-all text-left
                              ${formData.shadow === shadow.value 
                                ? 'border-brand-blue bg-brand-blue/5' 
                                : 'border-navy-200 hover:border-navy-300'}
                            `}
                          >
                            <span className="text-sm font-medium text-navy-800 block">{shadow.label}</span>
                            <span className="text-xs text-navy-500">{shadow.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Spacing */}
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-3">
                        Content spacing
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {spacingOptions.map((spacing) => (
                          <button
                            key={spacing.value}
                            onClick={() => updateFormData('spacing', spacing.value)}
                            className={`
                              p-3 rounded-xl border-2 transition-all text-left
                              ${formData.spacing === spacing.value 
                                ? 'border-brand-blue bg-brand-blue/5' 
                                : 'border-navy-200 hover:border-navy-300'}
                            `}
                          >
                            <span className="text-sm font-medium text-navy-800 block">{spacing.label}</span>
                            <span className="text-xs text-navy-500">{spacing.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Header Style */}
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-3">
                        Header style
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {headerStyleOptions.map((header) => (
                          <button
                            key={header.value}
                            onClick={() => updateFormData('headerStyle', header.value)}
                            className={`
                              p-3 rounded-xl border-2 transition-all text-left
                              ${formData.headerStyle === header.value 
                                ? 'border-brand-blue bg-brand-blue/5' 
                                : 'border-navy-200 hover:border-navy-300'}
                            `}
                          >
                            <span className="text-sm font-medium text-navy-800 block">{header.label}</span>
                            <span className="text-xs text-navy-500">{header.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font */}
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-3">
                        Font style
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

                    {/* Style */}
                    <div>
                      <label className="block text-sm font-medium text-navy-700 mb-3">
                        Overall style
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
                  </motion.div>
                )}
              </AnimatePresence>
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
                {useCustomTone && customTone.trim() ? (
                  <p className="text-sm text-navy-800 italic">Custom: {customTone.substring(0, 100)}{customTone.length > 100 ? '...' : ''}</p>
                ) : (
                  <p className="text-sm font-medium text-navy-800 capitalize">
                    {formData.tone} • {formData.style}
                  </p>
                )}
              </div>

              <div className="p-3 bg-navy-50 rounded-lg">
                <p className="text-xs text-navy-500 mb-1">Design Choices</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full text-xs">
                    <span 
                      className="w-3 h-3 rounded-full border border-navy-200" 
                      style={{ backgroundColor: colorOptions.find(c => c.value === formData.color)?.color || '#1e3a5f' }}
                    />
                    {colorOptions.find(c => c.value === formData.color)?.label}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-white rounded-full text-xs">
                    {formData.emailWidth}% width
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-white rounded-full text-xs capitalize">
                    {formData.borderRadius} corners
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-white rounded-full text-xs capitalize">
                    {formData.shadow} shadow
                  </span>
                </div>
              </div>

              <div className="p-3 bg-navy-50 rounded-lg">
                <p className="text-xs text-navy-500 mb-1">Additional Styling</p>
                <p className="text-sm text-navy-800 capitalize">
                  {formData.feel} feel • {formData.spacing} spacing • {formData.font} font
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
            title={currentStep === 3 ? 'Generating preview...' : 'Crafting your masterpiece...'}
            subtitle={currentStep === 3 ? 'Creating HTML email' : 'Every detail matters'}
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