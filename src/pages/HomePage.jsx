import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Zap, Sparkles, Clock, AlertTriangle, ChevronRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const { user } = useAuth();
  const [showApiKeyBanner, setShowApiKeyBanner] = useState(true);

  const emailOptions = [
    {
      id: 'yolo',
      icon: Zap,
      title: 'YOLO Quick Send',
      tagline: 'Just tell us what you need',
      description: 'Quick and dirty? We\'ve got you covered. Drop in the recipient, your subject, and a rough idea of what you want — we\'ll handle the rest. Perfect for when you need to send something now.',
      cta: 'Fire Away! 🚀',
      color: 'from-yellow-500 to-orange-500',
      hoverColor: 'group-hover:shadow-yellow-500/30',
    },
    {
      id: 'detailed',
      icon: Sparkles,
      title: 'Craft with Care',
      tagline: 'Meticulous attention to detail',
      description: 'Take your time. We\'ll ask about the tone, style, word count, and even the font feel. It\'s like having a professional email designer at your fingertips.',
      cta: 'Let\'s Craft Something Special ✨',
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
            Ready to craft some emails? Choose your adventure below — whether you\'re in a rush or want to fine-tune every word.
          </p>
        </motion.div>

        {/* API Key Banner */}
        {showApiKeyBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-4"
          >
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-1">
                Setup Required: Resend API Key
              </h3>
              <p className="text-sm text-yellow-700 mb-3">
                To send emails, you\'ll need to configure your Resend API key. This keeps your email sending secure and under your control.
              </p>
              <Link to="/settings">
                <Button variant="secondary" size="sm" className="bg-yellow-100 hover:bg-yellow-200 border-yellow-300 text-yellow-800">
                  Configure API Key
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <button
              onClick={() => setShowApiKeyBanner(false)}
              className="text-yellow-600 hover:text-yellow-800 transition-colors"
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
                    
                    <div className="relative z-10">
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

                      {/* CTA */}
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br ${option.color} text-white font-medium group-hover:shadow-lg transition-shadow duration-300`}>
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
