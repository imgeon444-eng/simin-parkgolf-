import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  Layers,
  ShieldCheck,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Lock,
  LogOut,
  Building2,
  X,
  BarChart3,
  Kanban
} from 'lucide-react';
import { 
  subscribeReservations, 
  updateReservationStatus, 
  deleteReservation, 
  createReservation 
} from '../lib/firebase';
import { ReservationData, ReservationStatus } from '../types';
import { AdminReports } from './AdminReports';

const COLUMNS: { id: ReservationStatus; title: string; badge: string; color: string; border: string; bg: string }[] = [
  { 
    id: 'new', 
    title: '신규 예약 접수', 
    badge: '실시간 접수', 
    color: 'text-emerald-400', 
    border: 'border-emerald-500/40', 
    bg: 'bg-emerald-950/30' 
  },
  { 
    id: 'contacting', 
    title: '통화 / 확인 중', 
    badge: '상담 진행', 
    color: 'text-amber-400', 
    border: 'border-amber-500/40', 
    bg: 'bg-amber-950/30' 
  },
  { 
    id: 'confirmed', 
    title: '예약 확정', 
    badge: '타석 배정 완료', 
    color: 'text-teal-400', 
    border: 'border-teal-500/40', 
    bg: 'bg-teal-950/30' 
  },
  { 
    id: 'completed', 
    title: '이용 완료', 
    badge: '라운딩 종료', 
    color: 'text-slate-400', 
    border: 'border-slate-800', 
    bg: 'bg-slate-900/30' 
  },
];

