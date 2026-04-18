import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  BookOpen, Search, Info, Award, Target, TrendingUp, 
  Shield, Scale, Building2, Users, LogOut, Leaf, 
  Landmark, Settings2, Zap, BarChartHorizontal, Map 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AcademyPage = () => {
  const { token } = useAuth();
  const [concepts, setConcepts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAcademy = async () => {
      try {
        const res = await axios.get('http://localhost:8000/academy', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConcepts(res.data.concepts || []);
      } catch (err) {
        console.error("Failed to fetch academy data", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAcademy();
  }, [token]);

  const filteredConcepts = concepts.filter(c => 
    c.topic.toLowerCase().includes(search.toLowerCase()) || 
    c.definition.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (topic: string) => {
    const t = topic.toLowerCase();
    if (t.includes('roi')) return <TrendingUp className="text-emerald-400" size={24} />;
    if (t.includes('market trends') || t.includes('demand')) return <Target className="text-sky-400" size={24} />;
    if (t.includes('valuation')) return <Award className="text-amber-400" size={24} />;
    if (t.includes('risk')) return <Shield className="text-rose-400" size={24} />;
    if (t.includes('legal')) return <Scale className="text-blue-400" size={24} />;
    if (t.includes('urban') || t.includes('architecture')) return <Building2 className="text-indigo-400" size={24} />;
    if (t.includes('demographic')) return <Users className="text-violet-400" size={24} />;
    if (t.includes('exit')) return <LogOut className="text-orange-400" size={24} />;
    if (t.includes('esg')) return <Leaf className="text-green-400" size={24} />;
    if (t.includes('financing')) return <Landmark className="text-yellow-400" size={24} />;
    if (t.includes('operational')) return <Settings2 className="text-slate-400" size={24} />;
    if (t.includes('proptech')) return <Zap className="text-sky-400" size={24} />;
    if (t.includes('sensitivity')) return <BarChartHorizontal className="text-pink-400" size={24} />;
    if (t.includes('hyper-local')) return <Map className="text-teal-400" size={24} />;
    return <Info className="text-indigo-400" size={24} />;
  };

  return (
    <div className="p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center">
            <BookOpen className="mr-4 text-sky-500" size={32} />
            Knowledge <span className="text-sky-500 ml-2">Academy</span>
          </h2>
          <p className="text-slate-500 mt-2 font-bold text-sm uppercase tracking-widest">Master the art of Real Estate Intelligence</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md w-full md:w-80">
          <Search size={18} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search concepts..." 
            className="bg-transparent border-none text-sm focus:outline-none text-slate-300 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 glass-panel rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredConcepts.map((concept, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-8 rounded-[2rem] hover:border-sky-500/30 transition-all group overflow-hidden relative bg-slate-950/40 backdrop-blur-3xl inner-glow shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                {getIcon(concept.topic)}
              </div>
              
              <div className="bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
                {getIcon(concept.topic)}
              </div>
              
              <h3 className="text-xl font-black text-white mb-3 tracking-tight">{concept.topic}</h3>
              <p className="text-slate-200 text-sm leading-relaxed mb-6 font-medium">
                {concept.definition}
              </p>

              {(concept.factors || concept.key_drivers) && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                  {(concept.factors || concept.key_drivers).map((item: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-300 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-sky-500/20 transition-colors">
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {concept.formula && (
                <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-emerald-500/20 shadow-inner">
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">Calculation Logic</p>
                  <code className="text-emerald-400 font-mono text-xs">{concept.formula}</code>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcademyPage;
