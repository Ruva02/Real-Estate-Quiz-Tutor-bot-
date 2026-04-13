import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { User, Lock, ArrowRight, Shield, Zap } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Float, Stars, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useAuth } from '../context/AuthContext';

function Gateway() {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.z = state.clock.getElapsedTime() * 0.1;
      mesh.current.scale.x = 1 + Math.sin(state.clock.getElapsedTime()) * 0.05;
      mesh.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime()) * 0.05;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Torus ref={mesh} args={[4, 0.05, 16, 100]} position={[0, 0, -5]}>
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={5} toneMapped={false} />
        </Torus>
      </Float>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
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
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/login', {
        username,
        password
      });
      login(res.data.access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0F172A] relative overflow-hidden">
      {/* 3D Entry Portal Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#38bdf8" />
          <Gateway />
        </Canvas>
      </div>

      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, scale: 0.9, z: -100 }}
        animate={{ opacity: 1, scale: 1, z: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel p-10 rounded-[3rem] relative overflow-hidden group border-white/10 shadow-[0_0_50px_rgba(56,189,248,0.1)]">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="text-center mb-10 relative z-10" style={{ transform: "translateZ(50px)" }}>
            <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-sky-500/20 ring-4 ring-sky-500/10">
              <Zap className="text-white fill-white/20" size={36} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-3">
              CITY<span className="text-sky-500">ENTRY</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Masterclass Intelligence Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10" style={{ transform: "translateZ(30px)" }}>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <User className="text-slate-500 group-focus-within:text-sky-500 transition-colors" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="IDENTITY KEY"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-5 pl-14 pr-4 text-white focus:outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/5 transition-all placeholder:text-slate-700 font-bold text-xs tracking-widest"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Lock className="text-slate-500 group-focus-within:text-sky-500 transition-colors" size={18} />
                </div>
                <input
                  type="password"
                  placeholder="ACCESS CODE"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-5 pl-14 pr-4 text-white focus:outline-none focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/5 transition-all placeholder:text-slate-700 font-bold text-xs tracking-widest"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-400 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center space-x-2"
              >
                <Shield size={14} />
                <span>Authentication Denied: {error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-sky-500 text-slate-950 hover:text-white font-black h-16 rounded-2xl shadow-2xl flex items-center justify-center space-x-4 transition-all transform active:scale-95 disabled:opacity-50"
              style={{ transform: "translateZ(60px)" }}
            >
              <span className="tracking-[0.2em] text-xs font-black uppercase">{loading ? 'Verifying...' : 'ENGAGE PORTAL'}</span>
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center relative z-10" style={{ transform: "translateZ(20px)" }}>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
              New to the system?{' '}
              <Link to="/register" className="text-sky-400 hover:text-sky-300 transition-colors ml-2 underline underline-offset-4 decoration-2 decoration-sky-500/30">
                Register Clearance
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