export const AdminPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'reports'>('kanban');
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('simin_admin_auth') === 'true';
  });
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customDate, setCustomDate] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 수동 예약 추가 모달
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newSlot, setNewSlot] = useState('13:00 ~ 15:00');
  const [newFacility, setNewFacility] = useState('outdoor');
  const [newPeople, setNewPeople] = useState('4');
  const [newMemo, setNewMemo] = useState('');

  // Firebase 실시간 동기화
  useEffect(() => {
    const unsubscribe = subscribeReservations((data) => {
      setReservations(data);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '1234' || pinCode === '0000' || pinCode === '7467') {
      setIsAuthenticated(true);
      localStorage.setItem('simin_admin_auth', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('simin_admin_auth');
    setPinCode('');
  };

  // 수동 예약 제출
  const handleAddManualReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const facilityLabels: Record<string, string> = {
      outdoor: '옥상 350평 실외 숏게임장 (2시간)',
      screen: '실내 스크린 파크골프 타석 (2시간)',
      lesson: '전문 교육 레슨 + 복합 연습 (2시간)'
    };

    await createReservation({
      facility: newFacility,
      facilityLabel: facilityLabels[newFacility] || '옥상 350평 실외 숏게임장 (2시간)',
      date: newDate,
      timeSlot: newSlot,
      name: newName,
      phone: newPhone,
      peopleCount: newPeople,
      memo: newMemo ? `[원장님 직접등록] ${newMemo}` : '[원장님 직접등록]'
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewMemo('');
  };

  // 문자 템플릿 복사
  const handleCopySms = (item: ReservationData) => {
    const text = `[시민파크골프 예약 확정 안내]\n안녕하세요, ${item.name} 고객님!\n\n- 예약일시: ${item.date} (${item.timeSlot})\n- 예약시설: ${item.facilityLabel}\n- 인원: ${item.peopleCount}명\n- 위치: 부산 사상구 광장로 7 르네시떼 르네관 6층 옥상\n- 주차: 400대 가능 (3시간 무료 지원)\n\n즐거운 시간 되실 수 있도록 정성껏 준비하겠습니다. 감사합니다!\n문의: 010-7467-2080`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // 상태 전환
  const handleMoveStatus = async (id: string, current: ReservationStatus, direction: 'next' | 'prev') => {
    const statusOrder: ReservationStatus[] = ['new', 'contacting', 'confirmed', 'completed'];
    const currentIndex = statusOrder.indexOf(current);
    if (currentIndex === -1) return;

    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < statusOrder.length) {
      await updateReservationStatus(id, statusOrder[nextIndex]);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredReservations = reservations.filter(r => {
    const matchSearch = r.name.includes(searchTerm) || r.phone.includes(searchTerm) || r.timeSlot.includes(searchTerm);
    if (!matchSearch) return false;

    if (dateFilter === 'today') {
      return r.date === todayStr;
    }
    if (dateFilter === 'custom' && customDate) {
      return r.date === customDate;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050c07] text-slate-100 font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 🔒 로그인 화면 */}
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#050c07] via-[#08150d] to-[#040905]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md p-8 rounded-3xl bg-[#09170f]/90 border border-emerald-500/40 shadow-2xl backdrop-blur-2xl text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Lock className="w-8 h-8" />
            </div>

            <h1 className="text-2xl font-black text-white mb-2">시민파크골프 CRM 관리자</h1>
            <p className="text-xs text-slate-400 mb-6">
              원장님 전용 실시간 예약 관리 & 비즈니스 리포트 포털입니다.<br />
              (초기 보안 PIN: <strong className="text-emerald-400 font-mono">1234</strong>)
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="4자리 PIN 입력"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-slate-700 text-white text-center text-xl font-mono tracking-widest focus:outline-none focus:border-emerald-400"
              />
              {pinError && (
                <p className="text-xs text-red-400 font-medium">PIN 번호가 올바르지 않습니다. (기본: 1234)</p>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.02] active:scale-98"
              >
                관리자 로그인
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <a
                href="/"
                className="text-xs text-slate-400 hover:text-emerald-400 inline-flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>공식 홈페이지 메인으로 이동</span>
              </a>
            </div>
          </motion.div>
        </div>
      ) : (
        /* 📊 풀스크린 CRM 대시보드 본체 */
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-[1700px] w-full mx-auto">
          {/* 1. 상단 글로벌 네비게이션 헤더 */}
          <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-emerald-900/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center p-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <img src="/images/logo.svg" alt="로고" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white">
                    시민파크골프 CRM 어드민 포털
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] text-emerald-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Firebase Cloud 실시간 연결됨</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  부산 사상구 르네시떼 6층 옥상 350평 · 실시간 고객 예약 파이프라인
                </p>
              </div>
            </div>

            {/* 탭 전환 스위처 & 액션 버튼들 */}
            <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
              {/* 21st.dev 스타일 탭 스위처 */}
              <div className="flex items-center p-1 rounded-2xl bg-black/60 border border-emerald-500/30">
                <button
                  onClick={() => setActiveTab('kanban')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'kanban'
                      ? 'bg-emerald-500 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Kanban className="w-4 h-4" />
                  <span>실시간 칸반 보드</span>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === 'reports'
                      ? 'bg-emerald-500 text-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>데이터 분석 리포트 (방사형 차트)</span>
                </button>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">+ 예약 등록</span>
              </button>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">홈페이지</span>
              </a>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-slate-900 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-300 transition-colors"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* 📊 2. 리포트 탭 화면 (방사형 레이더 & 도넛 & 바 차트) */}
          {activeTab === 'reports' ? (
            <div className="mt-6">
              <AdminReports reservations={reservations} />
            </div>
          ) : (
            /* 📋 3. 칸반 보드 화면 */
            <div className="flex-1 flex flex-col mt-6">
              {/* 2. 핵심 KPI 통계 배지 바 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
                <div className="p-4 rounded-2xl bg-[#09170e] border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">총 누적 예약</div>
                    <div className="text-2xl font-black text-white mt-1">{reservations.length}건</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Layers className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#142016] border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-emerald-400 font-semibold">신규 접수 대기</div>
                    <div className="text-2xl font-black text-emerald-300 mt-1">
                      {reservations.filter(r => r.status === 'new').length}건
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300">
                    <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0c1e18] border border-teal-500/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-teal-400 font-semibold">예약 확정 (타석 배정)</div>
                    <div className="text-2xl font-black text-teal-300 mt-1">
                      {reservations.filter(r => r.status === 'confirmed').length}건
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-teal-500/20 text-teal-300">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0a1410] border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-semibold">오늘({todayStr.substring(5)}) 예약</div>
                    <div className="text-2xl font-black text-amber-300 mt-1">
                      {reservations.filter(r => r.date === todayStr).length}건
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* 3. 검색 및 날짜 필터 바 */}
              <div className="p-4 rounded-2xl bg-[#08150d] border border-emerald-900/30 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
                    <Filter className="w-3.5 h-3.5 text-emerald-400" />
                    <span>날짜 필터:</span>
                  </span>

                  <button
                    onClick={() => setDateFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      dateFilter === 'all'
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    전체 보기
                  </button>

                  <button
                    onClick={() => setDateFilter('today')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      dateFilter === 'today'
                        ? 'bg-emerald-500 text-black shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    오늘 예약만 보기
                  </button>

                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => {
                      setCustomDate(e.target.value);
                      setDateFilter('custom');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* 검색창 */}
                <div className="relative md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="고객 성함, 전화번호 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/60 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* 4. 4단계 대형 인터랙티브 칸반 보드 */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-8">
                {COLUMNS.map((col) => {
                  const colItems = filteredReservations.filter(r => r.status === col.id);
                  return (
                    <div
                      key={col.id}
                      className={`rounded-3xl ${col.bg} border ${col.border} p-4 flex flex-col min-h-[550px] shadow-lg`}
                    >
                      {/* 컬럼 헤더 */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-extrabold ${col.color}`}>{col.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-black/60 text-white font-bold">
                            {colItems.length}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{col.badge}</span>
                      </div>

                      {/* 카드 리스트 */}
                      <div className="flex-1 space-y-3.5 overflow-y-auto max-h-[700px] pr-1">
                        {colItems.length === 0 ? (
                          <div className="h-40 flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                            해당 상태의 예약이 없습니다.
                          </div>
                        ) : (
                          colItems.map((item) => (
                            <motion.div
                              key={item.id}
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="p-4 rounded-2xl bg-[#09170e]/95 border border-emerald-500/25 shadow-xl space-y-3 hover:border-emerald-400/50 transition-all group"
                            >
                              {/* 1. 상단: 고객 성함 & 인원수 & 삭제 */}
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-base font-black text-white">{item.name}</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                      {item.peopleCount}명
                                    </span>
                                  </div>
                                  <div className="text-xs text-emerald-400 font-semibold mt-0.5">
                                    {item.facilityLabel}
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    if (confirm(`${item.name} 고객님의 예약을 삭제하시겠습니까?`)) {
                                      deleteReservation(item.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                                  title="예약 삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* 2. 날짜 및 2시간 타임 정보 */}
                              <div className="p-2.5 rounded-xl bg-black/60 border border-slate-800 text-xs space-y-1">
                                <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{item.date}</span>
                                  <span className="text-slate-600">|</span>
                                  <span className="text-amber-300 font-bold">{item.timeSlot}</span>
                                </div>

                                {/* 전화 바로걸기 링크 */}
                                <div className="pt-1 flex items-center justify-between">
                                  <a
                                    href={`tel:${item.phone}`}
                                    className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-white font-bold text-xs"
                                  >
                                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>{item.phone}</span>
                                  </a>

                                  {/* 확정 문자 복사 버튼 */}
                                  <button
                                    onClick={() => handleCopySms(item)}
                                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                                    title="예약 확정 안내 문자 복사"
                                  >
                                    {copiedId === item.id ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span className="text-emerald-400 font-bold">복사완료</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3 text-slate-400" />
                                        <span>문자복사</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* 3. 고객 메모 */}
                              {item.memo && (
                                <div className="text-[11px] text-slate-300 bg-[#06100a] p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-1.5">
                                  <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                  <span className="line-clamp-2">{item.memo}</span>
                                </div>
                              )}

                              {/* 4. 상태 변경 컨트롤러 */}
                              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                                {col.id !== 'new' ? (
                                  <button
                                    onClick={() => handleMoveStatus(item.id, item.status, 'prev')}
                                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] flex items-center gap-1"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                    <span>이전</span>
                                  </button>
                                ) : <span />}

                                {col.id !== 'completed' && (
                                  <button
                                    onClick={() => handleMoveStatus(item.id, item.status, 'next')}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-all"
                                  >
                                    <span>다음 단계</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ➕ 전화/현장 예약 수동 등록 모달 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#09170f] border border-emerald-500/40 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>전화 / 현장 예약 수동 등록</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualReservation} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">고객 성함</label>
                  <input
                    type="text"
                    required
                    placeholder="홍길동"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">연락처</label>
                  <input
                    type="tel"
                    required
                    placeholder="010-0000-0000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">예약 날짜</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">2시간 타임슬롯</label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="11:00 ~ 13:00">11:00 ~ 13:00 (오전)</option>
                    <option value="13:00 ~ 15:00">13:00 ~ 15:00 (오후 1시)</option>
                    <option value="15:00 ~ 17:00">15:00 ~ 17:00 (오후 3시)</option>
                    <option value="17:00 ~ 19:00">17:00 ~ 19:00 (오후 5시)</option>
                    <option value="19:00 ~ 21:00">19:00 ~ 21:00 (야간 7시)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">이용 시설</label>
                  <select
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="outdoor">옥상 350평 실외 숏게임장</option>
                    <option value="screen">실내 스크린 타석</option>
                    <option value="lesson">전문 교육 레슨 + 복합</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">방문 인원</label>
                  <select
                    value={newPeople}
                    onChange={(e) => setNewPeople(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="1">1인</option>
                    <option value="2">2인</option>
                    <option value="4">4인 (1팀)</option>
                    <option value="8">8인 이상 (단체)</option>
                    <option value="20">대관</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">원장님 관리자 메모 (선택)</label>
                <input
                  type="text"
                  placeholder="예: 전화 문의 고객 / 2타석 배정"
                  value={newMemo}
                  onChange={(e) => setNewMemo(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-400 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/25 mt-2"
              >
                예약 칸반에 즉시 등록
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
