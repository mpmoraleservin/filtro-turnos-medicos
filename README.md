# 🩺 Filtro Dinámico de Turnos Médicos

## 📝 Reformulación del Problema

En Cero, la gestión de turnos médicos es un pilar fundamental. La naturaleza diversa de las instituciones de salud y sus políticas de comunicación con pacientes exige un sistema altamente adaptable. El desafío central radica en aplicar reglas de negocio dinámicas para el contacto con pacientes, las cuales pueden variar en cualquier momento (ej., cambios en la política de contacto de un profesional o ajustes en los plazos de confirmación).

El objetivo de este componente es tomar una lista de turnos (proveniente de un "módulo de consulta" ya existente) y, mediante la aplicación de un conjunto configurable de reglas, generar un subconjunto de turnos que cumplen con los criterios de contacto deseados. La solución debe ser flexible, permitiendo la modificación de estas reglas sin alterar el código fuente, y a su vez, facilitar la iteración y el despliegue rápido, adhiriéndonos al concepto de MVE (Mínimo Valor Entregable).

## 🚀 Funcionalidades Destacadas del MVE

- **Configuración de Fecha de Simulación:** Permite establecer una fecha de referencia (`hoy`) para el cálculo de reglas basadas en la anticipación del turno (`dias_antes_contacto_exacto`)
- **Administración de Reglas Dinámicas:**
  - **Creación de Reglas:** Posibilita la definición de reglas personalizadas de inclusión o exclusión, contemplando criterios como: especialidad, tipo de atención, profesional, días previos al turno, estado del turno, rango de edad del paciente y excepciones por número de RUT del profesional
  - **Importación de Reglas (JSON):** Facilita la carga masiva de reglas predefinidas mediante la importación de un archivo en formato JSON. Se incluye validación básica del formato JSON
  - **Listado y Eliminación:** Permite la visualización y eliminación individual de reglas, así como la opción de remover todas las reglas configuradas
  - **Opciones Dinámicas:** Los campos con `datalist` (Especialidad, Tipo de Atención, Estado del Turno) se autocompletan con los valores ya presentes en las reglas previamente añadidas, simplificando la experiencia de usuario
  - **Feedback de Usuario:** Mensajes claros de éxito o error al agregar, eliminar o importar reglas con auto-dismiss configurable
- **Filtrado de Turnos (JSON):** Procesa un archivo JSON de turnos de entrada, aplicando las reglas definidas para generar un listado depurado de turnos filtrados. Incluye validación básica del JSON de entrada
- **Interfaz Guiada (Stepper):** La aplicación está organizada en 3 pasos claros e intuitivos, asegurando una experiencia de usuario fluida
- **Diseño Adaptativo del Stepper:** En pantallas de dimensiones reducidas, los pasos del stepper se presentan en formato de lista vertical, garantizando una óptima legibilidad
- **Modularización y Separación de Estilos:** El código se encuentra modularizado en componentes React y las clases de estilos de Tailwind CSS han sido segregadas en archivos `.css` dedicados, lo que favorece la mantenibilidad y claridad del código
- **Persistencia Local:** Las reglas y la fecha de simulación se guardan automáticamente en el `localStorage` del navegador, persistiendo entre sesiones
- **Utilidades para JSON:** Botones para "Vaciar JSON" en los campos de entrada de turnos y reglas

## 🛠️ Tecnologías Empleadas

- **React:** Biblioteca para la construcción de interfaces de usuario
- **Tailwind CSS:** Framework CSS orientado a utilidades para un diseño ágil y adaptable
- **JavaScript (ES6+):** Lenguaje de programación principal

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/mpmoraleservin/filtro-turnos-medicos.git
cd filtro-turnos-medicos
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta la aplicación:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

## 🎯 Uso

### Paso 1: Configuración de Fecha
- Establece la fecha de simulación para el cálculo de "días antes"

### Paso 2: Gestión de Reglas
- **Crear reglas**: Define criterios de inclusión o exclusión
- **Importar reglas**: Carga reglas desde un archivo JSON
- **Gestionar reglas**: Visualiza, edita y elimina reglas existentes

### Paso 3: Filtrar Citas
- Ingresa el JSON de citas a filtrar
- Ejecuta el filtrado y obtén los resultados

## 🧩 Ejemplos de JSON

### `citas.json` (Ejemplo de entrada de turnos)

