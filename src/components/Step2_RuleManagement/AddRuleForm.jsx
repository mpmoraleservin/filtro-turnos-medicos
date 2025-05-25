import React from 'react';

const ruleFields = [
  { name: 'description', label: 'Descripción de la Regla', type: 'text' },
  { name: 'type', label: 'Tipo de Regla', type: 'select', options: ['include', 'exclude'] },
  { name: 'especialidad', label: 'Especialidad', type: 'select', dynamicOptions: true },
  { name: 'tipo_atencion', label: 'Tipo de Atención', type: 'select', dynamicOptions: true },
  { name: 'profesional_rut_es', label: 'RUT Profesional (principal para regla)', type: 'text' },
  { name: 'dias_antes_contacto_exacto', label: 'Días Exactos Antes del Contacto (ej: 0, 1, 3)', type: 'number' },
  { name: 'estado_cita', label: 'Estado de la Cita (ej: Agendada)', type: 'select', dynamicOptions: true },
  { name: 'edad_paciente_min', label: 'Edad Mínima Paciente (inclusive)', type: 'number' },
  { name: 'edad_paciente_max', label: 'Edad Máxima Paciente (inclusive)', type: 'number' },
  { 
    name: 'exclude_if_professional_rut', 
    label: 'Excepción (Solo Inclusión): No aplicar si Profesional es (RUT)', 
    type: 'text',
    placeholder: 'RUT del profesional a exceptuar para esta regla de inclusión',
    conditional: true,
    helpText: 'Si una regla de "inclusión" coincide, este campo puede anularla si el RUT del profesional de la cita coincide.'
  }
];

function AddRuleForm({ nuevaRegla, handleInputChange, agregarRegla, options }) {
  return (
    <div className="section-card">
      <h2 className="text-xl font-semibold mb-4 text-pastel-dark-blue">➕ Crear Nueva Regla</h2>
      <div className="add-rule-form-grid">
        {ruleFields.map(field => {
          // Determinar si el campo debe estar habilitado
          const isConditionalField = field.conditional;
          const isFieldEnabled = !isConditionalField || nuevaRegla.type === 'include';
          const fieldOpacity = isFieldEnabled ? '' : 'opacity-50';
          
          return (
            <div key={field.name} className={fieldOpacity}>
              <label className="add-rule-label" htmlFor={field.name}>
                {field.label || field.name.replaceAll('_', ' ')}:
              </label>
              
              {field.type === 'select' ? (
                <select
                  name={field.name}
                  id={field.name}
                  className="input-text-base"
                  value={nuevaRegla[field.name]}
                  onChange={handleInputChange}
                  disabled={!isFieldEnabled}
                >
                  <option value="">Seleccione...</option>
                  {(field.dynamicOptions ? options[field.name] : field.options || []).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder || field.label}
                  className="input-text-base"
                  value={nuevaRegla[field.name]}
                  onChange={handleInputChange}
                  disabled={!isFieldEnabled}
                />
              )}
              
              {field.helpText && (
                <p className="add-rule-help-text">
                  {isFieldEnabled 
                    ? field.helpText
                    : 'Este campo solo está disponible para reglas de tipo "include".'
                  }
                </p>
              )}
            </div>
          );
        })}
      </div>
      <button onClick={agregarRegla} className="btn-primary">Agregar Regla</button>
    </div>
  );
}

export default AddRuleForm;