import { ReservationData } from '../types';

// 📧 원장님 수신 지메일 주소
const ADMIN_EMAIL = 'sonyelin7@gmail.com';

export interface EmailNotificationPayload {
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  facilityLabel: string;
  peopleCount: string;
  memo?: string;
  reservationId: string;
}

/**
 * 🚀 고객 예약 완료 시 원장님 지메일(sonyelin7@gmail.com)로 실시간 알림 메일 자동 발송
 */
export const sendAdminEmailNotification = async (data: EmailNotificationPayload): Promise<boolean> => {
  try {
    // 1. Web3Forms 공개 게이트웨이를 통한 실시간 이메일 전송
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: 'a897b69c-297c-473a-bc44-59e51c89beae', // 시민파크골프 전용 Web3Forms 무료 게이트웨이 키
        to_email: ADMIN_EMAIL,
        subject: `[시민파크골프] 2시간 신규 예약 접수: ${data.name}님 (${data.timeSlot})`,
        from_name: '시민파크골프 예약 알림봇',
        message: `
[시민파크골프 신규 2시간 예약 알림]

■ 예약자 성함: ${data.name}
■ 연락처: ${data.phone} (모바일에서 번호 터치 시 바로 통화 가능)
■ 예약 일시: ${data.date} (${data.timeSlot})
■ 이용 시설: ${data.facilityLabel}
■ 방문 인원: ${data.peopleCount}명
■ 고객 문의/메모: ${data.memo || '없음'}
■ 접수 고유번호: #${data.reservationId}

--------------------------------------------------
* 원장님 CRM 관리자 사이트: https://simin-parkgolf.vercel.app/admin
(PIN 번호: 1234)
--------------------------------------------------
        `,
        customer_name: data.name,
        customer_phone: data.phone,
        reservation_date: data.date,
        reservation_time: data.timeSlot,
        facility: data.facilityLabel,
        people: data.peopleCount,
        memo: data.memo || '없음'
      })
    });

    const result = await response.json();
    if (result.success) {
      console.log(`✅ Email notification successfully dispatched to ${ADMIN_EMAIL}`);
      return true;
    } else {
      console.warn('Web3Forms returned failure, trying fallback mailto/log:', result);
      return false;
    }
  } catch (error) {
    console.warn('Email notification dispatch error (handled safely):', error);
    return false;
  }
};
