import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useStore } from '../store/useStore';

const ExpenseList = () => {
  const { expenses, selectedGroup } = useStore();

  const calculateSplits = (expense: any) => {
    const totalAmount = expense.amount;
    const perPerson = totalAmount / expense.participants.length;
    
    return expense.participants.map(participant => ({
      name: participant,
      amount: participant === expense.payer ? 
        -totalAmount + perPerson : // Payer gets back what others owe
        perPerson // Others owe their share
    }));
  };

  return (
    <div className="space-y-4">
      {selectedGroup && (
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Expenses for {selectedGroup.name}
        </h2>
      )}

      {expenses.map((expense, index) => (
        <motion.div
          key={expense.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{expense.title}</h3>
              <p className="text-sm text-gray-500">
                Paid by {expense.payer} • {format(new Date(expense.date), 'MMM d, yyyy')}
              </p>
            </div>
            <div className="text-xl font-bold text-red-800">
            ₹{expense.amount.toFixed(2)}
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Split Details:</h4>
            <div className="space-y-2">
              {calculateSplits(expense).map((split, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{split.name}</span>
                  <span className={`text-sm font-medium ${
                    split.amount < 0 ? 'text-red-700' : 'text-green-600'
                  }`}>
                    {split.amount < 0 ? 'gets back' : 'owes'} ₹{Math.abs(split.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}

      {expenses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {selectedGroup 
              ? 'No expenses yet in this group. Add one to get started!'
              : 'Select a group to view expenses'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;