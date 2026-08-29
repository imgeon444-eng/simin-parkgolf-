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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#060d09]/90 backdrop-blur-md border-b border-emerald-900/40 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* 브랜드 로고 & 타이틀 (사각 경계선 없는 투명 로고) */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src={LOGO_PATH}
                alt="시민파크골프 로고"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(34,197,94,0.4)]"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors drop-shadow">
                  시민파크골프
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  옥상 350평
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide drop-shadow">
                부산 사상구 르네시떼 6층 복합 교육센터
              </span>
            </div>
          </a>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-8">
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

          {/* 우측 빠른 통화 CTA */}
          <div className="hidden lg:flex items-center gap-3">
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

          {/* 모바일 햄버거 토글 버튼 */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="tel:010-7467-2080"
              className="p-2 rounded-lg bg-emerald-600/30 border border-emerald-500/40 text-emerald-300"
              aria-label="전화 걸기"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-200 hover:text-white"
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a1510]/95 backdrop-blur-xl border-b border-emerald-800/40 px-5 pt-4 pb-6 mt-3 space-y-3 animate-fadeIn">
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/20 text-xs text-emerald-300 flex items-center justify-between">
            <span>영업시간: 11:00 ~ 21:00</span>
            <span className="font-bold text-amber-300">주차 3시간 무료</span>
          </div>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-base font-semibold text-slate-200 hover:text-emerald-400 py-2 border-b border-slate-800/60"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="tel:010-7467-2080"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-md shadow-emerald-500/20"
            >
              <Phone className="w-4 h-4" />
              <span>전화 예약 및 레슨 문의 (010-7467-2080)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
