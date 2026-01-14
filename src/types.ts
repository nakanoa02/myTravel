export interface PlanItem {
  id: string;
  time?: string; // HH:MM
  title: string;
  location?: string;
  memo?: string;
}

export interface DayPlan {
  date: string; // YYYY-MM-DD
  items: PlanItem[];
}

export interface PackingItem {
  id: string;
  name: string;
  quantity: number;
  packed: boolean;
}

export interface Expense {
  id: string;
  label: string;
  amount: number; // JPY or chosen currency
  paidBy?: string;
}

export interface Trip {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  days: DayPlan[];
  packing: PackingItem[];
  expenses: Expense[];
  notes: string;
}

