import { clsx } from 'clsx';

export const ProgressSteps = ({ 
  steps, 
  currentStep, 
  className = '' 
}) => {
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div key={index} className="flex items-center">
            <div 
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                isCompleted && 'bg-green-500 text-white',
                isCurrent && 'bg-brand-blue text-white ring-4 ring-brand-blue/20',
                isPending && 'bg-navy-100 text-navy-400'
              )}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={clsx(
                  'w-8 md:w-12 h-1 mx-1 transition-all duration-300',
                  isCompleted ? 'bg-green-500' : 'bg-navy-100'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSteps;
