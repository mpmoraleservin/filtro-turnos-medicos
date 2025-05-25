import React from 'react';

function ImportRulesModal({ isOpen, onClose, jsonReglasImportar, setJsonReglasImportar, onImport }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex justify-between items-center mb-4">
          <h3 className="modal-title">Importar Reglas desde JSON</h3>
          <button onClick={onClose} className="text-pastel-dark-gray hover:text-text-dark text-3xl leading-none">
            &times;
          </button>
        </div>
        <div>
          <textarea
            className="modal-textarea"
            placeholder="Pegue aquí un array JSON de reglas predefinidas, ej: [{...}, {...}]..."
            value={jsonReglasImportar}
            onChange={e => setJsonReglasImportar(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => { setJsonReglasImportar(''); onClose(); }}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setJsonReglasImportar('')}
          >
            Vaciar
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={onImport}
          >
            Importar Reglas
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportRulesModal;