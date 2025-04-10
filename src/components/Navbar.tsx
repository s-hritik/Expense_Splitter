import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, LogIn } from 'lucide-react';
import SignInModal from './SignInModal';
import SignupModal from './SignupModal';
import Money from './Money.png'

type NavbarProps = {
  user: any;
};

const Navbar = ({ user }: NavbarProps) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleAuthClick = () => {
    if (user) {
      handleSignOut();
    } else {
      setShowSignIn(true);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
              <img src={Money} alt="logo" width="50" />
            
              </motion.div>
              <span className="text-xl font-bold text-gray-900">Split</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAuthClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                user
                  ? 'bg-rose-900 text-white hover:bg-rose-950'
                  : 'bg-emerald-600 text-white hover:bg-emerald-800'
              }`}
            >
              {user ? (
                <>
                  <LogOut size={20} />
                  Sign Out
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showSignIn && (
          <SignInModal
            onClose={() => setShowSignIn(false)}
            onSwitchToSignUp={() => {
              setShowSignIn(false);
              setShowSignUp(true);
            }}
          />
        )}
        {showSignUp && (
          <SignupModal
            onClose={() => setShowSignUp(false)}
            onSwitchToSignIn={() => {
              setShowSignUp(false);
              setShowSignIn(true);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;