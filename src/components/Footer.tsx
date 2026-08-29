import React from 'react';
import { Phone, MapPin, Clock, Car } from 'lucide-react';

const LOGO_PATH = "images/logo.svg";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030704] border-t border-emerald-950 text-slate-400 text-xs py-14 px-4 sm:px-6 lg:px-8 pb-24 md:pb-14">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* 브랜드 소개 (투명 로고 적용) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src={LOGO_PATH}
                  alt="시민파크골프 로고"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-black text-white">시민파크골프</span>
                <span className="block text-[11px] text-emerald-400 font-semibold">
                  부산 사상구 르네시떼 6층 옥상 복합 교육·연습 센터
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              “제대로 배우고, 반복해서 연습하고, 실제 필드에 나갈 수 있도록 준비하는 곳.”<br />
              체계적인 기본기 교육부터 최신 스크린, 350평 옥상 숏게임장까지 한 곳에서 완성되는 부산 최고의 파크골프 시설입니다.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-semibold">
              <Car className="w-3.5 h-3.5 text-amber-400" />
              <span>르네시떼 400대 주차 완비 (3시간 무료 주차)</span>
            </div>
          </div>

          {/* 센터 상세 정보 */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              센터 운영 및 안내
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>부산광역시 사상구 광장로 7 르네시떼 르네관 6층 (옥상 350평)</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>영업시간: AM 11:00 ~ PM 09:00 (실내·실외 2시간 예약제)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>전화문의: <strong className="text-emerald-400 font-bold text-sm">010-7467-2080</strong></span>
              </li>
            </ul>
          </div>

          {/* 빠른 링크 */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              주요 서비스 바로가기
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#system" className="hover:text-emerald-400 transition-colors">3-Step 원스톱 교육 시스템</a></li>
              <li><a href="#facilities" className="hover:text-emerald-400 transition-colors">350평 옥상 숏게임장 & 퍼팅장</a></li>
              <li><a href="#facilities" className="hover:text-emerald-400 transition-colors">실내 스크린 파크골프</a></li>
              <li><a href="#reservation" className="hover:text-emerald-400 transition-colors">실내·실외 2시간 예약하기</a></li>
            </ul>
          </div>
        </div>

        {/* 저작권 및 카피라이트 */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} 시민파크골프 (Simin Park Golf). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>부산 사상구 파크골프 전문 복합 교육시설</span>
            <span className="text-slate-500">|</span>
            <span>문의: 010-7467-2080</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
