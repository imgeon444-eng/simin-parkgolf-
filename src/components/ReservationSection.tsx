import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Monitor, 
  Users,
  MailCheck,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { createReservation } from '../lib/firebase';
import { sendAdminEmailNotification } from '../lib/email';
import { sendCustomerSmsNotification } from '../lib/sms';

export const ReservationSection: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState<'outdoor' | 'screen' | 'lesson'>('outdoor');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('13:00 ~ 15:00');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [peopleCount, setPeopleCount] = useState('2');
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // 💡 전화번호 자동 하이픈(-) 포매터: 숫자만 쳐도 010-XXXX-XXXX로 자동 변환
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    let formatted = raw;

    if (raw.length > 3 && raw.length <= 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
    } else if (raw.length > 7) {
      formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
    }

    setPhone(formatted);
  };

  // 2시간 간격 슬롯 목록 (11:00 ~ 21:00)
  const timeSlots = [
    { time: '11:00 ~ 13:00', label: '오전 11시 타임' },
    { time: '13:00 ~ 15:00', label: '오후 1시 타임' },
    { time: '15:00 ~ 17:00', label: '오후 3시 타임' },
    { time: '17:00 ~ 19:00', label: '오후 5시 타임' },
    { time: '19:00 ~ 21:00', label: '야간 7시 타임' },
  ];

  const facilityLabels = {
    outdoor: '옥상 350평 실외 숏게임장 (2시간)',
    screen: '실내 스크린 파크골프 타석 (2시간)',
    lesson: '전문 교육 레슨 + 복합 연습 (2시간)'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('성함과 연락처를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Firebase 실시간 예약 DB에 저장
      const resId = await createReservation({
        facility: selectedFacility,
        facilityLabel: facilityLabels[selectedFacility],
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        name,
        phone,
        peopleCount,
        memo
      });

      setCreatedId(resId);

      // 2. 📧 원장님 Gmail(sonyelin7@gmail.com)로 실시간 알림 이메일 발송
      sendAdminEmailNotification({
        name,
        phone,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        facilityLabel: facilityLabels[selectedFacility],
        peopleCount,
        memo,
        reservationId: resId.substring(0, 10).toUpperCase()
      });

      // 3. 📱 💬 고객 스마트폰으로 솔라피(Solapi) 예약 접수 확인 문자 자동 발송!
      // (짝대기가 있든 없든 숫자만 자동 정제되어 100% 무조건 발송됨)
      sendCustomerSmsNotification({
        name,
        phone,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        facilityLabel: facilityLabels[selectedFacility],
        peopleCount
      });

      // 성공 폭죽 효과
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });

      setIsSuccess(true);
    } catch (err) {
      alert('예약 접수 중 오류가 발생했습니다. 전화로 문의해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setName('');
    setPhone('');
    setMemo('');
  };

  return (
    <section id="reservation" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#050b07]">
      {/* 배경 글로우 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* 섹션 헤더 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3 shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>실내·실외 2시간 간격 실시간 스마트 예약</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            실내·실외 <span className="google-flow-text">2시간 간편 예약 & 상담</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg">
            운영시간: <strong className="text-emerald-400 font-bold">오전 11:00 ~ 오후 21:00</strong> | 2시간 단위로 쾌적하게 이용하실 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 좌측: 예약 안내 및 시설 선택 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="pro-glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/25 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span>이용 및 예약 규칙 안내</span>
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white">영업시간:</strong> AM 11:00 ~ PM 09:00
                    <p className="text-[11px] text-slate-400 mt-0.5">연중 쾌적한 시설 관리 및 맞춤 코칭 운영</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white">2시간 타임제 운영:</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      실내 스크린과 실외 숏게임장 모두 2시간 단위로 예약되어 여유로운 플레이 보장
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white">주차 혜택:</strong> 르네시떼 400대 주차 완비
                    <p className="text-[11px] text-amber-300 font-semibold mt-0.5">방문 고객 3시간 무료 주차권 지급</p>
                  </div>
                </div>
              </div>

              {/* 직통 전화 카드 */}
              <div className="pt-4 border-t border-emerald-900/40">
                <div className="text-xs text-slate-400 mb-2">전화로 바로 문의하기를 원하시면</div>
                <a
                  href="tel:010-7467-2080"
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <Phone className="w-4 h-4 animate-bounce" />
                  <span>010-7467-2080 바로 연결</span>
                </a>
              </div>
            </div>
          </div>

          {/* 우측: 인터랙티브 2시간 예약 신청 폼 */}
          <div className="lg:col-span-7">
            <div className="pro-glass-card p-6 sm:p-9 rounded-3xl border border-emerald-500/30 relative">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-5"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    예약 신청이 실시간 접수되었습니다!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    선택하신 <strong className="text-emerald-400">{selectedTimeSlot}</strong> 일정으로 예약 안내 문자가 고객님의 휴대폰으로 발송되었습니다.
                  </p>
                  
                  <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/30 max-w-md mx-auto text-left text-xs space-y-1.5 shadow-inner">
                    <div className="flex justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                      <span className="text-slate-400">예약 접수 번호:</span>
                      <span className="text-amber-400 font-mono font-bold">#{createdId.substring(0, 10).toUpperCase()}</span>
                    </div>
                    <div><span className="text-slate-400">예약자:</span> <span className="text-white font-bold">{name} ({phone})</span></div>
                    <div><span className="text-slate-400">신청 인원:</span> <span className="text-white font-bold">{peopleCount}명</span></div>
                    <div><span className="text-slate-400">예약 일시:</span> <span className="text-emerald-300 font-bold">{selectedDate} / {selectedTimeSlot}</span></div>
                    <div><span className="text-slate-400">선택 시설:</span> <span className="text-white font-semibold">{facilityLabels[selectedFacility]}</span></div>
                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>고객님 스마트폰으로 확인 문자가 자동 발송되었습니다.</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <MailCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>원장님 CRM 및 지메일로 실시간 전달되었습니다.</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                    <a
                      href="tel:010-7467-2080"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 shadow-md"
                    >
                      <Phone className="w-4 h-4" />
                      <span>센터로 직접 확인 전화 (010-7467-2080)</span>
                    </a>
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 rounded-full bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold border border-slate-700"
                    >
                      다른 시간 추가 예약하기
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 1. 시설 선택 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                      1. 이용 시설 선택
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'outdoor', label: '옥상 350평 실외 숏게임장', time: '2시간' },
                        { id: 'screen', label: '실내 스크린 타석', time: '2시간' },
                        { id: 'lesson', label: '교육 레슨 + 연습 복합', time: '2시간' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedFacility(item.id as any)}
                          className={`p-3.5 rounded-2xl text-left border transition-all ${
                            selectedFacility === item.id
                              ? 'bg-emerald-950 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold">{item.time}</span>
                            <span className={`w-2 h-2 rounded-full ${selectedFacility === item.id ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-slate-200">
                            {item.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. 날짜 및 2시간 타임슬롯 선택 */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        2. 날짜 & 2시간 타임슬롯 선택
                      </label>
                      <span className="text-[11px] text-emerald-400 font-semibold">AM 11시 ~ PM 9시 운영</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3">
                      <div className="sm:col-span-5">
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <div className="sm:col-span-7">
                        <div className="text-[11px] text-slate-400 py-1">희망하시는 시간대를 선택해 주세요 (2시간)</div>
                      </div>
                    </div>

                    {/* 시간대 슬롯 버튼 */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            selectedTimeSlot === slot.time
                              ? 'bg-emerald-500 text-black font-extrabold border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                              : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold">{slot.time}</div>
                          <div className={`text-[10px] ${selectedTimeSlot === slot.time ? 'text-black/80 font-semibold' : 'text-slate-500'}`}>
                            {slot.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. 예약자 정보 입력 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">성함</label>
                      <input
                        type="text"
                        required
                        placeholder="홍길동"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">
                        휴대폰 번호 <span className="text-[10px] text-emerald-400 font-normal">(자동 하이픈)</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="010-0000-0000"
                        value={phone}
                        onChange={handlePhoneChange}
                        maxLength={13}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400 font-mono tracking-wider"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 font-semibold mb-1">방문 인원</label>
                      <select
                        value={peopleCount}
                        onChange={(e) => setPeopleCount(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                      >
                        <option value="1">1인 (개인 레슨/연습)</option>
                        <option value="2">2인</option>
                        <option value="4">4인 (1팀)</option>
                        <option value="8">8인 이상 (단체/동호회)</option>
                        <option value="20">대관 문의 (20인 이상)</option>
                      </select>
                    </div>
                  </div>

                  {/* 추가 메모 */}
                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">문의 사항 / 레슨 희망 여부 (선택)</label>
                    <input
                      type="text"
                      placeholder="예: 초보 입문 레슨 상담 희망 / 동호회 단체 타석 문의"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  {/* 제출 버튼 */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold text-base shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.01] active:scale-98 shimmer-btn"
                  >
                    <span>{isSubmitting ? '실시간 예약 접수 및 확인 문자 전송 중...' : '2시간 예약 및 상담 신청하기'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>신청 즉시 고객님 폰으로 확인 문자 전송 및 원장님 CRM에 실시간 등록됩니다.</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
