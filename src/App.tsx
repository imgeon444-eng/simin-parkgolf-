import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { OneStopSystem } from './components/OneStopSystem';
import { Facilities } from './components/Facilities';
import { ReservationSection } from './components/ReservationSection';
import { LocationSection } from './components/LocationSection';
import { FloatingCTA } from './components/FloatingCTA';
import { Footer } from './components/Footer';
import { AdminKanban } from './components/AdminKanban';
import { LayoutDashboard } from 'lucide-react';

export const App: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#050b07] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 상단 GNB 헤더 */}
      <Header onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
        {/* 1. Hero 섹션: 구글 플로우 타이틀 & 키네틱 모션 & 350평 하이라이트 */}
        <Hero />

        {/* 2. One-Stop 시스템: [교육 -> 스크린 -> 350평 옥상] 3단계 마스터 */}
        <OneStopSystem />

        {/* 3. 시설 및 프로그램 쇼케이스: 실외/실내/레슨/용품/대여 */}
        <Facilities />

        {/* 4. 실내/실외 2시간 단위 간편 예약 & 운영시간 가이드 */}
        <ReservationSection />

        {/* 5. 오시는 길 & 르네시떼 400대 주차(3시간 무료) 안내 */}
        <LocationSection />
      </main>

      {/* 우측 하단 원장님 전용 CRM 바로가기 플로팅 버튼 */}
      <button
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 z-40 px-3.5 py-2 rounded-full bg-black/80 hover:bg-emerald-950 backdrop-blur-xl border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95"
        title="원장님 전용 실시간 예약 CRM 칸반 보드 열기"
      >
        <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
        <span>원장님 CRM</span>
      </button>

      {/* 원장님 전용 실시간 CRM 칸반 보드 모달 */}
      <AdminKanban isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* 모바일 전용 하단 고정 전화 & 빠른 예약 바 */}
      <FloatingCTA />

      {/* 푸터 영역 */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
    </div>
  );
};

export default App;
