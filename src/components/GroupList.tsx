
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import {  useStore } from '../store/useStore';

const GroupList = () => {
  const { groups, selectedGroup, setSelectedGroup } = useStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Your Groups</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedGroup?.id === group.id
                ? 'bg-slate-200 border-2 border-gray-500'
                : 'bg-white border-gray-500 hover:border-gray-200'
            }`}
            onClick={() => setSelectedGroup(group)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{group.name}</h3>
                <br />
                {group.description && (
                  <p className="text-sm text-gray-900 mt-1">{group.description}</p>
                )}
              </div>
              <Users className="text-gray-800" size={20} />
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-900">Members:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {group.members.map((member) => (
                  <span
                    key={member}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white">No groups yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
};

export default GroupList;