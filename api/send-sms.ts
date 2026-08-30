import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const SOLAPI_API_KEY = process.env.SOLAPI_API_KEY || 'NCSW3O74X9V0ASQK';
const SOLAPI_API_SECRET = process.env.SOLAPI_API_SECRET || 'WBWW4U4MQ1SF2ZLDTJMVZ2TUGNHAEB47';
const SENDER_PHONE = '01074672080'; // 원장님 등록 발신번호 (010-7467-2080)
const ADMIN_PHONE = '01074672080';  // 원장님 수신 번호 (010-7467-2080)

function getSolapiAuthHeader(apiKey: string, apiSecret: string) {
  const date = new Date().toISOString();
  const salt = crypto.randomBytes(16).toString('hex');
  const hmac = crypto.createHmac('sha256', apiSecret);
  hmac.update(date + salt);
  const signature = hmac.digest('hex');
  return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, phone, date, timeSlot, facilityLabel, peopleCount, memo } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Missing name or phone' });
    }

    const cleanCustomerPhone = String(phone).replace(/[^0-9]/g, '');
    const cleanSenderPhone = String(SENDER_PHONE).replace(/[^0-9]/g, '');
    const cleanAdminPhone = String(ADMIN_PHONE).replace(/[^0-9]/g, '');

    // 1. 📱 고객 스마트폰 수신 메시지 (LMS)
    const customerMessage = `[시민파크골프 예약 접수 완료]

안녕하세요, ${name} 고객님!
시민파크골프 2시간 예약이 성공적으로 접수되었습니다.

■ 예약일시: ${date} (${timeSlot})
■ 이용시설: ${facilityLabel}
■ 방문인원: ${peopleCount}명
■ 위치: 부산 사상구 광장로 7 르네시떼 르네관 6층 (옥상 350평)
■ 주차안내: 르네시떼 400대 주차 가능 (3시간 무료 지원)

센터 담당자가 확인 후 곧 안내 연락을 드릴 예정입니다. 즐거운 시간 되실 수 있도록 정성껏 준비하겠습니다. 감사합니다!

☎ 문의전화: 010-7467-2080`;

    // 2. 🔔 원장님 스마트폰(010-7467-2080) 수신 알림 메시지 (LMS)
    const adminMessage = `[시민파크골프] 🔔 신규 2시간 예약 접수!

원장님, 새로운 고객 예약이 접수되었습니다.

■ 예약자: ${name} (${phone})
■ 예약일시: ${date} (${timeSlot})
■ 이용시설: ${facilityLabel}
■ 예약인원: ${peopleCount}명
■ 고객메모: ${memo || '없음'}

* 원장님 CRM 관리자:
https://simin-parkgolf.vercel.app/admin (PIN: 1234)`;

    const authHeader = getSolapiAuthHeader(SOLAPI_API_KEY, SOLAPI_API_SECRET);

    // 3. 솔라피 v4 다중 발송 (고객 + 원장님 동시 전송)
    const messages = [
      {
        to: cleanCustomerPhone,
        from: cleanSenderPhone,
        text: customerMessage,
        type: customerMessage.length > 90 ? 'LMS' : 'SMS',
        subject: '[시민파크골프] 2시간 예약 접수 안내'
      }
    ];

    // 만약 고객 번호와 원장님 번호가 다를 경우에만 원장님 알림 추가 발송 (중복 방지)
    if (cleanCustomerPhone !== cleanAdminPhone) {
      messages.push({
        to: cleanAdminPhone,
        from: cleanSenderPhone,
        text: adminMessage,
        type: adminMessage.length > 90 ? 'LMS' : 'SMS',
        subject: '[시민파크골프] 신규 예약 접수 알림'
      });
    }

    const solapiResponse = await fetch('https://api.solapi.com/messages/v4/send-many', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        messages
      })
    });

    const result = await solapiResponse.json();
    console.log('✅ Solapi Dual Send Result (Customer + Admin):', result);

    return res.status(200).json({
      success: true,
      result
    });
  } catch (error: any) {
    console.error('❌ Solapi SMS Send Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to send SMS'
    });
  }
}
