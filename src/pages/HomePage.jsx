import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Zap, Sparkles, Clock, AlertTriangle, ChevronRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { configAPI } from '../lib/api';

export const HomePage = () => {
  const { user } = useAuth();
  const [showApiKeyBanner, setShowApiKeyBanner] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    loadConfig();
    checkJustSignedUp();
  }, []);

  const checkJustSignedUp = () => {
    const justSignedUp = localStorage.getItem('justSignedUp') === 'true';
    const settingsUpdated = localStorage.getItem('settingsUpdated') === 'true';
    // Show sender details warning if just signed up AND settings not yet updated
    if (justSignedUp && !settingsUpdated) {
      setShowApiKeyBanner(true);
      // Clear the justSignedUp flag so warning doesn't reappear on refresh
      localStorage.removeItem('justSignedUp');
    }
  };

  const loadConfig = async () => {
    try {
      const response = await configAPI.get();
      setHasApiKey(response.data.has_resend_key || false);
      if (response.data.has_resend_key) {
        setShowApiKeyBanner(false);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  };

  const emailOptions = [
    {
      id: 'yolo',
      icon: Zap,
      title: 'YOLO Quick Send',
      tagline: 'Just tell us what you need',
      description: "Quick and dirty? We've got you covered. Drop in the recipient, your subject, and a rough idea of what you want — we'll handle the rest. Perfect for when you need to send something now.",
      cta: 'Fire Away! 🚀',
      color: 'from-yellow-500 to-orange-500',
      hoverColor: 'group-hover:shadow-yellow-500/30',
    },
    {
      id: 'detailed',
      icon: Sparkles,
      title: 'Craft with Care',
      tagline: 'Meticulous attention to detail',
      description: "Take your time. We'll ask about the tone, style, word count, and even the font feel. It's like having a professional email designer at your fingertips.",
      cta: "Let's Craft Something Special ✨",
      color: 'from-brand-blue to-navy-600',
      hoverColor: 'group-hover:shadow-brand-blue/30',
    },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-4">
            Welcome back, {user?.email?.split('@')[0] || 'there'}! 👋
          </h1>
          <p className="text-lg text-navy-600 max-w-2xl mx-auto">
            Ready to craft some emails? Choose your adventure below — whether you're in a rush or want to fine-tune every word.
          </p>
        </motion.div>

        {/* Sender Details Warning Banner */}
        {showApiKeyBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-4"
          >
            <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 mb-1">
                Update Your Sender Details
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Your emails will be sent from <strong>free-email@jetimworks.com</strong> with the name <strong>Anonymous</strong>. Head to Settings to customize your sender information.
              </p>
              <Link to="/settings">
                <Button variant="secondary" size="sm" className="bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-800">
                  Go to Settings
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <button
              onClick={() => setShowApiKeyBanner(false)}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Email Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {emailOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/send/${option.id}`}>
                  <Card
                    hoverable
                    className={`h-full group relative overflow-hidden bg-gradient-to-br ${option.hoverColor}`}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <h2 className="text-2xl font-serif font-bold text-navy-900 mb-2">
                        {option.title}
                      </h2>
                      <p className="text-sm font-medium text-brand-blue mb-4 flex items-center gap-1">
                        <Clock size={14} />
                        {option.tagline}
                      </p>
                      <p className="text-navy-600 mb-6 leading-relaxed">
                        {option.description}
                      </p>

                      {/* CTA - pushed to bottom */}
                      <div className={`mt-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br ${option.color} text-white font-medium group-hover:shadow-lg transition-shadow duration-300 w-fit`}>
                        <Mail size={18} />
                        {option.cta}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Card className="inline-block">
            <p className="text-navy-500 text-sm">
              <span className="font-medium text-navy-700">Pro tip:</span> Not sure which to choose? Start with YOLO — you can always refine later. No pressure! 💪
            </p>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default HomePage;
