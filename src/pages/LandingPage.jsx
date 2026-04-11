import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Zap, Sparkles, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Craft professional emails in seconds. No more staring at a blank page.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Magic',
    description: 'Our intelligent system understands your intent and creates emails that resonate.',
  },
  {
    icon: Clock,
    title: 'Two Modes',
    description: 'Quick YOLO send when speed matters, or detailed crafting when perfection counts.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your emails and data are encrypted and protected. Always.',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export const LandingPage = () => {
  return (
    <Layout showFooter={false}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-b from-white to-navy-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 border-2 border-navy-700 rounded-full" />
          <div className="absolute top-40 right-20 w-96 h-96 border border-brand-blue rounded-full" />
          <div className="absolute bottom-20 left-1/4 w-64 h-64 border border-navy-400 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div {...fadeInUp} className="text-center lg:text-left">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-full text-sm font-medium mb-6"
              >
                ✨ Craft Emails That Get Opened
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-navy-900 mb-6 leading-tight"
              >
                Email Writing,{' '}
                <span className="text-brand-blue">Reimagined</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-navy-600 mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Stop struggling with the perfect words. Our AI-powered email crafter 
                transforms your ideas into compelling, professional emails in seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Crafting for Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-sm text-navy-400"
              >
                No credit card required • Free to get started
              </motion.p>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-white rounded-2xl shadow-2xl p-8 border border-navy-100"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-serif font-bold text-lg text-navy-800">Email Crafter</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-3 bg-navy-100 rounded w-full" />
                    <div className="h-3 bg-navy-100 rounded w-3/4" />
                    <div className="h-3 bg-navy-100 rounded w-5/6" />
                  </div>

                  <div className="mt-6 p-4 bg-navy-50 rounded-xl">
                    <p className="text-sm text-navy-600 italic">
                      "Your email has been crafted with care. Ready to impress?"
                    </p>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4"
                >
                  <Zap className="w-8 h-8 text-yellow-500" />
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -bottom-4 -left-8 bg-white rounded-xl shadow-lg p-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm font-medium text-navy-700">Done!</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-navy-900 mb-4">
              Why Choose Email Crafter?
            </h2>
            <p className="text-lg text-navy-600 max-w-2xl mx-auto">
              We've built the email writing tool we've always wanted. Simple, powerful, delightful.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-xl transition-shadow">
                    <div className="w-14 h-14 bg-brand-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-brand-blue" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-navy-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-navy-600 text-sm">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Ready to Transform Your Email Game?
            </h2>
            <p className="text-xl text-navy-200 mb-8">
              Join thousands of professionals who write better emails in less time.
            </p>
            <Link to="/register">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white hover:bg-navy-50 text-navy-800 border-white"
              >
                Get Started — It's Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-8 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-navy-400 text-sm">
            © {new Date().getFullYear()} Email Crafter. Crafted with care for email lovers everywhere.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default LandingPage;
