import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type Group = {
  id: string;
  name: string;
  description: string;
  members: string[];
  created_at: string;
  created_by: string;
};

export type Expense = {
  id: string;
  title: string;
  amount: number;
  payer: string;
  participants: string[];
  date: string;
  created_at: string;
  group_id?: string;
};

type Store = {
  groups: Group[];
  expenses: Expense[];
  selectedGroup: Group | null;
  fetchGroups: () => Promise<void>;
  fetchExpenses: () => Promise<void>;
  setSelectedGroup: (group: Group | null) => void;
  addGroup: (group: Partial<Group>) => Promise<void>;
  addExpense: (expense: Partial<Expense>) => Promise<void>;
};

export const useStore = create<Store>((set, get) => ({
  groups: [],
  expenses: [],
  selectedGroup: null,

  setSelectedGroup: (group) => set({ selectedGroup: group }),

  fetchGroups: async () => {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching groups:', error);
      return;
    }

    set({ groups: data });
  },

  fetchExpenses: async () => {
    const { selectedGroup } = get();
    const query = supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectedGroup) {
      query.eq('group_id', selectedGroup.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching expenses:', error);
      return;
    }

    set({ expenses: data });
  },

  addGroup: async (group) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to create a group');
    }

    const { data, error } = await supabase
      .from('groups')
      .insert([{
        ...group,
        created_by: user.id
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    const { groups } = get();
    set({ groups: [data, ...groups] });
  },

  addExpense: async (expense) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to create an expense');
    }

    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        ...expense,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    const { expenses } = get();
    set({ expenses: [data, ...expenses] });
  },
}));