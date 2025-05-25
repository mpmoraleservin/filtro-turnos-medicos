import React from 'react';

function Step1_DatePicker({ currentDateForFilter, setCurrentDateForFilter, onNext }) {
  return (
    <>
      <div className="section-card date-picker-container">
        <h2 className="text-xl font-semibold mb-4 text-pastel-dark-blue">⚙️ Configurar Fecha de Simulación de Proceso</h2>
        <label className="date-picker-label">Fecha para cálculo de "días antes":</label>
        <div className="relative">
          <input
            type="date"
            className="date-picker-input pr-10" 
            value={currentDateForFilter}
            onChange={e => setCurrentDateForFilter(e.target.value)}
            style={{
              direction: 'ltr',
              textAlign: 'left'
            }}
          />
          <style jsx>{`
            input[type="date"]::-webkit-calendar-picker-indicator {
              position: absolute;
              right: 8px;
              top: 50%;
              transform: translateY(-50%);
            }
            
            /* Para navegadores que soportan el posicionamiento del datepicker */
            input[type="date"]::-webkit-datetime-edit {
              padding-right: 30px;
            }
          `}</style>
        </div>
        <p className="date-picker-help-text">El filtro "días antes" se calculará respecto a esta fecha.</p>
      </div>
      <div className="flex justify-end mt-8">
        <button onClick={onNext} className="btn-primary">Siguiente</button>
      </div>
    </>
  );
}

export default Step1_DatePicker;