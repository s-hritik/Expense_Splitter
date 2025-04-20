import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ExpenseList from './components/ExpenseList';
import GroupList from './components/GroupList';
import AddExpenseModal from './components/AddExpenseModal';
import AddGroupModal from './components/AddGroupModal';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import { useStore } from './store/useStore';

function App() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { fetchGroups, fetchExpenses, selectedGroup } = useStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchGroups();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchGroups();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchExpenses();
    }
  }, [selectedGroup]);

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar user={user} />
      <Toaster position="top-right" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">SplitWise</h1>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsGroupModalOpen(true)}
              className="bg-rose-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-950 transition-colors"
            >
              <Users size={20} />
              New Group
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpenseModalOpen(true)}
              className="bg-rose-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-950 transition-colors"
              disabled={!selectedGroup}
            >
              <Plus size={20} />
              Add Expense
            </motion.button>
          </div>
        </div>

        <div className="space-y-8">
          <GroupList />
          <ExpenseList />
        </div>

        <AnimatePresence>
          {isExpenseModalOpen && (
            <AddExpenseModal
              onClose={() => setIsExpenseModalOpen(false)}
              onAddExpense={async (newExpense) => {
                try {
                  await useStore.getState().addExpense({
                    ...newExpense,
                    group_id: selectedGroup?.id,
                  });
                  setIsExpenseModalOpen(false);
                } catch (error) {
                  console.error('Error adding expense:', error);
                }
              }}
            />
          )}
          {isGroupModalOpen && (
            <AddGroupModal onClose={() => setIsGroupModalOpen(false)} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;