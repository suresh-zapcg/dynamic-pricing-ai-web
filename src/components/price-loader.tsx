import { useEffect, useState } from "react";

type Step = {
  text: string;
  duration: number;
};

const steps: Step[] = [
  { text: "Analysing competitor prices", duration: 30 },
  { text: "Checking inventory levels", duration: 30 },
  { text: "Evaluating seasonality trends", duration: 30 },
  { text: "Assessing consumer demand", duration: 30 },
];

export function PriceLoader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(
    Array(steps.length).fill(false)
  );

  useEffect(() => {
    if (currentStep >= steps.length) return;

    const timer = setTimeout(() => {
      setCompleted((prev) => {
        const newState = [...prev];
        newState[currentStep] = true;
        return newState;
      });

      setCurrentStep((prev) => prev + 1);
    }, steps[currentStep].duration * 1000);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-xs z-[100]">
      <div className="flex flex-col items-start gap-3 bg-white rounded-lg p-4 shadow-lg w-[280px]">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center justify-between w-full">
            <span
              className={`text-xs font-medium ${
                currentStep === index ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {step.text}
            </span>
            {completed[index] ? (
              <div className="w-5 h-5 flex items-center justify-center bg-green-500 rounded-full flex-shrink-0">
                <span className="text-white text-[10px] font-bold">✓</span>
              </div>
            ) : (
              <div
                className={`w-5 h-5 border-2 border-gray-300 rounded-full flex-shrink-0 ${
                  currentStep === index ? "border-t-gray-900 animate-spin" : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