```json
[
  {
    "id_cita": "C001",
    "fecha_cita": "2025-05-26",
    "especialidad": "Cardiología",
    "tipo_atencion": "Primera Consulta",
    "rut_profesional": "12345678-9",
    "nombre_profesional": "Dr. Juan Pérez",
    "estado_cita": "Agendada",
    "rut_paciente": "20123456-7",
    "nombre_paciente": "Ana Gómez",
    "edad_paciente": 45
  },
  {
    "id_cita": "C002",
    "fecha_cita": "2025-05-27",
    "especialidad": "Pediatría",
    "tipo_atencion": "Control",
    "rut_profesional": "98765432-1",
    "nombre_profesional": "Dra. Laura Díaz",
    "estado_cita": "Agendada",
    "rut_paciente": "25987654-3",
    "nombre_paciente": "Diego Torres",
    "edad_paciente": 8
  }
]
```

### `reglas.json` (Ejemplo de reglas para importar)

```json
[
  {
    "description": "Pacientes de cardiología por primera vez: mensaje 2 días antes",
    "type": "include",
    "especialidad": "cardiología",
    "tipo_atencion": "primera consulta",
    "dias_antes_contacto_exacto": "2"
  },
  {
    "description": "Excluir pacientes del Dr. Martínez de tercera edad",
    "type": "exclude",
    "profesional_rut_es": "11111111-1",
    "edad_paciente_min": "65"
  },
  {
    "description": "Niños de pediatría (controles) con cita agendada: contacto",
    "type": "include",
    "especialidad": "pediatría",
    "tipo_atencion": "control",
    "estado_cita": "agendada",
    "edad_paciente_max": "17"
  },
  {
    "description": "La Dra. Gómez no quiere que contactemos a sus pacientes bajo ninguna circunstancia",
    "type": "exclude",
    "profesional_rut_es": "15678432-9"
  }
]
```

## 🧐 Suposiciones

Para la construcción de este MVE, se consideraron las siguientes suposiciones:

- **Formato de Datos de Entrada:** Se asume un formato específico para los datos de turnos ingresados (simulando una API de consulta) como un array JSON válido con un esquema consistente para cada turno
- **Fechas:** Las fechas se manejan en formato `AAAA-MM-DD`. El cálculo de "días antes" considera días completos, sin tener en cuenta horarios específicos para simplificar
- **Identificadores:** Se asume que el `id_cita` es un identificador único para cada turno. Los RUTs de profesionales son tratados como cadenas de texto
- **Validación de Formato:** Para este MVE, la validación de la estructura del JSON ingresado (citas y reglas) se limita a verificar que sea un array JSON válido y se muestran mensajes de error básicos en la interfaz de usuario en caso de fallos en el parseo
- **Persistencia:** La persistencia de las reglas y la fecha de simulación se implementa utilizando `localStorage` del navegador, lo que permite que la configuración se mantenga entre sesiones de usuario en el mismo dispositivo. Para una solución de producción, se requeriría una API de backend con almacenamiento en base de datos
- **Alcance:** El presente MVE se enfoca exclusivamente en el componente de "filtrado de turnos", sin incluir la simulación de APIs de consulta externas ni la acción de "notificación" posterior

## ⚙️ Elementos Excluidos del MVE (y su Justificación)

Para mantener el foco en la entrega de valor mínimo viable, se han excluido los siguientes elementos:

- **Persistencia Centralizada:** No se incluyó una base de datos o API de backend para la persistencia de las reglas. Si bien el `localStorage` provee persistencia a nivel del navegador, una solución de producción requeriría un sistema de almacenamiento robusto y centralizado
- **Autenticación y Autorización:** No se implementó ningún sistema de autenticación de usuarios o gestión de permisos, ya que no era central para el componente de filtrado
- **Integración con APIs Reales:** Se asume que la lista de turnos de entrada es un JSON provisto, sin realizar llamadas a sistemas de agenda reales de Cero o de clientes
- **Manejo Exhaustivo de Errores y Edge Cases:** Si bien se incluyó validación básica de JSON y feedback al usuario, una aplicación de producción requeriría una validación más granular de los tipos de datos en las reglas y turnos
- **Interfaz de Usuario Altamente Sofisticada:** Aunque se utilizó Tailwind CSS para un diseño limpio y responsivo, no se priorizó la elaboración de una UI/UX avanzada más allá de lo necesario para la funcionalidad central

## 📈 Aporte de Valor de la Solución (MVE)

