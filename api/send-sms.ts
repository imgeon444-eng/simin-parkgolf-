import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const SOLAPI_API_KEY = process.env.SOLAPI_API_KEY || 'NCSW3O74X9V0ASQK';
const SOLAPI_API_SECRET = process.env.SOLAPI_API_SECRET || 'WBWW4U4MQ1SF2ZLDTJMVZ2TUGNHAEB47';
const SENDER_PHONE = '01074672080'; // 원장님 등록 발신번호

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
    const { name, phone, date, timeSlot, facilityLabel, peopleCount } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Missing name or phone' });
    }

    // 💡 짝대기(-), 공백 등 모든 특수문자 완벽 제거 -> 순수 숫자 10~11자리만 추출
    const cleanPhone = String(phone).replace(/[^0-9]/g, '');
    const cleanSender = String(SENDER_PHONE).replace(/[^0-9]/g, '');

    const messageText = `[시민파크골프 예약 접수 완료]

안녕하세요, ${name} 고객님!
시민파크골프 2시간 예약이 성공적으로 접수되었습니다.

■ 예약일시: ${date} (${timeSlot})
■ 이용시설: ${facilityLabel}
■ 방문인원: ${peopleCount}명
■ 위치: 부산 사상구 광장로 7 르네시떼 르네관 6층 (옥상 350평)
■ 주차안내: 르네시떼 400대 주차 가능 (3시간 무료 지원)

센터 담당자가 확인 후 곧 안내 연락을 드릴 예정입니다. 편안하고 즐거운 시간 되실 수 있도록 정성껏 준비하겠습니다. 감사합니다!

☎ 문의전화: 010-7467-2080`;

    const authHeader = getSolapiAuthHeader(SOLAPI_API_KEY, SOLAPI_API_SECRET);

    const solapiResponse = await fetch('https://api.solapi.com/messages/v4/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        message: {
          to: cleanPhone,
          from: cleanSender,
          text: messageText,
          type: messageText.length > 90 ? 'LMS' : 'SMS',
          subject: '[시민파크골프] 2시간 예약 접수 안내'
        }
      })
    });

    const result = await solapiResponse.json();
    console.log('✅ Solapi SMS Send Result for', cleanPhone, ':', result);

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
