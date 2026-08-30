import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Sparkles, 
  ArrowRight, 
  Leaf, 
  Users, 
  Award, 
  Heart,
  CalendarCheck,
  Phone,
  Building2
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
      <div className="max-w-7xl mx-auto">
        {/* ✨ 좌우 2분할 듀얼 벤토 그리드 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* 🎁 [좌측 50%] 실시간 특별 이벤트 & 프로모션 카드 */}
          <div className="flex">
            <AnimatePresence mode="wait">
              {promoConfig.isActive ? (
                /* 이벤트 ON 상태 */
                <motion.div
                  key="promo-active"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="w-full p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#071b10] via-[#092214] to-[#06140c] border border-emerald-400/45 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex flex-col justify-between relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

                  <div>
                    {/* 상단 뱃지 */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-xs font-black shadow-md shadow-emerald-500/30">
                        {activePreset.discountBadge}
                      </span>
                      <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>진행 중인 이벤트</span>
                      </span>
                    </div>

                    <div className="flex items-start gap-3.5 mb-3">
                      <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-400 shrink-0 mt-0.5">
                        {getPresetIcon(activePreset.icon)}
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                          {activePreset.title}
                        </h3>
                        <p className="text-xs text-emerald-300 font-bold mt-1">
                          🎁 {activePreset.benefit}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-6">
                      {activePreset.description}
                    </p>
                  </div>

                  {/* 예약 바로가기 버튼 */}
                  <a
                    href="#reservation"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-transform hover:scale-[1.02] active:scale-98"
                  >
                    <span>이벤트 혜택으로 2시간 예약하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>
              ) : (
                /* 이벤트 OFF 상태 */
                <motion.div
                  key="promo-inactive"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full p-6 sm:p-7 rounded-3xl bg-[#06120a] border border-slate-800/80 flex flex-col justify-between"
                >
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-bold mb-4">
                      <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>상시 예약 운영 중</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-white mb-2">
                      쾌적한 2시간 단위 실시간 예약
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-6">
                      현재 별도의 시즌 프로모션이 없습니다. 실내 스크린과 350평 옥상 숏게임장은 상시 쾌적하게 이용하실 수 있습니다.
                    </p>
                  </div>

                  <a
                    href="#reservation"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold border border-slate-700 transition-colors"
                  >
                    <span>실내·실외 2시간 예약하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 👥 [우측 50%] 동호회 단체 레슨 & 옥상 350평 대관 안내 카드 */}
          <div className="flex">
            <div className="w-full p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#081812] via-[#091f16] to-[#06120d] border border-emerald-500/35 shadow-xl flex flex-col justify-between group">
              <div>
                {/* 상단 뱃지 */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                    동호회 · 단체 레슨 · 대관
                  </span>
                  <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>350평 전용 공간</span>
                  </span>
                </div>

                <div className="flex items-start gap-3.5 mb-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shrink-0 mt-0.5">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                      단체 예약이나 프라이빗 대관이 필요하신가요?
                    </h3>
                    <p className="text-xs text-amber-300 font-semibold mt-1">
                      💡 400대 무료 주차(3시간) + 휴게 시설 완비
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  동호회 정기 모임, 친선 대회, 기업 단체 행사를 위한 옥상 350평 전용 타석 대여 및 단체 레슨 맞춤 조건을 안내해 드립니다.
                </p>
              </div>

              {/* 직통 전화 버튼 */}
              <a
                href="tel:010-7467-2080"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-950 hover:bg-emerald-900/90 border border-emerald-400/50 text-emerald-300 hover:text-white font-extrabold text-xs sm:text-sm shadow-md transition-transform hover:scale-[1.02] active:scale-98"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>단체 대관 직통 문의: 010-7467-2080</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
