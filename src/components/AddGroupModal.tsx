import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabase';

type AddGroupModalProps = {
  onClose: () => void;
};

const AddGroupModal = ({ onClose }: AddGroupModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState('');
  const [user, setUser] = useState<any>(null);
  const addGroup = useStore((state) => state.addGroup);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to create a group');
      return;
    }

    if (!name || !members) {
      toast.error('Please fill in all required fields');
      return;
    }

    const memberList = members.split(',').map((m) => m.trim());

    try {
      await addGroup({
        name,
        description,
        members: memberList,
      });
      toast.success('Group created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create group');
      console.error(error);
    }
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 text-center"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Sign In Required</h2>
          <hr />
          <br />
          <p className="text-white mb-6">Please sign in to create a group</p>
          <div className="flex justify-center gap-5">
            <button
              onClick={handleSignIn}
              className="px-4 py-2 bg-rose-800 text-white rounded-lg hover:bg-rose-800 transition-colors flex items-center gap-2"
            >
              <LogIn size={20} />
              Sign In
            </button>
      
            <button
              onClick={onClose}
              // className="px-4 py-2 text-white"
              className="px-4 py-2 bg-rose-800 text-white rounded-lg hover:bg-rose-800 transition-colors flex items-center gap-2"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-50">
          <h2 className="text-xl font-semibold text-white">Create New Group</h2>
          <button
            onClick={onClose}
            className="text-white"
          >
            <X size={24} />
          </button>
        </div>
         <hr/>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Group Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2"
              placeholder="Weekend Trip, Roommates, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
              placeholder="Group description"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Members (comma-separated) *
            </label>
            <input
              type="text"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg "
              placeholder="Name"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
               className="px-4 py-2 bg-rose-900 text-white rounded-lg hover:bg-rose-950 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-900 text-white rounded-lg hover:bg-rose-950 transition-colors"
            >
              Create Group
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGroupModal;