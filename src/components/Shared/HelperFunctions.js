// src/components/Shared/HelperFunctions.js

export function calculateDaysBefore(appointmentDateStr, simulationDateStr) {
  if (!appointmentDateStr || !simulationDateStr) return null;

  const appointmentDate = new Date(appointmentDateStr);
  const simulationDate = new Date(simulationDateStr);

  // Verificar si las fechas son válidas
  if (isNaN(appointmentDate.getTime()) || isNaN(simulationDate.getTime())) {
    return null;
  }

  // Normalizar ambas fechas a medianoche para asegurar que el cálculo de días sea preciso
  appointmentDate.setHours(0, 0, 0, 0);
  simulationDate.setHours(0, 0, 0, 0);

  // Calcular la diferencia en días (usar Math.floor en lugar de Math.ceil)
  const diffTime = appointmentDate.getTime() - simulationDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function checkRuleMatch(cita, rule, simulationDate) {
  // Verificar especialidad
  if (rule.especialidad && rule.especialidad !== '') {
    if (!cita.especialidad || cita.especialidad.toLowerCase() !== rule.especialidad.toLowerCase()) {
      return false;
    }
  }

  // Verificar tipo de atención
  if (rule.tipo_atencion && rule.tipo_atencion !== '') {
    if (!cita.tipo_atencion || cita.tipo_atencion.toLowerCase() !== rule.tipo_atencion.toLowerCase()) {
      return false;
    }
  }

  // Verificar RUT profesional
  if (rule.profesional_rut_es && rule.profesional_rut_es !== '') {
    if (!cita.rut_profesional || cita.rut_profesional.toLowerCase() !== rule.profesional_rut_es.toLowerCase()) {
      return false;
    }
  }

  // Verificar estado de cita
  if (rule.estado_cita && rule.estado_cita !== '') {
    if (!cita.estado_cita || cita.estado_cita.toLowerCase() !== rule.estado_cita.toLowerCase()) {
      return false;
    }
  }

  // Verificar días antes de contacto exacto
  if (rule.dias_antes_contacto_exacto !== '' && rule.dias_antes_contacto_exacto !== null && rule.dias_antes_contacto_exacto !== undefined) {
    const diasAntesRegla = parseInt(rule.dias_antes_contacto_exacto, 10);
    if (!isNaN(diasAntesRegla) && cita.fecha_cita) {
      const diasAntesCita = calculateDaysBefore(cita.fecha_cita, simulationDate);
      if (diasAntesCita === null || diasAntesCita !== diasAntesRegla) {
        return false;
      }
    }
  }

  // Verificar edad del paciente
  if (rule.edad_paciente_min && rule.edad_paciente_min !== '') {
    const minEdad = parseInt(rule.edad_paciente_min, 10);
    if (!isNaN(minEdad) && (cita.edad_paciente === undefined || cita.edad_paciente < minEdad)) {
      return false;
    }
  }

  if (rule.edad_paciente_max && rule.edad_paciente_max !== '') {
    const maxEdad = parseInt(rule.edad_paciente_max, 10);
    if (!isNaN(maxEdad) && (cita.edad_paciente === undefined || cita.edad_paciente > maxEdad)) {
      return false;
    }
  }

  // Verificar exclusión por RUT profesional
  if (rule.exclude_if_professional_rut && rule.exclude_if_professional_rut !== '') {
    if (!cita.rut_profesional) {
      return false;
    }

    const profesionalRutCita = cita.rut_profesional.toLowerCase();
    const profesionalRutExcluir = rule.exclude_if_professional_rut.toLowerCase();

    if (rule.type === 'include') {
      // Para reglas de inclusión, si el RUT coincide con el de exclusión, no incluir
      if (profesionalRutCita === profesionalRutExcluir) {
        return false;
      }
    } else if (rule.type === 'exclude') {
      // Para reglas de exclusión, solo aplicar si el RUT coincide
      if (profesionalRutCita !== profesionalRutExcluir) {
        return false;
      }
    }
  }
  return true;
}

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error al guardar en localStorage para la clave ${key}:`, error);
  }
};

export const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error al cargar de localStorage para la clave ${key}:`, error);
    return defaultValue;
  }
};