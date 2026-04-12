import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Wand2, FileText, CheckCircle, Send, Lightbulb } from 'lucide-react';

const defaultSteps = [
  { id: 1, text: 'Analyzing your request...', icon: FileText },
  { id: 2, text: 'Generate email from prompt', icon: Wand2 },
  { id: 3, text: 'Crafting your perfect email...', icon: Sparkles },
  { id: 4, text: 'Adding the finishing touches...', icon: Mail },
  { id: 5, text: 'Send email', icon: Send },
  { id: 6, text: 'Almost there...', icon: CheckCircle },
];

const funFacts = [
  "The average office worker receives 121 emails per day 📧",
  "Email marketing has an average ROI of $42 for every $1 spent 💰",
  "The first email was sent in 1971 by Ray Tomlinson 📬",
  "45% of email campaigns are opened on mobile devices 📱",
  "Personalized emails improve click rates by 14% 🎯",
  "Tuesday is the most popular day to send marketing emails 📆",
  "The subject line is the #1 factor in email open rates ✨",
  "64% of people decide to open an email based on the subject line 🎪",
  "Emails with visual content get 94% more views 🖼️",
  "The average attention span on an email is 8 seconds ⏱️",
  "A/B testing your emails can increase conversions by 37% 🧪",
  "Automated emails generate 320% more revenue than manual sends 🚀",
  "Email is 40x more effective than Facebook or Twitter for customer acquisition 🌐",
  "The average professional spends 28% of their workday on email ⏰",
  "Welcome emails have 4x more opens and clicks than other campaigns 👋",
];

export const MagicLoader = ({ 
  steps = defaultSteps, 
  currentStep = 0, 
  title = "We're crafting your email magic...",
  subtitle = 'This only takes a moment'
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [funFact, setFunFact] = useState('');

  useEffect(() => {
    if (currentStep > 0 && currentStep <= steps.length) {
      setCurrentStepIndex(currentStep - 1);
    }
  }, [currentStep, steps.length]);

  useEffect(() => {
    // Pick a random fun fact initially
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    setFunFact(funFacts[randomIndex]);

    // Change fun fact every 4 seconds
    const factInterval = setInterval(() => {
      setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
    }, 4000);

    return () => clearInterval(factInterval);
  }, []);

  const currentStepData = steps[currentStepIndex] || steps[0];

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Animated Title */}
      <motion.h2 
        className="text-2xl md:text-3xl font-serif font-bold text-navy-800 mb-2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      
      <motion.p 
        className="text-navy-500 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {subtitle}
      </motion.p>

      {/* Progress Steps */}
      <div className="flex items-center gap-3 md:gap-5 mb-8 flex-wrap justify-center max-w-2xl">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div key={step.id} className="flex flex-col items-center min-w-[80px]">
              <motion.div
                className={`
                  w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isCurrent ? 'bg-brand-blue text-white' : ''}
                  ${isPending ? 'bg-navy-100 text-navy-400' : ''}
                `}
                animate={isCurrent ? { 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(37, 99, 235, 0.4)',
                    '0 0 0 12px rgba(37, 99, 235, 0)',
                    '0 0 0 0 rgba(37, 99, 235, 0)'
                  ]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <CheckCircle size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Icon size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.p 
                className={`
                  mt-2 text-xs font-medium text-center max-w-[80px] leading-tight
                  ${isCurrent ? 'text-brand-blue' : ''}
                  ${isCompleted ? 'text-green-600' : ''}
                  ${isPending ? 'text-navy-400' : ''}
                `}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {step.text}
              </motion.p>
            </div>
          );
        })}
      </div>

      {/* Animated Progress Bar */}
      <div className="w-64 md:w-80 h-2 bg-navy-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-blue to-navy-600 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Current Step Text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-6 text-center"
        >
          <p className="text-navy-600 italic">
            &ldquo;{currentStepData.text}&rdquo;
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Fun Facts Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={funFact}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-8 max-w-md mx-auto"
        >
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              {funFact}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-brand-blue/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '100%',
              opacity: 0
            }}
            animate={{ 
              y: '-20%',
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MagicLoader;
