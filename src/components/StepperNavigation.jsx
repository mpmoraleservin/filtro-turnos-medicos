
import React from 'react';

function StepperNavigation({ currentStep, setCurrentStep }) {
  const steps = [
    { number: 1, label: 'Configuración de Fecha' },
    { number: 2, label: 'Gestión de Reglas' },
    { number: 3, label: 'Filtrar Citas' },
  ];

  return (
    <div className="stepper-nav-grid mb-8"> 
      {steps.map((step) => (
        <div
          key={step.number}
          className={`stepper-item ${currentStep === step.number ? 'active' : ''}`}
          onClick={() => setCurrentStep(step.number)}
        >
          <div className="stepper-circle"> 
            {step.number}
          </div>
          <span className="stepper-label">
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default StepperNavigation;