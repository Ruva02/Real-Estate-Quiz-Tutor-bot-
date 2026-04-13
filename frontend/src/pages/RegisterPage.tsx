import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { UserPlus, User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:8000/register', {
        username,
        password
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-slate-200">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center glass-panel p-12 rounded-[2.5rem]"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="text-emerald-500" size={40} />
          </div>
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Account Created!</h1>
          <p className="text-slate-400 font-medium">Redirecting you to login portal...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 selection:bg-sky-500/30">
      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="text-center mb-10 relative z-10" style={{ transform: "translateZ(30px)" }}>
            <div className="w-16 h-16 bg-sky-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-sky-500/20 shadow-inner">
              <UserPlus className="text-sky-500" size={32} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              Join Masterclass
            </h1>
            <p className="text-slate-400 font-medium">Start your real estate journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10" style={{ transform: "translateZ(20px)" }}>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="text-slate-500 group-focus-within:text-sky-500 transition-colors" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Choose Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/5 transition-all placeholder:text-slate-600 font-medium"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="text-slate-500 group-focus-within:text-sky-500 transition-colors" size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/5 transition-all placeholder:text-slate-600 font-medium"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="text-slate-500 group-focus-within:text-sky-500 transition-colors" size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/5 transition-all placeholder:text-slate-600 font-medium"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-400 text-xs font-bold uppercase tracking-wider bg-red-400/5 border border-red-400/10 p-4 rounded-2xl flex items-center space-x-2"
              >
                <span>⚠️ {error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold h-14 rounded-2xl shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0"
              style={{ transform: "translateZ(40px)" }}
            >
              <span className="tracking-wide">{loading ? 'PROCESSING...' : 'REGISTER'}</span>
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center relative z-10" style={{ transform: "translateZ(10px)" }}>
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-400 hover:text-sky-300 font-bold transition-colors underline-offset-4 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
