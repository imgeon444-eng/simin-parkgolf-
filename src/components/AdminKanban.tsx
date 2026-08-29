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
  X, 
  ArrowRight, 
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  Layers,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import { 
  subscribeReservations, 
  updateReservationStatus, 
  deleteReservation, 
  createReservation 
} from '../lib/firebase';
import { ReservationData, ReservationStatus } from '../types';

interface AdminKanbanProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLUMNS: { id: ReservationStatus; title: string; badge: string; color: string; border: string; bg: string }[] = [
  { 
    id: 'new', 
    title: '신규 예약 접수', 
    badge: '접수 대기', 
    color: 'text-emerald-400', 
    border: 'border-emerald-500/40', 
    bg: 'bg-emerald-950/40' 
  },
  { 
    id: 'contacting', 
    title: '상담 / 확인 중', 
    badge: '통화 진행', 
    color: 'text-amber-400', 
    border: 'border-amber-500/40', 
    bg: 'bg-amber-950/40' 
  },
  { 
    id: 'confirmed', 
    title: '예약 확정', 
    badge: '타석 배정 완료', 
    color: 'text-teal-400', 
    border: 'border-teal-500/40', 
    bg: 'bg-teal-950/40' 
  },
  { 
    id: 'completed', 
    title: '이용 완료', 
    badge: '종료', 
    color: 'text-slate-400', 
    border: 'border-slate-700/60', 
    bg: 'bg-slate-900/40' 
  },
];

