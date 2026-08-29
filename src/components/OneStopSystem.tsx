import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  MonitorPlay, 
  Sun, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Target, 
  TrendingUp,
  Compass
} from 'lucide-react';

export const OneStopSystem: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: 'STEP 01',
      title: '체계적인 기본기 교육',
      badge: '전문 강사진 레슨',
      subtitle: '바른 자세와 스윙 궤적의 완성',
      desc: '파크골프를 처음 시작하는 입문자부터 자세 교정이 필요한 숙련자까지, 개인 및 단체 맞춤형 커리큘럼으로 탄탄한 기본기를 완성합니다.',
      benefits: [
        '개인 1:1 밀착 레슨 & 동호회 단체 그룹 교육',
        '그립, 어드레스, 바른 스윙 폼 단계별 코칭',
        '부상 방지 및 힘을 빼는 정확한 타격 매커니즘'
      ],
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-600',
      accentColor: 'emerald',
      bgGlow: 'bg-emerald-500/10'
    },
    {
      step: 'STEP 02',
      title: '실내 스크린 연습',
      badge: '정밀 데이터 분석',
      subtitle: '다양한 지형과 실전 코스 경험',
      desc: '최신 스크린 파크골프 시스템을 통해 볼의 비거리, 방향각, 타격 궤적을 정밀하게 확인하고 다양한 필드 코스를 시뮬레이션합니다.',
      benefits: [
        '날씨와 계절에 상관없는 쾌적한 실내 타석',
        '정밀 샷 데이터 분석 및 구질 교정',
        '실제 파크골프장 코스 모드를 통한 코스 매니지먼트'
      ],
      icon: MonitorPlay,
      color: 'from-teal-500 to-cyan-600',
      accentColor: 'teal',
      bgGlow: 'bg-teal-500/10'
    },
    {
      step: 'STEP 03',
      title: '350평 옥상 실외 숏게임장',
      badge: '실전 필드 감각 완성',
      subtitle: '부산 사상구 르네시떼 6층 옥상 뷰',
      desc: '탁 트인 350평 옥상 전용 잔디 연습장에서 실제 필드와 동일한 라이와 거리감을 익혀 실전 대회 및 라운딩에 완벽 대비합니다.',
      benefits: [
        '350평 대규모 옥상 숏게임 & 퍼팅 연습존',
        '실제 자연광과 바람 속에서 익히는 실전 거리감',
        '개인 연습 및 동호회 전용 실외 대여/대관 지원'
      ],
      icon: Sun,
      color: 'from-amber-500 to-emerald-600',
      accentColor: 'amber',
      bgGlow: 'bg-amber-500/10'
    }
  ];

  return (
    <section id="system" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#07120c]/80">
      {/* 배경 장식 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 섹션 헤더 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>부산 유일의 올인원 복합 파크골프 센터</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-snug mb-4">
            교육부터 스크린, 옥상 실외까지 <br />
            <span className="google-flow-text">원스톱(One-Stop) 3단계 마스터</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg">
            따로따로 이동할 필요 없이, 한 건물 르네시떼 6층에서 모든 과정이 완벽히 이어집니다.
          </p>
        </div>

        {/* 3단계 스텝 네비게이션 탭 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-xl shadow-emerald-900/40 scale-[1.02]'
                    : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                {/* 활성화 표시 바 */}
                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 to-amber-400"
                  />
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-md ${
                    isActive ? 'bg-emerald-500 text-black font-extrabold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.step}
                  </span>
                  <div className={`p-2.5 rounded-xl ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className={`text-lg sm:text-xl font-bold mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {item.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* 선택된 단계 상세 정보 카드 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-6 sm:p-10 rounded-3xl relative overflow-hidden border border-emerald-500/30"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* 좌측 텍스트 설명 영역 */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <Target className="w-3.5 h-3.5" />
                  <span>{steps[activeStep].badge}</span>
                </div>

                <div>
                  <span className="text-sm font-extrabold text-amber-400 tracking-wider">
                    {steps[activeStep].step}
                  </span>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mt-1">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-emerald-400 font-semibold text-sm sm:text-base mt-2">
                    {steps[activeStep].subtitle}
                  </p>
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {steps[activeStep].desc}
                </p>

                {/* 혜택 목록 */}
                <div className="space-y-3 pt-2">
                  {steps[activeStep].benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 p-0.5 rounded-full bg-emerald-500 text-black">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-sm sm:text-base text-slate-200 font-medium">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <a
                    href="#reservation"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <span>이 코스로 2시간 예약하기</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="tel:010-7467-2080"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 font-bold text-sm border border-emerald-500/30 transition-all"
                  >
                    <span>레슨 및 이용 문의 (010-7467-2080)</span>
                  </a>
                </div>
              </div>

              {/* 우측 비주얼 하이라이트 박스 */}
              <div className="lg:col-span-5">
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 border border-emerald-500/40 relative shadow-2xl">
                  <div className="flex items-center justify-between border-b border-emerald-800/40 pb-4 mb-6">
                    <span className="text-xs text-slate-400 font-medium">시민파크골프 올인원 솔루션</span>
                    <span className="text-xs font-bold text-amber-400">사상구 르네시떼 6층</span>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-500/20 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                        01
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">기본기 교육</div>
                        <div className="text-sm font-bold text-white">1:1 맞춤 & 단체 레슨</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-teal-900/30 border border-teal-500/20 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold">
                        02
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">실내 스크린</div>
                        <div className="text-sm font-bold text-white">샷 데이터 & 코스 연습</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-900/30 border border-amber-500/20 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                        03
                      </div>
                      <div>
                        <div className="text-xs text-slate-400">옥상 350평 실외</div>
                        <div className="text-sm font-bold text-white">실전 숏게임장 & 퍼팅</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-emerald-800/40 text-center">
                    <span className="text-xs text-emerald-300 font-semibold">
                      ✨ 3가지 시설이 한 곳에 모여 실력이 2배 빠르게 향상됩니다!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
