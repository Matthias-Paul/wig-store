import { Check } from "lucide-react";
import { clsx } from "clsx";

const STEPS = ["Basic Info", "Variants", "Review & Publish"];

export function WizardStepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, index) => {
        const stepNum = index + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  isDone && "bg-brand text-white",
                  isActive && "bg-brand text-white ring-4 ring-brand-tint",
                  !isDone && !isActive && "bg-gray-100 text-gray-400",
                )}
              >
                {isDone ? <Check size={14} /> : stepNum}
              </div>
              <span
                className={clsx(
                  "text-[11px] mt-1.5 whitespace-nowrap font-medium",
                  isActive || isDone ? "text-gray-900" : "text-gray-400",
                )}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div
                className={clsx(
                  "h-0.5 flex-1 mx-2 -mt-4",
                  isDone ? "bg-brand" : "bg-gray-100",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
