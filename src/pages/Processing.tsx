import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import GlassCard from "@/components/GlassCard";

const steps = [
  { label: "Parsing resume content", duration: 1500 },
  { label: "Extracting keywords & skills", duration: 2000 },
  { label: "Analyzing job requirements", duration: 1800 },
  { label: "Calculating ATS match score", duration: 1500 },
  { label: "Generating optimization suggestions", duration: 2000 },
];

export default function Processing() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length) {
      const timeout = setTimeout(() => navigate("/results"), 800);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setCurrentStep((s) => s + 1), steps[currentStep].duration);
    return () => clearTimeout(timeout);
  }, [currentStep, navigate]);

  const progress = Math.min((currentStep / steps.length) * 100, 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12 px-4 flex items-center justify-center min-h-screen">
        <div className="container mx-auto max-w-lg">
          <GlassCard className="text-center">
            {/* Animated ring */}
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div
                className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"
                style={{ animationDuration: "1.5s" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold">{Math.round(progress)}%</span>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2">Analyzing Your Resume</h2>
            <p className="text-sm text-muted-foreground mb-8">Our AI is processing your documents…</p>

            {/* Progress bar */}
            <div className="w-full h-2 bg-secondary rounded-full mb-8 overflow-hidden">
              <div
                className="h-full gradient-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-3 text-left">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    i < currentStep
                      ? "bg-success text-success-foreground"
                      : i === currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {i < currentStep ? (
                      <Check className="w-3 h-3" />
                    ) : i === currentStep ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <span className="text-xs">{i + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    i < currentStep ? "text-foreground" : i === currentStep ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
