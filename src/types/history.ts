// Interfaces para el historial de rutinas
export interface CompletedExercise {
  id: string;
  name: string;
  completed: boolean;
  completedSets: number;
  totalSets: number;
  reps: string;
  weight: string | null;
  rest: string;
}

export interface RoutineHistory {
  id: string;
  routineId: string;
  routineName: string;
  routineDescription: string;
  completedAt: string; // ISO string
  duration: string; // tiempo real transcurrido
  completedExercises: number;
  totalExercises: number;
  exercises: CompletedExercise[];
  completionPercentage: number;
}
