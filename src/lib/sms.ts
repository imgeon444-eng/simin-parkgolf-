export interface CustomerSmsPayload {
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  facilityLabel: string;
  peopleCount: string;
  memo?: string;
}

/**
 * 🚀 고객 예약 완료 시 [고객 폰] + [원장님 폰(010-7467-2080)]으로 솔라피(Solapi) 자동 알림 문자 동시 전송
 */
export const sendCustomerSmsNotification = async (payload: CustomerSmsPayload): Promise<boolean> => {
  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data.success) {
      console.log('✅ Dual SMS (Customer + Admin) dispatched successfully via Solapi!');
      return true;
    } else {
      console.warn('Solapi SMS dispatch response returned false:', data);
      return false;
    }
  } catch (error) {
    console.warn('Customer SMS dispatch error (handled safely):', error);
    return false;
  }
};
