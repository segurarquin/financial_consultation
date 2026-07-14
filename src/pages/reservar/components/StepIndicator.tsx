interface StepIndicatorProps {
  currentStep: number;
  steps: { label: string; icon: string }[];
  onStepClick?: (step: number) => void;
  reachedStep: number;
}

export default function StepIndicator({ currentStep, steps, onStepClick, reachedStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 mb-10">
      {steps.map((s, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        const isReached = stepNum <= reachedStep;

        return (
          <div key={i} className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => isReached && onStepClick?.(stepNum)}
              disabled={!isReached}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? 'bg-primary-500 text-background-50 dark:text-foreground-950 shadow-lg shadow-primary-500/20'
                  : isCompleted
                  ? 'bg-primary-100 text-primary-700 cursor-pointer hover:bg-primary-200'
                  : isReached
                  ? 'bg-background-100 text-foreground-600 cursor-pointer hover:bg-background-200'
                  : 'bg-background-100 text-foreground-400 cursor-not-allowed opacity-50'
              }`}
            >
              <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                isActive
                  ? 'bg-background-50/20 text-background-50'
                  : isCompleted
                  ? 'bg-primary-500 text-background-50'
                  : 'bg-secondary-200 text-foreground-500'
              }`}>
                {isCompleted ? (
                  <i className="ri-check-line text-xs"></i>
                ) : (
                  stepNum
                )}
              </span>
              <span className="hidden md:inline text-xs font-medium">{s.label}</span>
            </button>

            {i < steps.length - 1 && (
              <div className={`hidden md:block w-8 h-[2px] rounded-full transition-colors duration-300 ${
                isCompleted ? 'bg-primary-400' : 'bg-background-200'
              }`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}