import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Search, Filter, Calendar, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';

const ArchivePage = () => {
  const { token } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get('http://localhost:8000/all-properties', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProperties(res.data);
      } catch (err) {
        console.error("Failed to fetch archive", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAll();
  }, [token]);

  const filteredProperties = useMemo(() => {
    if (!search) return properties;
    const q = search.toLowerCase();
    return properties.filter(p => 
      p.location.toLowerCase().includes(q) || 
      p.type.toLowerCase().includes(q) ||
      p.highlights.toLowerCase().includes(q)
    );
  }, [search, properties]);

  return (
    <div className="p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center">
            <Layers className="mr-4 text-indigo-500" size={32} />
            Market <span className="text-indigo-500 ml-2">Archive</span>
          </h2>
          <p className="text-slate-500 mt-2 font-bold text-sm uppercase tracking-widest">Historical Intelligence Repository</p>
        </div>
        
        <div className="flex items-center space-x-4">
           <div className="flex items-center space-x-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-md">
            <Search size={18} className="text-slate-500" />
            <input 
              type="text" 
              placeholder="Search all properties..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none text-sm focus:outline-none text-slate-300 w-48"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <Loader2 className="animate-spin text-indigo-500" size={48} />
          <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Accessing Data Vault...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8">
          <AnimatePresence>
            {filteredProperties.map((prop, index) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <PropertyCard property={prop} />
                <div className="mt-4 flex items-center justify-between px-4">
                  <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Calendar size={12} className="mr-1.5" />
                    Indexed Portfolio
                  </div>
                  <div className="h-4 w-px bg-white/10 mx-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ID: {prop.id.slice(0, 8)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredProperties.length === 0 && (
        <div className="glass-panel p-20 rounded-[3rem] border-dashed border-2 border-white/5 flex flex-col items-center justify-center space-y-4 text-center">
          <MapPin size={48} className="text-slate-600 mb-2" />
          <h4 className="text-xl font-black text-white">No matches found</h4>
          <p className="text-slate-500 text-sm max-w-md font-medium">Try adjusting your filters or search query to find relevant property archives.</p>
        </div>
      )}
    </div>
  );
};

export default ArchivePage;
