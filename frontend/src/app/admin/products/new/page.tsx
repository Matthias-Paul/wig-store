"use client";

import { useState } from "react";
import { AdminLayout } from "@/src/features/admin/components/AdminLayout";
import { WizardStepIndicator } from "@/src/features/admin/components/WizardStepIndicator";
import { StepBasicInfo } from "@/src/features/admin/components/product-wizard/StepBasicInfo";
import { StepVariants } from "@/src/features/admin/components/product-wizard/StepVariants";
import { StepReviewPublish } from "@/src/features/admin/components/product-wizard/StepReviewPublish";

export default function NewProductPage() {
  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState<string | null>(null);

  return (
    <AdminLayout title="Add New Product">
      <div className="max-w-2xl mb-8">
        <WizardStepIndicator currentStep={step} />
      </div>

      {step === 1 && (
        <StepBasicInfo
          onCreated={(id) => {
            setProductId(id);
            setStep(2);
          }}
        />
      )}

      {step === 2 && productId && (
        <StepVariants
          productId={productId}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && productId && (
        <StepReviewPublish productId={productId} onBack={() => setStep(2)} />
      )}
    </AdminLayout>
  );
}
