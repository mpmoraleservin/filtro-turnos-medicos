import React from 'react';

function Step3_CitasFilter({ jsonInput, setJsonInput, citasFiltradas, ejecutarFiltrado, onPrevious, onClearJsonInput }) {
  return (
  
    <div className="citas-filter-main-content"> 

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"> 

        <div className="section-card flex flex-col"> 
          <h2 className="text-xl font-semibold mb-2 text-cero-text-main">🧪 JSON de Turnos a Filtrar</h2>
          <textarea
            className="citas-textarea flex-grow" 
            placeholder="Pegue aquí el JSON de los turnos (debe ser un array, ej: [{}, {}])..."
            value={jsonInput}
            onChange={e => setJsonInput(e.target.value)}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={onClearJsonInput} className="btn-secondary">
              Vaciar JSON
            </button>
            <button onClick={ejecutarFiltrado} className="btn-primary">
              Filtrar Turnos
            </button>
          </div>
        </div>

        <div className="section-card flex flex-col"> 
          <h2 className="text-xl font-semibold mb-2 text-cero-text-main">📤 Turnos Filtrados ({citasFiltradas.length})</h2>
          {citasFiltradas.length === 0 && !jsonInput.trim() ? (
              <p className="text-cero-text-secondary">Ingrese un JSON de turnos para comenzar a filtrar.</p>
          ) : citasFiltradas.length === 0 && jsonInput.trim() ? (
               <p className="text-cero-text-secondary">No se encontraron turnos que cumplan con los criterios de las reglas, o el JSON de entrada es inválido.</p>
          ) : (
            <div className="filter-results-container flex-grow"> 
              <pre className="filter-results-item h-full"> 
                {JSON.stringify(citasFiltradas, null, 2)}
              </pre>
            </div>
          )}
        </div>

      </div> 

      <div className="flex justify-between mt-8 w-full">
        <button onClick={onPrevious} className="btn-secondary">
          Anterior
        </button>
      </div>
    </div>
  );
}

export default Step3_CitasFilter;