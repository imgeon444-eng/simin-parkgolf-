import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Leaf, 
  Users, 
  Award, 
  Heart,
  CalendarCheck
} from 'lucide-react';
import { PROMO_PRESETS, subscribePromoConfig } from '../lib/firebase';
import { EventPromoConfig } from '../types';

export const PromoSection: React.FC = () => {
  const [promoConfig, setPromoConfig] = useState<EventPromoConfig>({
    isActive: true,
    selectedPresetId: 'first-visit'
  });

  useEffect(() => {
    const unsubscribe = subscribePromoConfig((config) => {
      setPromoConfig(config);
    });
    return () => unsubscribe();
  }, []);

  const activePreset = PROMO_PRESETS.find(p => p.id === promoConfig.selectedPresetId) || PROMO_PRESETS[0];

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Leaf': return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'Users': return <Users className="w-5 h-5 text-teal-400" />;
      case 'Award': return <Award className="w-5 h-5 text-indigo-400" />;
      case 'Heart': return <Heart className="w-5 h-5 text-rose-400" />;
      default: return <Gift className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="events" className="py-12 px-4 sm:px-6 lg:px-8 relative bg-[#040a06]">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {promoConfig.isActive ? (
            /* 🎁 1. 이벤트 ON 상태: 21st.dev 스타일 반짝이는 럭셔리 이벤트 카드 */
            <motion.div
              key="promo-active"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#07180e] via-[#0b2416] to-[#07180e] border border-emerald-400/50 shadow-[0_0_35px_rgba(16,185,129,0.25)] relative overflow-hidden group"
            >
              {/* 은은한 배경 오로라 */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-400/60 shadow-lg shrink-0 mt-1 text-emerald-400 group-hover:scale-105 transition-transform">
                    {getPresetIcon(activePreset.icon)}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-xs font-black shadow-md shadow-emerald-500/30">
                        {activePreset.discountBadge}
                      </span>
                      <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>기간 한정 프로모션 진행 중</span>
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {activePreset.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-300 font-bold">
                      🎁 혜택: {activePreset.benefit}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                      {activePreset.description}
                    </p>
                  </div>
                </div>

                {/* 2시간 예약 바로가기 CTA 버튼 */}
                <div className="shrink-0 w-full lg:w-auto pt-2 lg:pt-0">
                  <a
                    href="#reservation"
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-105 active:scale-95"
                  >
                    <span>이벤트 혜택으로 2시간 예약하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ) : (
            /* 🌿 2. 이벤트 OFF 상태: 깔끔한 상시 운영 안내 미니 카드 */
            <motion.div
              key="promo-inactive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-5 rounded-2xl bg-[#06100a] border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
            >
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-400">
                <CalendarCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  현재 별도의 시즌 프로모션이 없습니다. <strong className="text-slate-200">실내·실외 2시간 예약제는 상시 정상 운영</strong> 중입니다.
                </span>
              </div>
              <a
                href="#reservation"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 shrink-0"
              >
                <span>2시간 타석 예약하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
