import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  Sparkles, 
  Clock, 
  ArrowRight,
  Film
} from 'lucide-react';

const VIDEO_SRC = "videos/Golf_ball_rolls_on_grass_202608290945.mp4";

const FLOW_KEYWORDS = [
  { text: "체계적인 맞춤 기본기 교육", desc: "개인 & 단체 정규 레슨" },
  { text: "실전 데이터 기반 실내 스크린", desc: "정밀 샷 분석 & 코스 플레이" },
  { text: "350평 옥상 실외 숏게임장", desc: "실제 필드 잔디 감각 완성" },
  { text: "파크골프 전문 복합 교육시설", desc: "교육부터 실전까지 One-Stop" }
];

export const Hero: React.FC = () => {
  const [keywordIndex, setKeywordIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setKeywordIndex((prev) => (prev + 1) % FLOW_KEYWORDS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[720px] flex items-center justify-center overflow-hidden bg-[#050b07] text-white">
      {/* 🎬 1. 제일기획 스타일: 상단 화면 전체를 100% 꽉 채우는 초고화질 풀스크린 비디오 레이어 */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover filter brightness-[0.82] contrast-110 scale-105"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        {/* 정교한 21st.dev 시네마틱 틴트 & 래디얼 비네팅 */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b07] via-transparent to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />
      </div>

      {/* 2. 메인 시네마틱 콘텐츠 레이어 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pt-20">
        {/* 21st.dev 스타일 하이엔드 뱃지 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-black/75 backdrop-blur-2xl border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="tracking-wide">부산 사상구 르네시떼 6층 옥상 350평</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-amber-300 font-bold">파크골프 복합 교육·연습 시설</span>
        </motion.div>

        {/* 인트로 질문 카피 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-2xl md:text-3xl text-slate-100 font-medium tracking-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
        >
          배우는 곳과 연습하는 곳이 따로 필요할까요?
        </motion.p>

        {/* 메인 헤드라인 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] mb-6 text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]"
        >
          시민파크골프, <br />
          <span className="google-flow-text drop-shadow-[0_4px_30px_rgba(16,185,129,0.7)]">
            한 곳에서 모두 완성
          </span>
        </motion.h1>

        {/* 구글 플로우 키네틱 단어 순환 모션 (글래스모피즘 강화) */}
        <div className="h-14 sm:h-16 flex items-center justify-center overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={keywordIndex}
              initial={{ y: 30, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -30, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-center gap-2 px-6 py-2 rounded-full bg-black/85 backdrop-blur-2xl border border-emerald-500/50 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-300 text-lg sm:text-2xl font-bold tracking-tight">
                  {FLOW_KEYWORDS[keywordIndex].text}
                </span>
              </div>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="text-xs sm:text-sm text-amber-300 font-semibold">
                {FLOW_KEYWORDS[keywordIndex].desc}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 서브 카피 */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-2xl mx-auto text-slate-100 text-sm sm:text-base md:text-lg leading-relaxed mb-9 px-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]"
        >
          <strong className="text-white font-semibold">“제대로 배우고, 반복해서 연습하고, 실제 필드에 나갈 수 있도록 준비하는 곳.”</strong><br />
          1:1 기본기 레슨부터 실내 스크린 분석, 탁 트인 350평 옥상 숏게임까지
        </motion.p>

        {/* CTA 버튼 그룹 (Shimmer & Border Glow) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#reservation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white text-base sm:text-lg font-bold shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 shimmer-btn border border-emerald-300/40"
          >
            <Clock className="w-5 h-5" />
            <span>실내·실외 2시간 예약하기</span>
            <ArrowRight className="w-5 h-5" />
          </a>

          <a
            href="tel:010-7467-2080"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-2xl border border-emerald-500/60 text-emerald-300 hover:text-white text-base sm:text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Phone className="w-5 h-5 text-emerald-400" />
            <span>전화 상담: 010-7467-2080</span>
          </a>
        </motion.div>
      </div>

      {/* 3. 우측 상단 4K Ultra HD 배지 */}
      <div className="absolute top-24 right-6 sm:right-10 z-20 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/40 text-xs text-emerald-300 shadow-xl">
        <Film className="w-3.5 h-3.5 text-amber-300" />
        <span className="font-semibold">4K Cinematic Video Active</span>
      </div>

      {/* 4. 제일기획 스타일: 하단 스크롤 다운 라인 인디케이터 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
        <span className="text-[10px] sm:text-[11px] text-slate-200 font-semibold tracking-widest uppercase mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">SCROLL DOWN</span>
        <div className="w-5 h-9 rounded-full border-2 border-emerald-400/80 flex items-start justify-center p-1 bg-black/60 backdrop-blur-sm">
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400"
          />
        </div>
      </div>
    </section>
  );
};
