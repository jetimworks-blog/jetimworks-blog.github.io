import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Wand2, FileText, CheckCircle } from 'lucide-react';

const defaultSteps = [
  { id: 1, text: 'Analyzing your request...', icon: FileText },
  { id: 2, text: 'Crafting your perfect email...', icon: Wand2 },
  { id: 3, text: 'Adding the finishing touches...', icon: Mail },
  { id: 4, text: 'Almost there...', icon: Sparkles },
];

export const MagicLoader = ({ 
  steps = defaultSteps, 
  currentStep = 0, 
  title = "We're crafting your email magic...",
  subtitle = 'This only takes a moment'
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (currentStep > 0 && currentStep <= steps.length) {
      setCurrentStepIndex(currentStep - 1);
    }
  }, [currentStep, steps.length]);

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
      <div className="flex items-center gap-4 md:gap-8 mb-12">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                className={`
                  w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isCurrent ? 'bg-brand-blue text-white' : ''}
                  ${isPending ? 'bg-navy-100 text-navy-400' : ''}
                `}
                animate={isCurrent ? { 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(37, 99, 235, 0.4)',
                    '0 0 0 15px rgba(37, 99, 235, 0)',
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
                      <CheckCircle size={24} />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Icon size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.p 
                className={`
                  mt-2 text-xs md:text-sm font-medium text-center max-w-[80px]
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
