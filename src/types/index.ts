
export type DailyHabit = {
  id: string;
  detail: string;
  streak: number;
  history: string[]; // YYYY-MM-DD
};

export type ShortGoal = {
  id: string;
  detail: string;
  done: boolean;
};

export type Enabler = {
  id: string;
  name: string;
  shortGoals: ShortGoal[];
  dailyHabits: DailyHabit[];
};

export type Dream = {
  id: string;
  text: string;
  enablers: Enabler[];
};

export type Store = {
  dreams: Dream[];
  overallETA: number;
};

export type WizardStep = {
  title: string;
  description: string;
  step: number;
  totalSteps: number;
};
