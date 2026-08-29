import React from 'react';
import { Phone, Calendar, Clock, Sparkles } from 'lucide-react';

export const FloatingCTA: React.FC = () => {
  return (
    <aside aria-label="빠른 예약 및 전화 상담" className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#06120a]/95 backdrop-blur-xl border-t border-emerald-800/50 px-4 py-2.5 shadow-[0_-5px_25px_rgba(0,0,0,0.7)]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <a
          href="tel:010-7467-2080"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-transform"
        >
          <Phone className="w-4 h-4 animate-bounce" />
          <span>전화 상담 (010-7467-2080)</span>
        </a>

        <a
          href="#reservation"
          className="px-4 py-3 rounded-xl bg-slate-800/90 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-transform shrink-0"
        >
          <Clock className="w-4 h-4" />
          <span>2시간 예약</span>
        </a>
      </div>
    </aside>
  );
};
