# Módulo de Nutrición - YourGainz 🍽️

## Descripción
El módulo de nutrición de YourGainz es un sistema completo de seguimiento nutricional que permite a los usuarios registrar sus comidas, hacer seguimiento de macronutrientes y analizar sus hábitos alimentarios.

## Características Principales ✨

### 1. 📱 Registro de Alimentos
- **Base de datos completa**: Más de 15 alimentos comunes con macronutrientes precisos
- **Búsqueda inteligente**: Filtrado por nombre y categoría con autocompletado
- **Alimentos personalizados**: Crea tus propios alimentos con macros customizados
- **Sistema de favoritos**: Acceso rápido a tus alimentos más frecuentes
- **Porciones comunes**: Selección rápida de cantidades habituales

### 2. 🍽️ Estructura de Comidas
- **5 bloques diarios**: Desayuno, Media Mañana, Comida, Merienda y Cena
- **Múltiples entradas**: Añade varios alimentos por comida
- **Visualización clara**: Barras de progreso para macros y calorías
- **Edición fácil**: Modifica o elimina entradas con gestos intuitivos

### 3. 📊 Tracking Diario e Histórico
- **Vista del día actual**: Resumen completo de calorías y macros
- **Navegación temporal**: Revisa días anteriores con calendario interactivo
- **Indicadores de progreso**: Semáforo visual para adherencia a objetivos
- **Historial detallado**: Análisis de tendencias semanales

### 4. 🎨 Interfaz y Usabilidad
- **Modo claro y oscuro**: Adaptación automática al tema de la app
- **Diseño moderno**: UI limpia con tipografía legible
- **Flujo optimizado**: Añadir alimentos en un solo clic
- **Feedback inmediato**: Confirmaciones y alertas útiles

### 5. 📈 Resumen y Análisis
- **Gráficos interactivos**: Visualización de calorías día a día
- **Resumen semanal**: Promedios y tendencias de macronutrientes
- **Indicadores clave**: Métricas de adherencia y variación
- **Análisis inteligente**: Insights automatizados sobre tu progreso

## Arquitectura Técnica 🏗️

### Componentes Principales
```
src/components/
├── NutritionScreen.tsx          # Navegador principal
├── NutritionMainScreen.tsx      # Pantalla de tracking diario
├── FoodSearchScreen.tsx         # Búsqueda de alimentos
├── CreateFoodScreen.tsx         # Creación de alimentos personalizados
├── NutritionHistoryScreen.tsx   # Historial nutricional
├── NutritionSettingsScreen.tsx  # Configuración de objetivos
├── WeeklySummaryScreen.tsx      # Resumen semanal
└── SimpleHeader.tsx             # Header reutilizable
```

### Gestión de Estado
- **NutritionContext**: Context API para estado global de nutrición
- **Persistencia**: Preparado para AsyncStorage/SQLite
- **Optimización**: Cálculos en tiempo real de macronutrientes

### Tipos de Datos
```typescript
// Tipos principales
interface Food {
  id: string;
  name: string;
  macros: Macros;
  category: FoodCategory;
  isCustom: boolean;
  isFavorite: boolean;
  commonPortions?: Portion[];
}

interface FoodEntry {
  id: string;
  foodId: string;
  grams: number;
  meal: MealType;
  date: string;
  createdAt: string;
}

interface DailyNutrition {
  date: string;
  totalMacros: Macros;
  mealEntries: Record<MealType, FoodEntry[]>;
  targetMacros?: Macros;
}
```

## Navegación 🧭

### Flujo Principal
1. **Pantalla Principal** → Vista del día actual con resumen
2. **Búsqueda** → Encuentra y añade alimentos
3. **Creación** → Añade alimentos personalizados
4. **Historial** → Revisa días anteriores
5. **Configuración** → Establece objetivos nutricionales
6. **Resumen** → Análisis semanal detallado

### Integraciones
- **Tema dinámico**: Soporte completo para modo claro/oscuro
- **Navegación fluida**: Transiciones suaves entre pantallas
- **Contexto global**: Integración con el estado de la app principal

## Configuración de Objetivos 🎯

### Calculadora Automática
- **Datos personales**: Edad, peso, altura, género
- **Nivel de actividad**: 5 niveles predefinidos
- **Objetivos**: Perder, mantener o ganar peso
- **Fórmula BMR**: Ecuación Mifflin-St Jeor para precisión

### Configuración Manual
- **Calorías objetivo**: Personalización directa
- **Distribución de macros**: Porcentajes ajustables
- **Validación inteligente**: Verificación de rangos saludables

## Funcionalidades Avanzadas 🚀

### Sistema de Favoritos
- Marcado rápido de alimentos frecuentes
- Filtrado por favoritos
- Acceso ultra-rápido a comidas habituales

### Análisis Inteligente
- Cálculo automático de adherencia
- Detección de patrones nutricionales
- Recomendaciones personalizadas

### Gestión de Porciones
- Porciones comunes predefinidas
- Conversión automática de gramos
- Flexibilidad total en cantidades

## Base de Datos de Alimentos 🥗

### Alimentos Incluidos
- **Proteínas**: Pollo, salmón, atún, huevos
- **Carbohidratos**: Arroz, batata, avena, frutas
- **Grasas**: Aguacate, almendras, aceite de oliva
- **Verduras**: Brócoli y más vegetales
- **Lácteos**: Yogur griego, leche
- **Y mucho más...**

### Categorización
- 10 categorías principales
- Filtrado por tipo de alimento
- Búsqueda semántica inteligente

## Métricas y Seguimiento 📋

### Indicadores Diarios
- Calorías consumidas vs objetivo
- Distribución de macronutrientes
- Progreso por comida
- Adherencia porcentual

### Análisis Semanal
- Promedio de calorías
- Tendencias de macros
- Variación respecto a objetivos
- Insights automatizados

## Próximas Funcionalidades 🔮

- [ ] Escáner de códigos de barras
- [ ] Recetas personalizadas
- [ ] Planificación de comidas
- [ ] Integración con báscula inteligente
- [ ] Exportación de datos
- [ ] Sincronización en la nube

## Desarrollo y Extensibilidad 🛠️

### Agregar Nuevos Alimentos
```typescript
const newFood: Food = {
  id: 'unique_id',
  name: 'Nombre del alimento',
  macros: { calories: 100, protein: 20, carbs: 5, fat: 2 },
  category: 'proteins',
  isCustom: false,
  isFavorite: false,
  commonPortions: [
    { name: 'Porción estándar', grams: 100 }
  ]
};
```

### Personalizar Temas
El módulo respeta completamente el sistema de temas de YourGainz:
- Colores dinámicos
- Contraste optimizado
- Consistencia visual

---

¡El módulo de nutrición de YourGainz está listo para ayudarte a alcanzar tus objetivos nutricionales! 💪🥗
