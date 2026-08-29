import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { OneStopSystem } from './components/OneStopSystem';
import { Facilities } from './components/Facilities';
import { ReservationSection } from './components/ReservationSection';
import { LocationSection } from './components/LocationSection';
import { FloatingCTA } from './components/FloatingCTA';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/AdminPortal';

export const App: React.FC = () => {
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return window.location.pathname.startsWith('/admin') || window.location.search.includes('admin=true');
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(window.location.pathname.startsWith('/admin') || window.location.search.includes('admin=true'));
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // 1. 원장님 전용 독립 CRM 관리자 포털 화면 (/admin 접속 시에만 노출)
  if (isAdminRoute) {
    return <AdminPortal />;
  }

  // 2. 일반 고객용 공식 모션 랜딩페이지 (/) - 고객용 화면에는 관리자 버튼이 전혀 노출되지 않습니다.
  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#050b07] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 상단 GNB 헤더 */}
      <Header />

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

      {/* 모바일 전용 하단 고정 전화 & 빠른 예약 바 */}
      <FloatingCTA />

      {/* 푸터 영역 */}
      <Footer />
    </div>
  );
};

export default App;
