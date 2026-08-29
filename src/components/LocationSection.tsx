import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Car, 
  Train, 
  Copy, 
  Check, 
  ExternalLink, 
  Clock, 
  Phone,
  Sparkles,
  Navigation
} from 'lucide-react';

const ADDRESS = "부산광역시 사상구 광장로 7 르네시떼 르네관 6층 (옥상)";

export const LocationSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="location" className="py-20 px-4 sm:px-6 lg:px-8 relative bg-[#07130d]">
      <div className="max-w-7xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>부산 사상구 중심 랜드마크</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            오시는 길 & <span className="google-flow-text">주차 시설 안내</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg">
            사상 르네시떼 르네관 6층(옥상)으로 오시면 350평 규모의 탁 트인 시민파크골프를 만나실 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 좌측: 주소 및 지도 네비게이션 바로가기 */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            {/* 메인 주소 카드 */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  센터 위치 정보
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  시민파크골프
                </h3>
                <p className="text-sm text-slate-300 mt-2 font-medium">
                  {ADDRESS}
                </p>
              </div>

              {/* 주소 복사 버튼 */}
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/40 text-emerald-300 text-sm font-bold transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>주소가 클립보드에 복사되었습니다!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>주소 복사하기</span>
                  </>
                )}
              </button>

              {/* 길찾기 지도 앱 바로가기 버튼 3종 */}
              <div>
                <div className="text-xs text-slate-400 mb-2.5 font-semibold">
                  스마트폰 길찾기 바로가기
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href="https://map.naver.com/v5/search/%EB%A5%B4%EB%44%A4%EC%8B%9C%EB%96%BC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#03C75A]/20 hover:bg-[#03C75A]/30 border border-[#03C75A]/40 text-white text-xs font-bold text-center flex flex-col items-center gap-1 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#03C75A]" />
                    <span>네이버 지도</span>
                  </a>

                  <a
                    href="https://map.kakao.com/link/search/%EB%A5%B4%EB%44%A4%EC%8B%9C%EB%96%BC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-[#FEE500]/20 hover:bg-[#FEE500]/30 border border-[#FEE500]/40 text-white text-xs font-bold text-center flex flex-col items-center gap-1 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#FEE500]" />
                    <span>카카오맵</span>
                  </a>

                  <a
                    href="https://tmap.co.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-white text-xs font-bold text-center flex flex-col items-center gap-1 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5 text-teal-400" />
                    <span>티맵 길안내</span>
                  </a>
                </div>
              </div>
            </div>

            {/* 대중교통 및 주차 혜택 카드 */}
            <div className="glass-card p-6 sm:p-7 rounded-3xl border border-emerald-500/20 space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>자가용 이용 및 주차 안내</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                      3시간 무료
                    </span>
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    르네시떼 대형 전용 주차시설 완비 (<strong className="text-white">400대 이상 주차 가능</strong>). 센터 이용 고객님께는 <strong className="text-amber-300 font-bold">3시간 무료 주차권</strong>을 지급해 드립니다.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-3 border-t border-emerald-900/30">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <Train className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">대중교통 이용 안내</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    부산 김해경전철 <strong className="text-white">르네시떼역 1번 출구</strong> 바로 연결 (도보 2분), 부산 지하철 2호선 <strong className="text-white">사상역</strong>에서 도보 7분 거리로 편리합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 우측: 옥상 350평 안내 뷰 & 인터랙티브 지도 카드 */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="h-full glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-emerald-950/80 via-slate-900 to-teal-950/90">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    르네관 6층 옥상 파크골프 맵
                  </span>
                  <span className="text-xs text-amber-400 font-bold">350평 웅장한 규모</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                  르네시떼 르네관 6층 옥상 안내
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6">
                  엘리베이터 또는 에스컬레이터를 타고 6층으로 올라오시면 탁 트인 하늘 아래 옥상 실외 숏게임장과 실내 스크린 교육센터가 펼쳐집니다.
                </p>

                {/* 층별 인포그래픽 박스 */}
                <div className="space-y-3 mb-6">
                  <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500 text-black font-black flex items-center justify-center text-sm">
                        6F
                      </div>
                      <div>
                        <div className="text-xs text-emerald-400 font-bold">옥상 (Rooftop 350평)</div>
                        <div className="text-sm font-bold text-white">시민파크골프 실외 숏게임장 & 퍼팅장 & 실내스크린</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs">
                        1~5F
                      </div>
                      <span>르네시떼 쇼핑몰 및 편의시설</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs">
                        B1~B3
                      </div>
                      <div>
                        <strong className="text-white">대형 주차장 (400대 이상 수용)</strong>
                        <span className="text-amber-400 font-semibold ml-2">3시간 무료 주차</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 전화 바로걸기 */}
              <div className="pt-4 border-t border-emerald-800/40">
                <a
                  href="tel:010-7467-2080"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white font-bold text-sm shadow-md transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>찾아오시는 길 문의: 010-7467-2080</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
