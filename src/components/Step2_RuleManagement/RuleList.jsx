import React from 'react';

function RuleList({ reglas, removerRegla, setReglas }) {
  return (
    <div className="section-card">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-pastel-dark-blue">📋 Reglas Actuales ({reglas.length})</h2>
        {reglas.length > 0 && (
          <button onClick={() => setReglas([])} className="btn-secondary">
            Eliminar Todas
          </button>
        )}
      </div>
      {reglas.length === 0 ? (
        <p className="text-pastel-dark-gray">No hay reglas definidas. Puedes crearlas o importarlas.</p>
      ) : (
        <div className="rule-list-container">
          {reglas.map((regla, index) => (
            <div
              key={index}
              className={`rule-list-item ${regla.type === 'include' ? 'include' : 'exclude'}`}
            >
              <div className="flex-1">
                <p className="rule-description">
                  {regla.description || `Regla ${index + 1}`} ({regla.type})
                </p>
                <dl className="rule-details">
                  {Object.entries(regla).filter(([key, value]) => key !== 'description' && key !== 'type' && value !== '' && value !== null && value !== undefined)
                    .map(([key, value]) => (
                      <div key={key} className="flex text-sm">
                        <dt className="font-semibold mr-1">{key.replaceAll('_', ' ')}:</dt>
                        <dd>{String(value)}</dd>
                      </div>
                    ))}
                </dl>
              </div>
              <button onClick={() => removerRegla(index)} className="rule-delete-button" title="Eliminar esta regla">
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RuleList;