import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Star, ThumbsUp, AlertCircle, Bookmark, ArrowRight, RefreshCcw, Activity } from 'lucide-react';

interface Assessment {
  score: number;
  strengths: string;
  mistakes: string;
  missing_concepts: string[];
  deep_explanation: string;
}

interface Message {
  type: 'bot' | 'user' | 'system';
  text: string;
  assessment?: Assessment;
}

interface ChatUIProps {
  question: string;
  onAnswer: (answer: string) => Promise<Assessment>;
  isProcessing: boolean;
  onNext: () => void;
}

const AssessmentCard = ({ assessment, onNext }: { assessment: Assessment; onNext: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="holographic-border inner-glow p-8 rounded-[3rem] space-y-8 w-full bg-slate-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles size={120} className="text-sky-500" />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
            <Star className="text-sky-400 fill-sky-400/20" size={28} />
          </div>
          <div>
            <h4 className="text-xl font-black text-white tracking-tight leading-none mb-1 translate-z-20">Expert Evaluation</h4>
            <div className="flex items-center space-x-2">
              <Activity size={12} className="text-sky-400 animate-pulse" />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Neural Score Matrix</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-baseline space-x-1">
            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-sky-300 to-indigo-400 leading-none drop-shadow-sm">{assessment?.score ?? 0}</span>
            <span className="text-slate-500 font-black text-lg">/10</span>
          </div>
          <div className="h-1.5 w-24 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
             <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${(assessment?.score || 0) * 10}%` }} 
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 shadow-[0_0_15px_rgba(56,189,248,0.5)]" 
             />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-3 hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all group/box">
          <div className="flex items-center space-x-2 text-emerald-400">
            <ThumbsUp size={18} className="group-hover/box:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Key Strengths</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-medium italic">"{assessment?.strengths || 'Consistent logic application.'}"</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] space-y-3 hover:bg-rose-500/5 hover:border-rose-500/20 transition-all group/box">
          <div className="flex items-center space-x-2 text-rose-400">
            <AlertCircle size={18} className="group-hover/box:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logical Gaps</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-medium italic">"{assessment?.mistakes || 'No critical errors detected.'}"</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center space-x-2 text-slate-500">
          <Bookmark size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Framework Concepts</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(assessment?.missing_concepts || []).map((concept, i) => (
            <span key={i} className="text-[10px] font-black bg-slate-950/40 text-slate-300 px-4 py-2 rounded-xl border border-white/10 uppercase tracking-widest hover:border-sky-500/50 hover:bg-sky-500/5 transition-all cursor-default shadow-lg">
              {concept}
            </span>
          ))}
          {(!assessment?.missing_concepts || assessment.missing_concepts.length === 0) && (
            <span className="text-[10px] text-slate-600 italic">Universal logic applied...</span>
          )}
        </div>
      </div>

      <div className="bg-sky-500/5 border border-sky-500/10 p-8 rounded-[2.5rem] space-y-4 relative z-10 group/item hover:bg-sky-500/10 hover:border-sky-500/20 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sky-400">
            <Sparkles size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deep Learning Interpretation</span>
          </div>
          <div className="flex space-x-1">
             <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
             <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse [animation-delay:200ms] shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
          </div>
        </div>
        <p className="text-sm text-slate-200 leading-[1.8] font-medium tracking-tight">
          {assessment?.deep_explanation || 'Synthesizing detailed market evaluation...'}
        </p>
      </div>

      <div className="flex justify-end pt-4 relative z-10">
        <button 
          onClick={onNext}
          className="group flex items-center space-x-3 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg shadow-sky-500/20 active:scale-95 border border-sky-400/50"
        >
          <span>Initialize Next Case</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </motion.div>
  );
};

const ChatUI = ({ question, onAnswer, isProcessing, onNext }: ChatUIProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (question) {
      setMessages([{ type: 'bot', text: question }]);
    }
  }, [question]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    
    const result = await onAnswer(userMsg);
    if (result) {
      setMessages(prev => [...prev, { 
        type: 'system', 
        text: 'Assessment Complete',
        assessment: result
      }]);
    }
  };

  return (
    <div className="glass-panel h-full rounded-[3rem] flex flex-col overflow-hidden border border-white/10 relative bg-slate-950/40 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none" />
      
      {/* Chat Header */}
      <div className="px-8 py-4 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between relative z-10 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-4 ring-sky-500/10">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-tight text-[10px] uppercase">Cognitive Engine</h3>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(56,189,248,1)]" />
              <p className="text-[9px] text-sky-400 font-black uppercase tracking-widest">v7.4.2 Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
           {/* New Case Study Button */}
           <button 
             onClick={() => {
               onNext();
             }}
             className="group flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-sky-500 border border-white/10 hover:border-sky-400 transition-all active:scale-95"
           >
             <RefreshCcw size={14} className="text-sky-400 group-hover:text-white group-hover:rotate-180 transition-transform duration-500" />
             <span className="text-[9px] font-black text-slate-300 group-hover:text-white uppercase tracking-[0.2em]">Initialize New Case</span>
           </button>

           <div className="hidden sm:flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
             <div className="w-2 h-2 bg-emerald-500 rounded-full" />
             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Learning Active</span>
           </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 relative z-10 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} ${msg.type === 'system' ? 'w-full' : ''}`}
            >
              {msg.type === 'system' && msg.assessment ? (
                <AssessmentCard assessment={msg.assessment} onNext={onNext} />
              ) : (
                <div className={`flex items-start max-w-[80%] space-x-4 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-[0.75rem] flex items-center justify-center shrink-0 shadow-xl ring-2 ring-white/5 ${
                    msg.type === 'user' 
                      ? 'bg-gradient-to-br from-sky-500 to-indigo-500 text-white' 
                      : 'bg-slate-800 text-sky-400 border border-white/10'
                  }`}>
                    {msg.type === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`px-6 py-5 rounded-[1.5rem] text-sm leading-[1.7] font-medium shadow-2xl relative overflow-hidden group ${
                    msg.type === 'user' 
                      ? 'bg-sky-600 text-white selection:bg-white/30' 
                      : 'bg-white/5 border border-white/5 text-slate-100'
                  }`}>
                    {msg.type === 'user' && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    {msg.text}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex justify-start space-x-4"
          >
            <div className="w-10 h-10 rounded-[0.75rem] bg-slate-800 flex items-center justify-center shrink-0 border border-white/10 shadow-xl">
              <Bot size={20} className="text-sky-400 animate-pulse" />
            </div>
            <div className="bg-white/5 border border-white/5 px-6 py-5 rounded-[1.5rem] flex space-x-3 items-center shadow-lg">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-duration:800ms]" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-duration:800ms]" style={{ animationDelay: '200ms' }} />
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce [animation-duration:800ms]" style={{ animationDelay: '400ms' }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <AnimatePresence>
        {!messages.some(m => m.type === 'system') && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="p-6 bg-slate-900/60 border-t border-white/5 backdrop-blur-3xl relative z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.2)]"
          >
            <div className="relative group w-full mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Submit your insights..."
                  className="w-full bg-slate-950/80 border border-white/10 rounded-2xl py-4 px-6 pr-16 text-slate-100 font-medium placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 transition-all text-xs tracking-tight"
                  disabled={isProcessing}
                />
                <button
                  onClick={handleSend}
                  disabled={isProcessing || !input.trim()}
                  className="absolute right-2 top-2 bottom-2 aspect-square bg-white hover:bg-sky-500 text-slate-900 hover:text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-30 group/send active:scale-90"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
            <div className="flex justify-center mt-3">
               <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest text-center">AI Synthesis Enabled • Expert Logic Verification Active</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatUI;
