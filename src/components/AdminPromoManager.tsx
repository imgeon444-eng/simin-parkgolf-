import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Check, 
  ToggleLeft, 
  ToggleRight, 
  Save, 
  Gift, 
  Flame, 
  Leaf, 
  Users, 
  Award, 
  Heart,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PROMO_PRESETS, subscribePromoConfig, updatePromoConfig } from '../lib/firebase';
import { EventPromoConfig } from '../types';

export const AdminPromoManager: React.FC = () => {
  const [promoConfig, setPromoConfig] = useState<EventPromoConfig>({
    isActive: true,
    selectedPresetId: 'first-visit'
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribePromoConfig((config) => {
      setPromoConfig(config);
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = async () => {
    const nextActive = !promoConfig.isActive;
    const updated = { ...promoConfig, isActive: nextActive };
    setPromoConfig(updated);
    await updatePromoConfig(updated);
    showSaveSuccess();
  };

  const handleSelectPreset = async (presetId: string) => {
    const updated = { ...promoConfig, selectedPresetId: presetId };
    setPromoConfig(updated);
    await updatePromoConfig(updated);
    showSaveSuccess();
  };

  const showSaveSuccess = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

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
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* 1. 상단 안내 헤더 */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#08150d] border border-emerald-500/40 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-emerald-900/40">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-xs text-emerald-300 font-bold mb-2">
              <Gift className="w-4 h-4 text-amber-400" />
              <span>원장님 맞춤형 초간편 원터치 관리</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              홈페이지 이벤트 & 할인 혜택 설정
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              스위치를 켜고 원하시는 이벤트를 터치하시면, 홈페이지에 즉시 반영됩니다.
            </p>
          </div>

          {/* 저장 완료 알림 뱃지 */}
          {isSaved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 rounded-2xl bg-emerald-500 text-black text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>홈페이지에 즉시 적용 완료!</span>
            </motion.div>
          )}
        </div>

        {/* 2. 큼직한 ON / OFF 원터치 토글 컨트롤러 (60대 원장님 최적화) */}
        <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-black/60 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <span>이벤트 표시 상태:</span>
              {promoConfig.isActive ? (
                <span className="text-emerald-400 font-black flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span>진행 중 (ON 켜짐)</span>
                </span>
              ) : (
                <span className="text-slate-400 font-bold">
                  진행 안 함 (OFF 꺼짐)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {promoConfig.isActive 
                ? '현재 홈페이지 하단에 선택하신 이벤트 카드가 빛나며 표시되고 있습니다.' 
                : '현재 홈페이지에 "진행 중인 이벤트가 없습니다" 상태로 깔끔하게 정돈되어 있습니다.'}
            </p>
          </div>

          {/* 큼직한 스위치 버튼 */}
          <button
            onClick={handleToggle}
            className={`px-6 py-3.5 rounded-full font-black text-base sm:text-lg flex items-center gap-3 transition-all duration-300 shadow-xl active:scale-95 ${
              promoConfig.isActive
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
            }`}
          >
            {promoConfig.isActive ? (
              <>
                <ToggleRight className="w-7 h-7 text-black" />
                <span>이벤트 끄기 (OFF)</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-7 h-7 text-slate-400" />
                <span>이벤트 켜기 (ON)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. 5가지 사전 정의된 이벤트 카드 목록 (터치 한 번으로 선택) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>원하시는 이벤트를 선택해 주세요 (5가지 중 택1)</span>
          </h3>
          <span className="text-xs text-emerald-400 font-semibold">클릭 즉시 선택 완료</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {PROMO_PRESETS.map((preset, index) => {
            const isSelected = promoConfig.selectedPresetId === preset.id;
            return (
              <motion.div
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`p-5 sm:p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-[#0a2014] border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-2 ring-emerald-500/50'
                    : 'bg-[#08150d]/80 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className={`p-3 rounded-2xl shrink-0 mt-0.5 border ${
                      isSelected ? 'bg-emerald-950 border-emerald-400' : 'bg-slate-900 border-slate-800'
                    }`}>
                      {getPresetIcon(preset.icon)}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-400 font-mono">
                          EVENT {index + 1}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
                          {preset.discountBadge}
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-black text-white">
                        {preset.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-400 font-semibold">
                        💡 혜택: {preset.benefit}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                  </div>

                  {/* 라디오 선택 체크 동그라미 */}
                  <div className="shrink-0 pt-1">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                      isSelected 
                        ? 'bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/50' 
                        : 'border-slate-700 bg-black/40'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
