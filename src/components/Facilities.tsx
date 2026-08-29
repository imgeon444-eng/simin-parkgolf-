import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Monitor, 
  Users, 
  ShoppingBag, 
  CalendarCheck, 
  Check, 
  Sparkles,
  Phone,
  ArrowUpRight
} from 'lucide-react';

export const Facilities: React.FC = () => {
  const [filter, setFilter] = useState('all');

  const facilityList = [
    {
      id: 'outdoor',
      category: 'facility',
      title: '옥상 350평 실외 숏게임장',
      badge: '350평 대규모 옥상',
      subtitle: '부산 사상구 르네시떼 6층 탁 트인 야외 시설',
      desc: '도심 속 건물 옥상 350평에 마련된 실전형 야외 숏게임장 & 퍼팅존입니다. 필드와 동일한 자연광과 바람 속에서 퍼팅 감각과 어프로치 정밀도를 완벽히 연마할 수 있습니다.',
      features: [
        '350평 탁 트인 시야와 쾌적한 옥상 환경',
        '다양한 라이와 언듈레이션이 구현된 실전 퍼팅 그린',
        '어프로치 숏게임 집중 훈련 구역 완비',
        '주간 및 야간 조명 완비로 쾌적한 연습 가능'
      ],
      icon: Building2,
      tag: '실외 시설'
    },
    {
      id: 'screen',
      category: 'facility',
      title: '실내 스크린 파크골프',
      badge: '초정밀 샷 분석',
      subtitle: '사계절 쾌적한 최신 스크린 시뮬레이터',
      desc: '날씨에 구애받지 않고 즐기는 최첨단 실내 스크린 타석입니다. 볼의 궤적, 스피드, 발사각을 실시간 데이터로 정밀 측정하여 스윙의 오류를 즉시 바로잡습니다.',
      features: [
        '최신 고해상도 센서 기반 타격 데이터 실시간 분석',
        '전국 유명 파크골프장 가상 코스 실전 모드',
        '계절 및 우천 시에도 100% 쾌적한 냉난방 시스템',
        '초보자도 쉽고 재미있게 적응하는 게임 모드'
      ],
      icon: Monitor,
      tag: '실내 스크린'
    },
    {
      id: 'lesson',
      category: 'education',
      title: '파크골프 전문 교육 (개인·단체)',
      badge: '원포인트 맞춤 코칭',
      subtitle: '자세 교정부터 필드 실전 전략까지',
      desc: '단순히 공을 치는 것이 아니라 기본 그립부터 올바른 스탠스, 척추 각도 유지, 힘을 빼는 타법까지 전문 지도자가 1:1 또는 동호회 단체 맞춤으로 지도합니다.',
      features: [
        '입문자 기초 완성반 (그립, 자세, 스윙 메커니즘)',
        '1:1 집중 원포인트 레슨 & 자세 교정',
        '동호회 및 직장인 단체 레슨 커리큘럼',
        '실제 필드 룰 및 매너, 코스 공략 노하우 전수'
      ],
      icon: Users,
      tag: '전문 교육'
    },
    {
      id: 'shop',
      category: 'service',
      title: '파크골프 공식 용품 샵',
      badge: '맞춤형 장비 추천',
      subtitle: '정품 클럽, 볼, 가방 및 파우치 완비',
      desc: '신뢰할 수 있는 브랜드의 정품 파크골프 용품을 직접 보고 만져보며 내 체형과 구질에 꼭 맞는 장비를 전문가의 추천과 함께 합리적으로 구매하실 수 있습니다.',
      features: [
        '공인 파크골프 전용 클럽 및 샤프트 라인업',
        '고탄성 파크골프 볼 및 컬러볼 세트',
        '전용 가방, 장갑, 파우치, 볼마커 등 풀 세트 구비',
        '전문가의 체형별 맞춤 장비 상담 및 피팅 가이드'
      ],
      icon: ShoppingBag,
      tag: '용품 샵'
    },
    {
      id: 'rental',
      category: 'service',
      title: '실외 연습장 대여 및 단체 대관',
      badge: '프라이빗 모임 전용',
      subtitle: '동호회 월례회 & 친목 대회 전용 대관',
      desc: '350평 옥상 실외 연습장 전체 또는 전용 타석을 대여하여 가족 모임, 동호회 정기 모임, 기업 친목 행사를 프라이빗하고 여유롭게 진행하실 수 있습니다.',
      features: [
        '동호회 정기 월례회 및 친선 미니 대회 가능',
        '시간 단위 / 반일 / 종일 대관 프로그램 지원',
        '르네시떼 400대 이상 무료 주차 3시간 완벽 연동',
        '음료 및 휴게 라운지 편의시설 이용 지원'
      ],
      icon: CalendarCheck,
      tag: '대여·대관'
    }
  ];

  const filteredList = filter === 'all' 
    ? facilityList 
    : facilityList.filter(item => item.category === filter);

  return (
    <section id="facilities" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* 섹션 헤더 */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>최고의 시설과 프리미엄 서비스</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            시민파크골프의 <br className="sm:hidden" />
            <span className="google-flow-text">주요 시설 및 프로그램</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg">
            옥상 350평 실외 숏게임장부터 최신 스크린, 맞춤 레슨, 공식 용품샵, 대여까지 완벽하게 준비되어 있습니다.
          </p>

          {/* 필터 탭 */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {[
              { label: '전체 보기', value: 'all' },
              { label: '실내/실외 시설', value: 'facility' },
              { label: '전문 교육/레슨', value: 'education' },
              { label: '용품 & 대여/대관', value: 'service' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  filter === tab.value
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 시설 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden border border-emerald-500/20"
              >
                {/* 상단 뱃지 & 아이콘 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.tag}
                    </span>
                    <div className="p-3 rounded-2xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-400 mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                {/* 특장점 체크리스트 */}
                <div>
                  <div className="space-y-2 border-t border-emerald-900/40 pt-4 mb-6">
                    {item.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#reservation"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs sm:text-sm font-bold transition-all"
                  >
                    <span>2시간 예약 & 이용 문의</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 하단 단체 및 대관 안내 배너 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>동호회 / 단체 레슨 / 옥상 350평 대관 환영</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              단체 예약이나 프라이빗 대관이 필요하신가요?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              인원수와 희망 일정을 말씀해 주시면 최적의 대관 조건과 단체 레슨 혜택을 안내해 드립니다.
            </p>
          </div>
          <a
            href="tel:010-7467-2080"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>단체 대관 문의: 010-7467-2080</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