export const AdminKanban: React.FC<AdminKanbanProps> = ({ isOpen, onClose }) => {
  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLocked, setIsLocked] = useState(true);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState(false);

  // 실시간 Firestore 구독
  useEffect(() => {
    const unsubscribe = subscribeReservations((data) => {
      setReservations(data);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  // 관리자 핀코드 잠금 해제 (기본: 1234)
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '1234' || pinCode === '0000' || pinCode === '7467') {
      setIsLocked(false);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // 데모용 가상 예약 추가
  const handleAddSample = async () => {
    const today = new Date().toISOString().split('T')[0];
    const sampleNames = ['김철수', '이민지', '박상우', '최유진', '정현우'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomPhone = `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomSlots = ['11:00 ~ 13:00', '13:00 ~ 15:00', '15:00 ~ 17:00', '17:00 ~ 19:00', '19:00 ~ 21:00'];
    const randomSlot = randomSlots[Math.floor(Math.random() * randomSlots.length)];

    await createReservation({
      facility: 'outdoor',
      facilityLabel: '옥상 350평 실외 숏게임장 (2시간)',
      date: today,
      timeSlot: randomSlot,
      name: randomName,
      phone: randomPhone,
      peopleCount: '4',
      memo: '테스트 실시간 자동 예약 생성'
    });
  };

  // 상태 전환 헬퍼
  const handleMoveStatus = async (id: string, current: ReservationStatus, direction: 'next' | 'prev') => {
    const statusOrder: ReservationStatus[] = ['new', 'contacting', 'confirmed', 'completed'];
    const currentIndex = statusOrder.indexOf(current);
    if (currentIndex === -1) return;

    const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= 0 && nextIndex < statusOrder.length) {
      await updateReservationStatus(id, statusOrder[nextIndex]);
    }
  };

  const filteredReservations = reservations.filter(r => 
    r.name.includes(searchTerm) || r.phone.includes(searchTerm) || r.timeSlot.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-7xl min-h-[85vh] bg-[#07120c] border border-emerald-500/40 rounded-3xl p-5 sm:p-8 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative"
      >
        {/* 🔒 1. 원장님 전용 핀코드 잠금 화면 */}
        {isLocked ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">원장님 전용 실시간 CRM 칸반</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-sm">
              고객 예약 현황 및 회원 관리를 위한 관리자 인증 화면입니다. (초기 핀코드: <strong className="text-emerald-400 font-mono">1234</strong>)
            </p>

            <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                maxLength={4}
                placeholder="4자리 PIN 입력 (예: 1234)"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-center text-lg font-mono tracking-widest focus:outline-none focus:border-emerald-400"
              />
              {pinError && <p className="text-xs text-red-400 font-medium">PIN 번호가 일치하지 않습니다. (기본: 1234)</p>}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30"
              >
                관리자 대시보드 입장
              </button>
            </form>

            <button
              onClick={onClose}
              className="mt-6 text-xs text-slate-500 hover:text-slate-300 underline"
            >
              홈페이지로 돌아가기
            </button>
          </div>
        ) : (
          <>
            {/* 📋 2. CRM 칸반 메인 대시보드 */}
            {/* 상단 컨트롤 바 */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-emerald-900/40">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    시민파크골프 실시간 예약 CRM 칸반
                  </h2>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] text-emerald-300 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>실시간 동기화 ON</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  고객 예약 신청 시 새로고침 없이 0.1초 만에 자동 업데이트됩니다.
                </p>
              </div>

              {/* 검색 및 액션 버튼 */}
              <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
                <div className="relative flex-1 md:w-56">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="이름, 연락처 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  onClick={handleAddSample}
                  className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                  title="데모 시연용 가상 예약을 실시간으로 1건 생성합니다"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>가상 예약 테스트</span>
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                  aria-label="닫기"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 통계 배지 바 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] text-slate-400">총 예약 접수</div>
                <div className="text-xl font-black text-white">{reservations.length}건</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <div className="text-[11px] text-emerald-400">신규 대기</div>
                <div className="text-xl font-black text-emerald-300">
                  {reservations.filter(r => r.status === 'new').length}건
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/30">
                <div className="text-[11px] text-teal-400">확정된 예약</div>
                <div className="text-xl font-black text-teal-300">
                  {reservations.filter(r => r.status === 'confirmed').length}건
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] text-slate-400">이용 완료</div>
                <div className="text-xl font-black text-slate-300">
                  {reservations.filter(r => r.status === 'completed').length}건
                </div>
              </div>
            </div>

            {/* 4단계 칸반 컬럼 보드 */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
              {COLUMNS.map((col) => {
                const colItems = filteredReservations.filter(r => r.status === col.id);
                return (
                  <div
                    key={col.id}
                    className={`rounded-2xl ${col.bg} border ${col.border} p-4 flex flex-col min-h-[480px]`}
                  >
                    {/* 컬럼 헤더 */}
                    <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${col.color}`}>{col.title}</span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/50 text-white font-bold">
                          {colItems.length}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{col.badge}</span>
                    </div>

                    {/* 카드 목록 */}
                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[580px] pr-1">
                      {colItems.length === 0 ? (
                        <div className="h-32 flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                          해당 단계 예약 없음
                        </div>
                      ) : (
                        colItems.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-4 rounded-2xl bg-black/70 border border-white/10 shadow-lg space-y-2.5 hover:border-emerald-500/40 transition-colors"
                          >
                            {/* 카드 상단: 이름 & 시설 */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-sm font-black text-white flex items-center gap-1.5">
                                  <span>{item.name}</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-normal">
                                    {item.peopleCount}명
                                  </span>
                                </div>
                                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                                  {item.facilityLabel}
                                </div>
                              </div>

                              <button
                                onClick={() => deleteReservation(item.id)}
                                className="p-1 rounded-md text-slate-500 hover:text-red-400 transition-colors"
                                title="예약 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* 시간 및 연락처 */}
                            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                              <div className="flex items-center gap-1.5 text-slate-300">
                                <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="font-semibold">{item.date}</span>
                                <span className="text-slate-500">|</span>
                                <span className="text-amber-300 font-bold">{item.timeSlot}</span>
                              </div>

                              <div className="flex items-center justify-between pt-1">
                                <a
                                  href={`tel:${item.phone}`}
                                  className="inline-flex items-center gap-1 text-emerald-300 hover:text-white font-bold"
                                  title="클릭 시 바로 통화 연결"
                                >
                                  <Phone className="w-3 h-3 text-emerald-400" />
                                  <span>{item.phone}</span>
                                </a>
                              </div>
                            </div>

                            {/* 고객 메모 */}
                            {item.memo && (
                              <div className="text-[11px] text-slate-400 bg-black/40 p-2 rounded-lg border border-slate-800/80 flex items-start gap-1">
                                <MessageSquare className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                                <span className="line-clamp-2">{item.memo}</span>
                              </div>
                            )}

                            {/* 상태 이동 버튼 컨트롤러 */}
                            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                              {col.id !== 'new' ? (
                                <button
                                  onClick={() => handleMoveStatus(item.id, item.status, 'prev')}
                                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[10px] flex items-center gap-1"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                  <span>이전</span>
                                </button>
                              ) : <span />}

                              {col.id !== 'completed' && (
                                <button
                                  onClick={() => handleMoveStatus(item.id, item.status, 'next')}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all"
                                >
                                  <span>다음 단계</span>
                                  <ArrowRight className="w-3 h-3" />
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
          </>
        )}
      </motion.div>
    </div>
  );
};
