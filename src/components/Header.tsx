import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Clock, Sparkles } from 'lucide-react';

const LOGO_PATH = "images/logo.svg";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '센터 소개', href: '#about' },
    { name: '원스톱 교육', href: '#system' },
    { name: '시설 안내', href: '#facilities' },
    { name: '2시간 예약', href: '#reservation' },
    { name: '오시는 길', href: '#location' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#060d09]/95 backdrop-blur-md border-b border-emerald-900/40 shadow-lg shadow-black/50 py-2.5'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-3 sm:py-5'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          {/* 브랜드 로고 & 타이틀 (모바일에서 화면 밖으로 넘치지 않도록 flex-1 min-w-0 적용) */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-1">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src={LOGO_PATH}
                alt="시민파크골프 로고"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(34,197,94,0.4)]"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors drop-shadow whitespace-nowrap">
                  시민파크골프
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                  옥상 350평
                </span>
              </div>
              {/* 모바일에서는 깔끔하게 숨기고 태블릿 이상에서만 표시 */}
              <span className="hidden sm:block text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide drop-shadow truncate">
                부산 사상구 르네시떼 6층 복합 교육센터
              </span>
            </div>
          </a>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-semibold text-slate-200 hover:text-emerald-400 transition-colors relative py-1 group drop-shadow"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* 우측 데스크톱 빠른 통화 CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="text-right mr-1">
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1 drop-shadow">
                <Clock className="w-3 h-3" /> AM 11:00 ~ PM 09:00
              </div>
              <div className="text-xs text-slate-300 drop-shadow">실내/실외 2시간 예약제</div>
            </div>
            <a
              href="tel:010-7467-2080"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Phone className="w-4 h-4 animate-bounce" />
              <span>010-7467-2080</span>
            </a>
          </div>

          {/* 📱 모바일 우측 액션 버튼들 (화면 안쪽으로 100% 안전하게 고정) */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            <a
              href="tel:010-7467-2080"
              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-transform"
              aria-label="전화 걸기"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="text-[11px]">전화</span>
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 hover:text-white active:scale-95 transition-transform"
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a1510]/98 backdrop-blur-xl border-b border-emerald-800/40 px-4 pt-3 pb-5 mt-2 space-y-2.5 shadow-2xl">
          <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-600/20 text-xs text-emerald-300 flex items-center justify-between">
            <span>영업시간: 11:00 ~ 21:00</span>
            <span className="font-bold text-amber-300">주차 3시간 무료</span>
          </div>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-200 hover:text-emerald-400 py-2 border-b border-slate-800/60"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-1">
            <a
              href="tel:010-7467-2080"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>전화 예약 및 상담 (010-7467-2080)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
