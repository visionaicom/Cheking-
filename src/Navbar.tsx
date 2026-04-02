import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import supabase from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="text-2xl font-semibold tracking-tight">ResumAI</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link to="/#features" className="text-slate-600 hover:text-slate-900 transition">Features</Link>
          <Link to="/pricing" className="text-slate-600 hover:text-slate-900 transition">Pricing</Link>
          <Link to="/#how" className="text-slate-600 hover:text-slate-900 transition">How it Works</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-black rounded-xl transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition">
                Log in
              </Link>
              <Link to="/signup" className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl hover:opacity-90 transition">
                Get Started Free
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t bg-white px-6 py-6 flex flex-col gap-4">
          <Link to="/#features" onClick={() => setIsOpen(false)} className="text-slate-600 py-2">Features</Link>
          <Link to="/pricing" onClick={() => setIsOpen(false)} className="text-slate-600 py-2">Pricing</Link>
          <Link to="/#how" onClick={() => setIsOpen(false)} className="text-slate-600 py-2">How it Works</Link>
          <div className="pt-4 border-t flex flex-col gap-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="py-3 text-center border border-slate-200 rounded-xl">Dashboard</Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="py-3 text-white bg-slate-900 rounded-xl">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="py-3 text-center border border-slate-200 rounded-xl">Log in</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="py-3 text-center text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
