import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MapPin, Maximize, ShieldCheck, Zap, TrendingUp, Sparkles } from 'lucide-react';

interface Property {
  id: string;
  location: string;
  price_value: number;
  price_unit: string;
  price_cr: number; // For compatibility
  area_sqft: number;
  type: string;
  amenities: string[];
  highlights: string;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = React.memo(({ property }: PropertyCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

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

  const isRent = property?.price_unit?.includes('Rent');
  const displayPrice = isRent 
    ? `₹${property?.price_value?.toLocaleString() || '0'}` 
    : `₹${property?.price_value || property?.price_cr || '0'} Cr`;

  // Dynamic Image Logic
  const getImageUrl = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('office') || t.includes('commercial')) 
      return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
    if (t.includes('villa') || t.includes('independent'))
      return "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80";
    if (t.includes('penthouse') || t.includes('luxury'))
      return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80";
    return "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"; // Apartment default
  };

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="holographic-border inner-glow p-0 rounded-[2.5rem] space-y-0 group transition-all duration-700 cursor-default relative overflow-hidden bg-slate-900/40 backdrop-blur-3xl shadow-2xl"
    >
      {/* Image Header */}
      <div className="h-48 w-full relative overflow-hidden">
        <img 
          src={getImageUrl(property.type)} 
          alt={property.type} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
          <div className="bg-sky-500/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/10">
            {isRent ? 'Rental' : 'Premium Sale'}
          </div>
          <motion.div 
            style={{ transform: "translateZ(30px)" }}
            className="flex items-center space-x-1 text-sky-400 bg-slate-950/40 backdrop-blur-md px-2 py-1 rounded-md border border-white/5"
          >
            <TrendingUp size={12} />
            <span className="text-[10px] font-bold">Market Active</span>
          </motion.div>
        </div>
      </div>

      <div className="p-8 pt-6 space-y-6">
        <div className="flex justify-between items-start relative z-10" style={{ transform: "translateZ(20px)" }}>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight leading-tight">{property.type}</h2>
            <div className="flex items-center text-slate-500 space-x-2">
              <MapPin size={12} className="text-sky-500/70" />
              <span className="text-xs font-bold uppercase tracking-wider">{property.location}</span>
            </div>
          </div>
          <div className="text-right">
             <p className="text-xl font-black text-white tracking-tighter">{displayPrice}</p>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{isRent ? 'Per Month' : 'Asking Price'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10" style={{ transform: "translateZ(25px)" }}>
          <div className="bg-white/5 p-4 rounded-2xl flex items-center space-x-4 border border-white/5 group-hover:border-sky-500/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Maximize className="text-sky-400" size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Dimension</p>
              <p className="text-sm font-black text-white italic">{property.area_sqft} <span className="text-[9px] font-bold text-slate-500">SQFT</span></p>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl flex items-center space-x-4 border border-white/5 group-hover:border-indigo-500/10 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Zap className="text-indigo-400" size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Efficiency</p>
              <p className="text-sm font-black text-white italic">A+ Grade</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 relative z-10" style={{ transform: "translateZ(10px)" }}>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black flex items-center">
            <Sparkles size={10} className="mr-2 text-sky-500" /> Core Amenities
          </p>
          <div className="flex flex-wrap gap-2">
            {property?.amenities?.map((item, idx) => (
              <span key={idx} className="bg-white/5 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-400 border border-white/5 group-hover:bg-sky-500/5 group-hover:text-sky-300 transition-all">
                {item}
              </span>
            )) || <span className="text-[10px] text-slate-500 italic">No amenities listed</span>}
          </div>
        </div>

        <div className="bg-sky-500/5 border border-sky-500/10 p-5 rounded-[1.5rem] flex items-start space-x-3 relative z-10" style={{ transform: "translateZ(30px)" }}>
          <div className="bg-sky-500/20 p-2 rounded-lg">
            <ShieldCheck className="text-sky-400 shrink-0" size={16} />
          </div>
          <p className="text-xs text-slate-300 font-medium leading-relaxed italic">
            "{property?.highlights || 'Consult Haven for detailed property insights and valuation analysis.'}"
          </p>
        </div>
      </div>

      {/* Gloss Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700" />
    </motion.div>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
