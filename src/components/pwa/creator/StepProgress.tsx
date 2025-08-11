import { Check } from "lucide-react";

interface Step {
    id: string;
    title: string;
    icon: any;
    description: string;
}

interface StepProgressProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (step: number) => void;
}

export function StepProgress({ steps, currentStep, onStepClick }: StepProgressProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div 
                            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                                currentStep >= index 
                                    ? 'bg-brand-yellow border-brand-yellow text-black' 
                                    : 'border-slate-300 dark:border-slate-600 text-slate-400'
                            } ${onStepClick ? 'cursor-pointer hover:scale-105' : ''}`}
                            onClick={() => onStepClick?.(index)}
                        >
                            {currentStep > index ? (
                                <Check className="w-5 h-5" />
                            ) : (
                                <step.icon className="w-5 h-5" />
                            )}
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`hidden sm:block w-20 h-0.5 mx-4 ${
                                currentStep > index ? 'bg-brand-yellow' : 'bg-slate-300 dark:bg-slate-600'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                {steps.map((step, index) => (
                    <div key={step.id}>
                        <p className={`text-sm font-medium ${
                            currentStep >= index 
                                ? 'text-slate-900 dark:text-slate-100' 
                                : 'text-slate-400'
                        }`}>
                            {step.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {step.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
