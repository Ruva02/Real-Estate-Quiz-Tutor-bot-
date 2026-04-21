import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, BarChart3, LogOut, Home, BookOpen, Layers, Settings, User as UserIcon, Bell, Search, Sparkles } from 'lucide-react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import PropertyCard from './components/PropertyCard';
import ChatUI from './components/ChatUI';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AcademyPage from './pages/AcademyPage';
import ArchivePage from './pages/ArchivePage';
import EngineeringPage from './pages/EngineeringPage';
import { useAuth } from './context/AuthContext';
import Background3D from './components/Background3D';
import React from 'react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-10">
          <div className="glass-panel p-10 rounded-[3rem] text-center border-rose-500/20 max-w-lg">
            <h2 className="text-2xl font-black text-white mb-4 italic uppercase">Initialization Error</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">Haven's cognitive bridge encountered an anomaly. Please re-establish synchronization.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-sky-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20"
            >
              Restart Sync
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const Sidebar = ({ activePath, onLogout, user }: { activePath: string; onLogout: () => void; user: any }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
    { icon: <BookOpen size={20} />, label: 'Academy', path: '/academy' },
    { icon: <Layers size={20} />, label: 'Market Archive', path: '/archive' },
    { icon: <Settings size={20} />, label: 'Engineering', path: '/engineering' },
  ];

  return (
    <div className="w-72 h-screen fixed left-0 top-0 border-r border-white/5 bg-slate-900/40 backdrop-blur-3xl flex flex-col z-50 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-12">
          <div className="bg-sky-500 p-2.5 rounded-2xl shadow-xl shadow-sky-500/20 ring-4 ring-sky-500/10">
            <GraduationCap className="text-white" size={24} />
          </div>
          <span className="text-xl font-black tracking-tight text-white italic underline decoration-sky-500/50 underline-offset-8">
            HAVEN<span className="text-sky-500">AI</span>
          </span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                activePath === item.path 
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                : 'text-slate-500 hover:text-sky-400 hover:bg-white/5'
              }`}
            >
              <span className={`${activePath === item.path ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                {item.icon}
              </span>
              <span className="text-sm font-bold tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/5 space-y-6">
        <div className="flex items-center space-x-3 p-4 glass-panel rounded-2xl border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center">
              <UserIcon size={20} className="text-sky-400" />
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.username || 'Expert'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Elite Tier</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl border border-white/5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all font-bold text-xs tracking-widest uppercase"
        >
          <LogOut size={16} />
          <span>Secure Logout</span>
        </button>
      </div>
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <Sidebar activePath={location.pathname} onLogout={() => { logout(); navigate('/login'); }} user={user} />
      
      <main className="flex-1 ml-72">
        <header className="px-10 py-6 border-b border-white/5 flex items-center justify-between bg-slate-900/20 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-black text-white tracking-tight">Intelligence Portal</h1>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center space-x-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
              <Search size={16} className="text-slate-500" />
              <input type="text" placeholder="Search knowledge base..." className="bg-transparent border-none text-xs focus:outline-none text-slate-400 w-48" />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-8">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-0.5">Global Rank</p>
                <p className="text-lg font-black text-sky-400 leading-none">#422</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-0.5">Total Insight</p>
                <p className="text-lg font-black text-white leading-none">{user?.total_score || 0}<span className="text-[10px] text-slate-500 font-bold"> pts</span></p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <button className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-sky-400 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-sky-500 rounded-full ring-2 ring-slate-900" />
            </button>
          </div>
        </header>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

function Dashboard() {
  const { token, user: stats } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const levelInfo = useMemo(() => {
    const score = Number(stats?.total_score || 0);
    const level = Math.floor(score / 500) + 1;
    const progress = ((score % 500) / 500) * 100;
    const titles = ["Novice", "Analyst", "Strategist", "Expert", "Master", "Zenith"];
    const titleIndex = Math.max(0, Math.min(level - 1, titles.length - 1));
    return { level, progress: isNaN(progress) ? 0 : progress, title: titles[titleIndex] || "Novice" };
  }, [stats]);

  const fetchNext = async () => {
    setRefreshKey(prev => prev + 1);
    setData(null); // Clear current state to show loading skeleton
    setLoading(true);
    
    // Artificial delay to ensure skeleton is visible (for UX confirmation)
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const res = await axios.get(`http://localhost:8000/next-question`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchNext();
  }, [token]);

  const handleAnswer = async (answer: string) => {
    setEvaluating(true);
    try {
      const response = await fetch(`http://localhost:8000/evaluate-stream`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          property_data: data.property,
          question: data.question,
          user_answer: answer
        })
      });

      if (!response.ok) throw new Error('Evaluation failed');
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          // Optional: We could update UI state here if we wanted mid-stream feedback
        }
      }
      
      let result;
      try {
        result = JSON.parse(accumulated);
        // Basic schema verification
        if (typeof result.score !== 'number') result.score = 0;
        if (!Array.isArray(result.missing_concepts)) result.missing_concepts = [];
      } catch (e) {
        console.error("Neural Synthesis Error: Failed to parse evaluation matrix", e);
        throw new Error("Cognitive bridge synchronization failed. The AI response was malformed.");
      }
      
      // Update local stats display after successful evaluation
      try {
        await axios.get(`http://localhost:8000/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Note: The AuthContext 'user' state will refresh on next dashboard mount 
        // or we could add a notify mechanism here.
      } catch (e) {
        console.error("Stats synchronization delay", e);
      }
      
      return result;
    } catch (err) {
      console.error("Session integrity compromised", err);
      throw err;
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="p-10">
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-12 xl:col-span-6 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-500 flex items-center">
              <Sparkles size={14} className="mr-2 text-sky-500" /> Target Listing
            </h3>
          </div>

          {loading ? (
            <div className="aspect-[4/5] glass-panel rounded-[2.5rem] animate-pulse flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
              <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase italic">Synthesizing Environment...</p>
            </div>
          ) : data && (
            <PropertyCard property={data.property} />
          )}

          <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 flex items-center">
                  <BarChart3 size={14} className="mr-2" /> Progression Matrix
                </h4>
                <div className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-black text-sky-400 uppercase tracking-widest">
                  Level {levelInfo.level}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Current Status</p>
                     <p className="text-xl font-black text-white tracking-tight">{levelInfo.title}</p>
                   </div>
                   <p className="text-xs font-black text-sky-400">{Math.round(levelInfo.progress)}%</p>
                </div>
                
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${levelInfo.progress || 0}%` }}
                    className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                  />
                </div>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center">
                  {Math.max(0, 500 - (Number(stats?.total_score || 0) % 500))} points to next rank
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mastery Focal Points</p>
                <div className="flex flex-wrap gap-2">
                  {stats?.weak_topics?.length > 0 ? stats.weak_topics.map((topic: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-indigo-500/5 text-indigo-300 border border-indigo-500/10 text-[9px] font-black uppercase tracking-widest hover:border-sky-500/30 transition-all cursor-default">
                      {topic}
                    </span>
                  )) : <span className="text-slate-600 italic text-[10px] font-medium tracking-wide">Cognitive profile optimized...</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-6 flex flex-col self-start">
          <div className="flex items-center justify-between mb-8 px-2">
             <h3 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-500">Haven Session</h3>
             <div className="flex items-center space-x-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-emerald-500/70 tracking-widest uppercase">Encryption Active</span>
             </div>
          </div>

          {loading ? (
            <div key="loading-skeleton" className="flex-1 glass-panel rounded-[2.5rem] border-2 border-dashed border-white/5 flex items-center justify-center p-20">
               <div className="text-center space-y-6">
                  <p className="text-slate-500 font-bold text-xs tracking-[0.3em] uppercase animate-pulse">Establishing Cognitive Link...</p>
               </div>
            </div>
          ) : data && (
            <div key={refreshKey} className="h-[580px] relative">
               <ChatUI 
                question={data.question} 
                onAnswer={handleAnswer} 
                isProcessing={evaluating} 
                onNext={fetchNext}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProtectRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <LoginPage />
          </motion.div>
        } />
        <Route path="/register" element={
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterPage />
          </motion.div>
        } />
        <Route path="/academy" element={
          <ProtectRoute>
             <Layout>
               <AcademyPage />
             </Layout>
          </ProtectRoute>
        } />
        <Route path="/archive" element={
          <ProtectRoute>
             <Layout>
               <ArchivePage />
             </Layout>
          </ProtectRoute>
        } />
        <Route path="/engineering" element={
          <ProtectRoute>
             <Layout>
               <EngineeringPage />
             </Layout>
          </ProtectRoute>
        } />
        <Route path="/" element={
          <ProtectRoute>
            <Layout>
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>
            </Layout>
          </ProtectRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-200">
      <Background3D />
      <AnimatedRoutes />
    </div>
  );
}

export default App;
