// src/App.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';

// Import helper functions
import { calculateDaysBefore, checkRuleMatch, saveToLocalStorage, loadFromLocalStorage } from './components/Shared/HelperFunctions';

// Import components for each step
import Step1_DatePicker from './components/Step1_DatePicker';
import AddRuleForm from './components/Step2_RuleManagement/AddRuleForm';
import RuleList from './components/Step2_RuleManagement/RuleList';
import ImportRulesModal from './components/Step2_RuleManagement/ImportRulesModal';
import Step3_CitasFilter from './components/Step3_CitasFilter';
import StepperNavigation from './components/StepperNavigation';

const DEFAULT_SELECT_OPTIONS = {
  especialidad: [
    'Cardiología',
    'Pediatría',
    'Gastroenterología',
    'Odontología',
    'Traumatología',
    'Dermatología',
    'Neurología'
  ],
  tipo_atencion: [
    'Primera Consulta',
    'Control',
    'Seguimiento',
    'Examen',
    'Procedimiento'
  ],
  estado_cita: [
    'Agendada',
    'Confirmada',
    'Cancelada',
    'Reprogramada',
    'Pendiente',
    'Lista de Espera'
  ],
};

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentDateForFilter, setCurrentDateForFilter] = useState(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return loadFromLocalStorage('simulationDate', `${yyyy}-${mm}-${dd}`);
  });
  const [reglas, setReglas] = useState(() => loadFromLocalStorage('rules', []));
  const [jsonInput, setJsonInput] = useState(() => loadFromLocalStorage('citasInput', ''));
  const [citasFiltradas, setCitasFiltradas] = useState([]);
  const [modalImportRulesOpen, setModalImportRulesOpen] = useState(false);
  const [jsonReglasImportar, setJsonReglasImportar] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', message: '' });
  
  // Ref para almacenar el timeout ID
  const feedbackTimeoutRef = useRef(null);

  // Función para mostrar mensaje con auto-dismiss
  const showFeedbackMessage = useCallback((type, message, duration = 4000) => {
    // Limpiar timeout anterior si existe
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    // Mostrar el mensaje
    setFeedbackMessage({ type, message });

    // Configurar auto-dismiss
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackMessage({ type: '', message: '' });
      feedbackTimeoutRef.current = null;
    }, duration);
  }, []);

  // Limpiar timeout cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  // Persistencia en localStorage
  useEffect(() => {
    saveToLocalStorage('simulationDate', currentDateForFilter);
  }, [currentDateForFilter]);

  useEffect(() => {
    saveToLocalStorage('rules', reglas);
  }, [reglas]);

  useEffect(() => {
    saveToLocalStorage('citasInput', jsonInput);
  }, [jsonInput]);

  const getRuleDatalistOptions = useCallback(() => {
    const options = {
      especialidad: new Set(DEFAULT_SELECT_OPTIONS.especialidad.map(opt => opt.toLowerCase())),
      tipo_atencion: new Set(DEFAULT_SELECT_OPTIONS.tipo_atencion.map(opt => opt.toLowerCase())),
      estado_cita: new Set(DEFAULT_SELECT_OPTIONS.estado_cita.map(opt => opt.toLowerCase())),
    };

    reglas.forEach(rule => {
      if (rule.especialidad) options.especialidad.add(rule.especialidad.toLowerCase());
      if (rule.tipo_atencion) options.tipo_atencion.add(rule.tipo_atencion.toLowerCase());
      if (rule.estado_cita) options.estado_cita.add(rule.estado_cita.toLowerCase());
    });

    return {
      especialidad: Array.from(options.especialidad).sort(),
      tipo_atencion: Array.from(options.tipo_atencion).sort(),
      estado_cita: Array.from(options.estado_cita).sort(),
    };
  }, [reglas]);

  // Estado inicial estable usando función para evitar re-creaciones
  const [nuevaRegla, setNuevaRegla] = useState(() => ({
    description: '',
    type: 'include',
    especialidad: '',
    tipo_atencion: '',
    profesional_rut_es: '',
    dias_antes_contacto_exacto: '',
    estado_cita: '',
    edad_paciente_min: '',
    edad_paciente_max: '',
    exclude_if_professional_rut: '' // Siempre presente para evitar re-renders
  }));

  // Función handleInputChange mejorada para evitar re-renders problemáticos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setNuevaRegla(prev => {
      const newState = {
        ...prev,
        [name]: value
      };
      
      // Si cambia a "exclude", limpiar el campo de excepción pero mantenerlo en el estado
      if (name === 'type' && value === 'exclude') {
        newState.exclude_if_professional_rut = '';
      }
      
      return newState;
    });
  };

  const agregarRegla = () => {
    const hasCriteria = Object.keys(nuevaRegla).some(key =>
      key !== 'description' && key !== 'type' && nuevaRegla[key] !== '' && nuevaRegla[key] !== null
    );

    if (!nuevaRegla.description.trim() && !hasCriteria) {
      showFeedbackMessage('error', 'Por favor, ingrese una descripción o al menos un criterio para la regla.');
      return;
    }

    // Convertir a minúsculas antes de guardar para consistencia en la lógica de filtrado
    const newRule = { ...nuevaRegla };
    if (newRule.especialidad) newRule.especialidad = newRule.especialidad.toLowerCase();
    if (newRule.tipo_atencion) newRule.tipo_atencion = newRule.tipo_atencion.toLowerCase();
    if (newRule.estado_cita) newRule.estado_cita = newRule.estado_cita.toLowerCase();
    if (newRule.profesional_rut_es) newRule.profesional_rut_es = newRule.profesional_rut_es.toLowerCase();
    if (newRule.exclude_if_professional_rut) newRule.exclude_if_professional_rut = newRule.exclude_if_professional_rut.toLowerCase();

    setReglas(prev => [...prev, newRule]);
    
    // Reset estable usando spread operator para mantener referencia del objeto
    setNuevaRegla(prev => ({
      ...prev,
      description: '',
      type: 'include',
      especialidad: '',
      tipo_atencion: '',
      profesional_rut_es: '',
      dias_antes_contacto_exacto: '',
      estado_cita: '',
      edad_paciente_min: '',
      edad_paciente_max: '',
      exclude_if_professional_rut: ''
    }));
    
    showFeedbackMessage('success', 'Regla agregada con éxito.');
  };

  const removerRegla = (indexToRemove) => {
    setReglas(prev => prev.filter((_, index) => index !== indexToRemove));
    showFeedbackMessage('success', 'Regla eliminada.');
  };

  const handleImportRules = () => {
    try {
      let imported = JSON.parse(jsonReglasImportar);
      if (Array.isArray(imported)) {
        imported = imported.map(rule => {
          const newRule = { ...rule };
          if (newRule.especialidad) newRule.especialidad = newRule.especialidad.toLowerCase();
          if (newRule.tipo_atencion) newRule.tipo_atencion = newRule.tipo_atencion.toLowerCase();
          if (newRule.estado_cita) newRule.estado_cita = newRule.estado_cita.toLowerCase();
          if (newRule.profesional_rut_es) newRule.profesional_rut_es = newRule.profesional_rut_es.toLowerCase();
          if (newRule.exclude_if_professional_rut) newRule.exclude_if_professional_rut = newRule.exclude_if_professional_rut.toLowerCase();
          return newRule;
        });

        setReglas(prev => [...prev, ...imported]);
        setJsonReglasImportar('');
        setModalImportRulesOpen(false);
        showFeedbackMessage('success', `Se importaron ${imported.length} reglas.`);
      } else {
        showFeedbackMessage('error', 'El JSON importado no es un array de reglas válido.');
      }
    } catch (e) {
      console.error("Error al parsear JSON de reglas:", e);
      showFeedbackMessage('error', 'Formato JSON de reglas inválido. Por favor, verifique la sintaxis.');
    }
  };

  const ejecutarFiltrado = useCallback(() => {
    if (!jsonInput.trim()) {
      showFeedbackMessage('error', 'Por favor, ingrese el JSON de citas antes de filtrar.');
      setCitasFiltradas([]);
      return;
    }

    try {
      const citas = JSON.parse(jsonInput);
      if (!Array.isArray(citas)) {
        showFeedbackMessage('error', 'El JSON de citas no es un array válido.');
        setCitasFiltradas([]);
        return;
      }

      let tempCitasFiltradas = [];

      console.log("--- INICIANDO PROCESO DE FILTRADO ---");
      console.log("Fecha de Simulación:", currentDateForFilter);
      console.log("Reglas cargadas:", reglas);

      // Verificar si hay reglas de inclusión
      const hasIncludeRules = reglas.some(rule => rule.type === 'include');
      console.log("¿Hay reglas de inclusión?:", hasIncludeRules);

      citas.forEach((cita, citaIndex) => {
        let isIncluded = false;
        let isExcluded = false;

        console.log(`\n--- Evaluando Cita #${citaIndex + 1}: ${cita.id_cita} (${cita.especialidad}, ${cita.fecha_cita}) ---`);

        // Normalizar los valores de la cita para la comparación
        const normalizedCita = { 
          ...cita,
          especialidad: cita.especialidad ? cita.especialidad.toLowerCase() : '',
          tipo_atencion: cita.tipo_atencion ? cita.tipo_atencion.toLowerCase() : '',
          estado_cita: cita.estado_cita ? cita.estado_cita.toLowerCase() : '',
          rut_profesional: cita.rut_profesional ? cita.rut_profesional.toLowerCase() : ''
        };

        reglas.forEach((rule, ruleIndex) => {
          console.log(`  Evaluando con Regla #${ruleIndex + 1} (Tipo: ${rule.type}, Desc: "${rule.description || 'N/A'}"):`, rule);

          const match = checkRuleMatch(normalizedCita, rule, currentDateForFilter);
          console.log(`    --> RuleCheck Result: ${match}`);

          if (match) {
            if (rule.type === 'include') {
              isIncluded = true;
              console.log(`    --> Cita ${cita.id_cita} es un MATCH con regla de INCLUSIÓN. isIncluded = true.`);
            } else if (rule.type === 'exclude') {
              isExcluded = true;
              console.log(`    --> Cita ${cita.id_cita} es un MATCH con regla de EXCLUSIÓN. isExcluded = true.`);
            }
          }
        });

        console.log(`  Resumen para Cita ${cita.id_cita}: isIncluded = ${isIncluded}, hasIncludeRules = ${hasIncludeRules}, isExcluded = ${isExcluded}`);

        // Lógica final de filtrado corregida:
        let shouldIncludeCita = false;
        
        if (hasIncludeRules) {
          // Si hay reglas de inclusión, la cita debe coincidir con al menos una Y no estar excluida
          shouldIncludeCita = isIncluded && !isExcluded;
        } else {
          // Si no hay reglas de inclusión, incluir todas excepto las excluidas
          shouldIncludeCita = !isExcluded;
        }
        
        console.log(`  Decisión final para Cita ${cita.id_cita}: ${shouldIncludeCita ? 'INCLUIDA' : 'NO INCLUIDA'}`);

        if (shouldIncludeCita) {
          tempCitasFiltradas.push(cita);
        }
      });
      
      setCitasFiltradas(tempCitasFiltradas);
      showFeedbackMessage('success', `Filtrado completado. Se encontraron ${tempCitasFiltradas.length} citas.`, 5000); // 5 segundos para mensajes de éxito de filtrado
      console.log(`\n--- FILTRADO COMPLETADO. Citas encontradas: ${tempCitasFiltradas.length} ---`);

    } catch (e) {
      console.error("Error al parsear JSON de citas:", e);
      showFeedbackMessage('error', 'Formato JSON de citas inválido. Por favor, verifique la sintaxis.');
      setCitasFiltradas([]);
    }
  }, [jsonInput, reglas, currentDateForFilter, showFeedbackMessage]);

  // Función para limpiar mensajes manualmente 
  const clearFeedbackMessage = () => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
    setFeedbackMessage({ type: '', message: '' });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1_DatePicker
          currentDateForFilter={currentDateForFilter}
          setCurrentDateForFilter={setCurrentDateForFilter}
          onNext={() => setCurrentStep(2)}
        />;
      case 2:
        return (
          <div>
            <AddRuleForm
              nuevaRegla={nuevaRegla}
              handleInputChange={handleInputChange}
              agregarRegla={agregarRegla}
              options={getRuleDatalistOptions()}
            />
            <button
              onClick={() => setModalImportRulesOpen(true)}
              className="btn-secondary mt-4 mb-8"
            >
              Importar Reglas desde JSON...
            </button>
            <RuleList
              reglas={reglas}
              removerRegla={removerRegla}
              setReglas={(newReglas) => {
                setReglas(newReglas);
                if (newReglas.length === 0) {
                  showFeedbackMessage('success', 'Todas las reglas han sido eliminadas.');
                }
              }}
            />
            <div className="flex justify-between mt-8">
              <button onClick={() => setCurrentStep(1)} className="btn-secondary">Anterior</button>
              <button onClick={() => setCurrentStep(3)} className="btn-primary">Siguiente</button>
            </div>
            <ImportRulesModal
              isOpen={modalImportRulesOpen}
              onClose={() => setModalImportRulesOpen(false)}
              jsonReglasImportar={jsonReglasImportar}
              setJsonReglasImportar={setJsonReglasImportar}
              onImport={handleImportRules}
            />
          </div>
        );
      case 3:
        return <Step3_CitasFilter
          jsonInput={jsonInput}
          setJsonInput={setJsonInput}
          citasFiltradas={citasFiltradas}
          ejecutarFiltrado={ejecutarFiltrado}
          onPrevious={() => setCurrentStep(2)}
          onClearJsonInput={() => {
            setJsonInput(''); 
            setCitasFiltradas([]); 
            clearFeedbackMessage();
          }}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto app-container">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-pastel-dark-blue">🩺 Filtro Dinámico de Turnos Médicos</h1>

      <StepperNavigation currentStep={currentStep} setCurrentStep={setCurrentStep} />

      {feedbackMessage.message && (
        <div 
          className={`feedback-message ${feedbackMessage.type === 'error' ? 'error' : 'success'} animate-feedbackFadeIn cursor-pointer`}
          onClick={clearFeedbackMessage}
          title="Haz clic para cerrar"
        >
          <div className="flex items-center justify-between">
            <span>{feedbackMessage.message}</span>
            <span className="ml-2 text-sm opacity-70">✕</span>
          </div>
        </div>
      )}

      {renderStepContent()}
    </div>
  );
}

export default App;