El presente MVE aporta valor significativo a Cero de la siguiente manera:

- **Adaptabilidad Rápida:** Permite a los equipos de Customer Success y operaciones adaptar las políticas de contacto de cada institución de forma ágil, sin depender de cambios en el código del sistema principal, lo que reduce los tiempos de respuesta y mejora la autonomía
- **Optimización de Recursos:** Al filtrar los turnos de manera precisa, se asegura que solo los pacientes relevantes sean contactados, optimizando los recursos de comunicación y evitando contactos innecesarios o erróneos, lo cual es crítico para procedimientos específicos y exámenes de alto costo
- **Reducción de la Carga de Ingeniería:** Al externalizar la configuración de las reglas a una interfaz de usuario, se libera al equipo de ingeniería de integraciones de la necesidad de codificar o modificar lógicas de negocio constantemente, permitiéndoles enfocarse en las integraciones de APIs
- **Base Evolutiva:** Proporciona un prototipo funcional que sirve como base robusta para futuras iteraciones, permitiendo añadir nuevas funcionalidades (ej., persistencia en backend, integración con APIs, reportes) de manera incremental y basada en el feedback real de los interesados


## 🧪 Testing

Para probar el sistema, usa los archivos de ejemplo incluidos:
- `citas-test.json`: Conjunto de citas de prueba
- `reglas-test.json`: Reglas de ejemplo
- `resultado.json`: Ejemplo de respuesta
- Fecha de simulación recomendada: `2025-05-24`

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Shared/
│   │   └── HelperFunctions.js
│   ├── Step1_DatePicker.jsx
│   ├── Step2_RuleManagement/
│   │   ├── AddRuleForm.jsx
│   │   ├── ImportRulesModal.jsx
│   │   └── RuleList.jsx
│   ├── Step3_CitasFilter.jsx
│   └── StepperNavigation.jsx
├── styles/
│   ├── GlobalStyles.css
│   └── index.css
├── App.jsx
└── main.jsx
```


## Parte 3 - Algunas preguntas ❓

## 🫂 Algo más de contexto

Como parte de este ejercicio, me imaginé trabajando en un equipo multidisciplinario

- Ejecutivos de Customer Success de Cero que tienen varios clientes en su cartera y tienen que entender facilmente la app para poder explicarle al personal de las instituciones como aplicar un filtro de notificacion.
- El equipo de ingeniería de integraciones de Cero encargado de las conexiones con APIs de los clientes.
- Personal de instituciones de salud con diversos niveles de conocimiento técnico y deberian recibir una interfaz sencilla para filtrar citas.

## ✏️ Describa brevemente

1.  **Un centro médico le pide directamente con carácter urgente modificar sus políticas de contacto con pacientes de manera que entra en conflicto con su implementación actual. ¿Cuál sería su estrategia para abordar esta situación?**

    Mi estrategia para abordar esta situación sería la siguiente:

    - **Relevamiento Urgente y Clarificación:** Lo primero sería contactar rápidamente al centro médico (o a través del Ejecutivo de Customer Success si es el canal establecido) para entender la naturaleza exacta del conflicto y la urgencia. Es crucial obtener todos los detalles de la nueva política y cómo choca con la existente. Documentaría este nuevo requerimiento.
    - **Evaluación del Impacto y Viabilidad Técnica:** Internamente, junto al equipo de ingeniería de integraciones (si el conflicto es a nivel de datos o API) o directamente en el componente de filtros, evaluaría la complejidad del cambio. Dado que las reglas son dinámicas, la mayoría de los conflictos se resolverían a nivel de configuración de reglas existentes o añadiendo una nueva regla con mayor prioridad.
    - **Priorización y Solución Propuesta (MVE):**
      - Si es un cambio simple de reglas (ej. modificar una fecha, activar/desactivar un profesional), se podría hacer directamente en la UI del componente de filtros y comunicar al centro médico la implementación inmediata.
      - Si el conflicto es más profundo (ej. una nueva condición que no está contemplada en el modelo actual de reglas), propondría un "Mínimo Valor Entregable" para resolver la urgencia (ej. una regla de exclusión de emergencia) y, en paralelo, planificaría la ampliación del modelo de reglas para manejar la nueva complejidad de forma sostenible.
    - **Comunicación Transparente:**
      - **Al centro médico (vía Customer Success):** Explicaría la situación de forma clara y sin tecnicismos, indicando qué se puede hacer de inmediato, qué tomará más tiempo y por qué, y cuál es el plan de acción. Ofrecería alternativas si la solución completa no es inmediata.
      - **Al equipo de Customer Success:** Les proporcionaría los detalles técnicos para que puedan gestionar las expectativas del cliente y entender el impacto.
      - **Al equipo de Ingeniería:** Coordinaría si el cambio implica modificaciones en la extracción de datos o en la estructura de la API.
    - **Documentación y Registro:** Aseguraría que el cambio (y su justificación) quede documentado para futuras referencias y para mantener un registro de las políticas de cada cliente.

2.  **Necesita comunicar ciertas restricciones técnicas a representantes institucionales sin formación tecnológica. ¿Qué métodos utilizaría para asegurar una comunicación efectiva?**

    La comunicación con audiencias no técnicas requiere simplicidad, ejemplos concretos y enfoque en el "qué" y el "por qué" en lugar del "cómo" técnico. Mis métodos serían:

    - **Lenguaje Claro y Sencillo:** Evitaría la jerga técnica. Utilizaría analogías cotidianas.
    - **Enfoque en el Impacto y Beneficios:** Explicaría _cómo_ la restricción les afecta (ej. "esto significa que no podremos enviar mensajes para el tipo X de turno por ahora") y _por qué_ existe (ej. "porque el sistema de turnos de su institución no nos proporciona esa información de manera confiable").
    - **Analogías y Metáforas Visuales:**
      - **Para el filtrado:** "Imaginemos que tenemos un gran canasto con todos sus turnos. Nuestras reglas son como coladores con diferentes tamaños de agujeros que nos ayudan a quedarnos solo con los turnos que realmente necesitamos contactar."
      - **Para las restricciones:** "Nuestro sistema solo entiende el idioma que su sistema de turnos le 'habla'. Si su sistema no nos dice 'esto es un control', nosotros no podemos filtrar por 'control'."
    - **Ejemplos Concretos y Escenarios:** En lugar de hablar de "campos nulos", diría: "Si el turno del paciente Juan Pérez no tiene cargada la especialidad, nuestra regla de cardiología no podrá identificarlo."
    - **Demostraciones en Vivo (si aplica):** Si es posible, mostraría la interfaz de la aplicación y señalaría visualmente dónde están las restricciones o dónde falta información.
    - **Preguntas Abiertas y Escucha Activa:** Haría preguntas como "¿Se entiende esta parte?", "¿Tiene alguna duda sobre esto?" y me aseguraría de escuchar atentamente para identificar cualquier confusión y aclararla de inmediato.
    - **Material de Apoyo Simplificado:** Podría crear un breve diagrama de flujo visual o una tabla sencilla que resuma las capacidades y las limitaciones.

3.  **Ante la llegada simultánea de varias peticiones de modificación procedentes de distintas instituciones, ¿qué criterios aplicaría para establecer prioridades y cómo comunicaría estas decisiones?**

    Para establecer prioridades, aplicaría una combinación de los siguientes criterios, comunicando las decisiones de forma transparente:

    - **Criterios de Priorización:**

      1.  **Impacto en el Paciente/Operación (Urgencia):**
          - ¿Afecta la seguridad del paciente? (Prioridad máxima)
          - ¿Impide completamente la operación de contacto para un segmento crítico?
          - ¿Genera un error masivo o una comunicación incorrecta a un gran volumen de pacientes?
      2.  **Valor de Negocio/ROI:**
          - ¿Qué cliente representa un mayor volumen de turnos o un impacto estratégico para Cero?
          - ¿La modificación está alineada con objetivos de negocio clave (ej. optimizar recursos, mejorar la satisfacción del cliente)?
          - ¿Es una funcionalidad que otros clientes también podrían necesitar en el futuro (escalabilidad)?
      3.  **Complejidad Técnica / Esfuerzo:**
          - ¿Es una modificación simple de reglas existentes en la UI que se puede hacer en minutos?
          - ¿Requiere desarrollo de nuevas funcionalidades o cambios en el modelo de datos?
          - ¿Hay dependencias con otros equipos (ej. ingeniería de integraciones)?
      4.  **Fecha de Compromiso Previa:** Si ya hay un compromiso de entrega para alguna petición.
      5.  **Disponibilidad de Recursos:** ¿Tenemos el personal y el conocimiento técnico disponible para abordar esa petición en particular?

    - **Comunicación de Decisiones:**
      - **Centralización:** Todas las peticiones deberían canalizarse a través de un punto único (ej. el Ejecutivo de Customer Success o un Product Owner). Esto evita la duplicación y el caos.
      - **Reunión o Comunicación Semanal/Quincenal:** Establecería un canal de comunicación regular (ej. reunión semanal de backlog, actualización por email) con los stakeholders clave (Customer Success, Ingeniería) para revisar las peticiones entrantes.
      - **Matriz de Priorización Simple:** Utilizaría una matriz o tabla sencilla (ej. "Petición A: Urgente/Bajo Esfuerzo", "Petición B: Media Urgencia/Alto Esfuerzo") para visualizar las decisiones.
      - **Explicación del "Por Qué":** No solo comunicaría _qué_ se priorizó, sino _por qué_. "Hemos decidido priorizar la petición X porque afecta a un 80% de sus turnos y puede resolverse en pocas horas, mientras que la petición Y requiere un desarrollo más profundo que iniciaremos la próxima semana."
      - **Gestión de Expectativas:** Sería realista con los plazos y comunicaría si una petición de "urgencia" no puede ser abordada de inmediato, ofreciendo una fecha estimada y un plan de acción.

4.  **Ha identificado que una institución proporciona datos en formatos inconsistentes, provocando errores intermitentes en su sistema de filtrado. ¿Qué proceso seguiría para identificar el origen del problema y desarrollar una solución adecuada?**

    Este es un escenario común en integraciones y requeriría un proceso estructurado:

    - **1. Recolección y Análisis de Evidencia:**

      - **Logs y Errores:** Revisaría los logs del sistema de filtrado para identificar patrones de error (¿qué tipo de error?, ¿cuándo ocurre?, ¿para qué tipo de datos?).
      - **Muestras de Datos:** Solicitaría muestras de datos de entrada (JSON de turnos) de la institución, tanto de los que _funcionan_ como de los que _fallan_, para comparar.
      - **Contexto del Error:** Preguntaría al equipo de integraciones o a Customer Success si hay algún cambio reciente en el sistema de la institución o en el proceso de extracción de datos.

    - **2. Identificación de la Causa Raíz (Debug):**

      - **Reproducción del Problema:** Intentaría replicar el error en un entorno de desarrollo con los datos problemáticos.
      - **Validación de Esquema:** Compararía el esquema de datos esperado por mi sistema de filtrado con el esquema real recibido de la institución. Identificaría los campos inconsistentes (ej. fechas en formato diferente, números como texto, campos faltantes, valores inesperados).
      - **Colaboración con Integraciones:** Trabajaría de cerca con el equipo de ingeniería de integraciones de Cero. Ellos son los expertos en la conexión con la API del cliente y pueden identificar si el problema radica en la extracción de datos o en la transformación antes de que lleguen a mi componente.

    - **3. Propuesta de Solución:**

      - **Normalización en Origen (Ideal):** La solución ideal sería que la institución o el equipo de integraciones normalizara los datos _antes_ de que lleguen al sistema de filtrado. Esto es lo más limpio y evita que el problema se propague. Se podría solicitar a la institución que ajuste su formato o que el equipo de integraciones implemente transformaciones.
      - **Adaptación en el Filtro (Contingencia/Transitorio):** Si la normalización en origen no es posible a corto plazo, mi sistema de filtrado podría adaptarse:
        - **Manejo Defensivo:** Implementar validaciones más robustas en `HelperFunctions.js` o al momento de parsear, con manejo de errores (`try-catch`, valores por defecto, _fallbacks_).
        - **Transformaciones Internas:** Si las inconsistencias son previsibles (ej. dos formatos de fecha), implementar lógica para transformar los datos al formato esperado _antes_ de aplicar las reglas.
        - **Reglas de Exclusión por Datos Inválidos:** Como medida temporal, podría crear una regla para excluir turnos con datos críticos mal formados, para evitar que el sistema falle.
      - **Comunicación de Impacto:** Explicaría las implicaciones de las inconsistencias (ej., "los turnos con este formato de fecha no serán procesados", "el filtro de edad no funcionará si la edad no es un número").

    - **4. Implementación, Pruebas y Monitoreo:**
      - Implementar la solución acordada.
      - Realizar pruebas exhaustivas con datos variados, incluyendo los que históricamente causaron problemas.
      - Implementar monitoreo y alertas para detectar rápidamente futuras inconsistencias o fallos.



