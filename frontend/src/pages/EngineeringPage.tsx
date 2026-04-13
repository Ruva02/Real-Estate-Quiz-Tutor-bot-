import { motion } from 'framer-motion';
import { Settings, Cpu, Database, Zap, Shield,Activity, Server, Globe } from 'lucide-react';

const EngineeringPage = () => {
  const metrics = [
    { label: 'Model Latency', value: '142ms', status: 'optimal', icon: <Zap size={18} /> },
    { label: 'Context usage', value: '12%', status: 'efficient', icon: <Database size={18} /> },
    { label: 'Vector DB Sync', value: 'Active', status: 'secure', icon: <Activity size={18} /> },
    { label: 'System Uptime', value: '99.98%', status: 'stable', icon: <Server size={18} /> },
  ];

  return (
    <div className="p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center">
            <Settings className="mr-4 text-emerald-500" size={32} />
            System <span className="text-emerald-500 ml-2">Intelligence</span>
          </h2>
          <p className="text-slate-500 mt-2 font-bold text-sm uppercase tracking-widest">Engine Diagnostics & Performance Matrix</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
          <Shield size={16} className="text-emerald-500" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Core Secured</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 rounded-3xl border-white/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-white/5 text-slate-400">
                {m.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-md">
                {m.status}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{m.label}</p>
            <h4 className="text-2xl font-black text-white">{m.value}</h4>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 glass-panel p-8 rounded-[2.5rem] relative overflow-hidden">
          <div className="relative z-10">
             <h3 className="text-lg font-black text-white mb-8 flex items-center">
                <Cpu className="mr-3 text-sky-500" size={20} />
                Neural Architecture Status
              </h3>
              
              <div className="space-y-8">
                {[
                  { name: 'RAG Retrieval Accuracy', progress: 94 },
                  { name: 'LLM Response Quality', progress: 88 },
                  { name: 'Embedding Vector Load', progress: 34 }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-slate-300 tracking-wide">{item.name}</span>
                      <span className="text-xs font-black text-sky-400">{item.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        className="h-full bg-gradient-to-r from-sky-500 to-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl" />
        </div>

        <div className="col-span-12 lg:col-span-4 glass-panel p-8 rounded-[2.5rem] flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-black text-white mb-2 flex items-center">
              <Globe className="mr-3 text-indigo-500" size={20} />
              Edge Nodes
            </h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">Active Deployment Regions</p>
            
            <div className="space-y-4">
              {['Asia-South-1 (Mumbai)', 'US-East-1 (N. Virginia)', 'EU-West-1 (Dublin)'].map((region, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-xs font-bold text-slate-400">{region}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button className="mt-8 w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
            Refresh Core System
          </button>
        </div>
      </div>
    </div>
  );
};

export default EngineeringPage;
