import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  onSnapshot, 
  query, 
  orderBy, 
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import { ReservationData, ReservationStatus, EventPromoConfig, PromoEventItem } from '../types';

// 🔥 사용자 실제 Firebase 프로젝트 설정 (parkgolf-10d78)
const firebaseConfig = {
  apiKey: "AIzaSyCtHY561ZPLlnrKPemFfcw22ZuwleDs3f4",
  authDomain: "parkgolf-10d78.firebaseapp.com",
  projectId: "parkgolf-10d78",
  storageBucket: "parkgolf-10d78.firebasestorage.app",
  messagingSenderId: "224022880419",
  appId: "1:224022880419:web:9350fe47b008d4ecf85f16",
  measurementId: "G-MBVL2DQTPP"
};

let app: FirebaseApp;
let db: Firestore;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  console.log("🔥 Google Cloud Firestore Connected Successfully to 'parkgolf-10d78'!");
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

// 📦 로컬 백업 스토리지 키
const LOCAL_STORAGE_KEY = 'simin_parkgolf_reservations_v1';
const PROMO_STORAGE_KEY = 'simin_parkgolf_promo_config_v1';

// 🎁 5대 사전 정의된 이벤트 프리셋
export const PROMO_PRESETS: PromoEventItem[] = [
  {
    id: 'first-visit',
    title: '첫 방문 고객 감사 20% 특별 할인 이벤트',
    subtitle: '시민파크골프를 처음 찾아주신 고객님을 위한 웰컴 혜택',
    discountBadge: '첫 방문 20% 할인',
    benefit: '2시간 이용료 20% 즉시 할인 + 전문 강사 원포인트 자세 교정 무료 지원',
    description: '처음 입문하시는 분도 부담 없이 배우고 즐기실 수 있도록 1회차 특별 할인과 그립/스탠스 원포인트 코칭을 무료로 제공합니다.',
    icon: 'Sparkles'
  },
  {
    id: 'autumn-season',
    title: '골프의 계절 가을 시즌 옥상 숏게임 특별 이벤트',
    subtitle: '가장 라운딩하기 좋은 가을, 쾌적한 옥상 350평 숏게임 특가',
    discountBadge: '가을 시즌 특가',
    benefit: '실외 숏게임장 & 퍼팅존 2시간 이용 시 고급 파크골프 볼마커 증정',
    description: '선선한 가을 바람과 함께 도심 속 탁 트인 옥상 350평에서 필드 실전 감각을 완벽하게 완성해 보세요.',
    icon: 'Leaf'
  },
  {
    id: 'group-benefit',
    title: '4인 이상 동호회 & 단체 고객 우대 혜택 이벤트',
    subtitle: '동호회, 모임, 친목 경기 단체 예약 시 특별 지원',
    discountBadge: '단체 음료·타석 우대',
    benefit: '4인 1팀 예약 시 웰컴 음료 전원 무료 제공 + 최적 타석 우선 배정',
    description: '가족 모임이나 파크골프 동호회 월례회, 단체 친선 경기를 위해 가장 쾌적한 전용 공간과 음료를 준비해 드립니다.',
    icon: 'Users'
  },
  {
    id: 'annual-member',
    title: '정기 회원권 & 맞춤 레슨 기간 한정 특가 이벤트',
    subtitle: '기본기부터 실전까지 확실하게 마스터하는 정기 코칭 패키지',
    discountBadge: '회원권 기간 특가',
    benefit: '정기 회원권 등록 시 1:1 맞춤 레슨 추가 2회 무료 제공',
    description: '체계적인 커리큘럼으로 단기간에 타수를 줄이고 완벽한 스윙을 완성할 수 있는 정기 프로그램 특별 프로모션입니다.',
    icon: 'Award'
  },
  {
    id: 'loyal-customer',
    title: '단골 고객님 재방문 감사 할인 이벤트',
    subtitle: '시민파크골프를 꾸준히 사랑해 주시는 회원님을 위한 감사 혜택',
    discountBadge: '단골 감사 할인',
    benefit: '재방문 예약 시 2시간 이용료 추가 할인 + 용품샵 10% 할인 쿠폰',
    description: '언제나 찾아주시는 소중한 단골 고객님께 보답하는 마음으로 특별한 할인 혜택을 전해드립니다.',
    icon: 'Heart'
  }
];

const getLocalReservations = (): ReservationData[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveLocalReservations = (data: ReservationData[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('reservation-updated', { detail: data }));
};

// ==============================================================
// 🚀 1. 실시간 예약 신청 (Google Firestore DB에 실시간 저장)
// ==============================================================
export const createReservation = async (reservation: Omit<ReservationData, 'id' | 'createdAt' | 'status'>): Promise<string> => {
  const now = new Date().toISOString();
  const payload = {
    ...reservation,
    status: 'new' as ReservationStatus,
    createdAt: now,
    serverTimestamp: serverTimestamp()
  };

  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'reservations'), payload);
      console.log("✅ Reservation successfully stored in Cloud Firestore! ID:", docRef.id);
      return docRef.id;
    } catch (e) {
      console.warn("Firestore Cloud save error, saving to local backup:", e);
    }
  }

  // Local fallback
  const localItem: ReservationData = {
    ...reservation,
    id: 'res-' + Date.now().toString(36),
    status: 'new',
    createdAt: now
  };
  const current = getLocalReservations();
  saveLocalReservations([localItem, ...current]);
  return localItem.id;
};

// ==============================================================
// 🚀 2. 실시간 CRM 칸반 데이터 구독 (Firestore onSnapshot 리스너)
// ==============================================================
export const subscribeReservations = (callback: (reservations: ReservationData[]) => void): (() => void) => {
  if (db) {
    try {
      const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const items: ReservationData[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            facility: data.facility || 'outdoor',
            facilityLabel: data.facilityLabel || '옥상 350평 실외 숏게임장',
            date: data.date || '',
            timeSlot: data.timeSlot || '',
            name: data.name || '',
            phone: data.phone || '',
            peopleCount: data.peopleCount || '2',
            memo: data.memo || '',
            status: (data.status as ReservationStatus) || 'new',
            createdAt: data.createdAt || new Date().toISOString()
          };
        });
        callback(items);
      }, (error) => {
        console.warn("Firestore real-time subscription error, fallback to local:", error);
        callback(getLocalReservations());
      });
    } catch (e) {
      console.warn("Firestore listener setup error:", e);
    }
  }

  // Local 실시간 이벤트 리스너
  callback(getLocalReservations());
  const handleUpdate = (e: any) => {
    callback(e.detail || getLocalReservations());
  };
  window.addEventListener('reservation-updated', handleUpdate);

  return () => {
    window.removeEventListener('reservation-updated', handleUpdate);
  };
};

// ==============================================================
// 🚀 3. CRM 예약 상태 변경 (신규 -> 상담중 -> 확정 -> 완료)
// ==============================================================
export const updateReservationStatus = async (id: string, newStatus: ReservationStatus): Promise<void> => {
  if (db && !id.startsWith('res-')) {
    try {
      const docRef = doc(db, 'reservations', id);
      await updateDoc(docRef, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      return;
    } catch (e) {
      console.warn("Firestore update error, updating local:", e);
    }
  }

  const current = getLocalReservations();
  const updated = current.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
  saveLocalReservations(updated);
};

// ==============================================================
// 🚀 4. 예약 삭제
// ==============================================================
export const deleteReservation = async (id: string): Promise<void> => {
  if (db && !id.startsWith('res-')) {
    try {
      await deleteDoc(doc(db, 'reservations', id));
      return;
    } catch (e) {
      console.warn("Firestore delete error, deleting local:", e);
    }
  }

  const current = getLocalReservations();
  const updated = current.filter((item) => item.id !== id);
  saveLocalReservations(updated);
};

// ==============================================================
// 🎁 5. 실시간 이벤트/프로모션 설정 저장 & 구독 (60대 사장님 맞춤형)
// ==============================================================
export const subscribePromoConfig = (callback: (config: EventPromoConfig) => void): (() => void) => {
  const defaultPromo: EventPromoConfig = {
    isActive: true,
    selectedPresetId: 'first-visit'
  };

  if (db) {
    try {
      const promoDocRef = doc(db, 'settings', 'eventPromo');
      return onSnapshot(promoDocRef, (snap) => {
        if (snap.exists()) {
          callback(snap.data() as EventPromoConfig);
        } else {
          callback(defaultPromo);
        }
      }, (error) => {
        console.warn("Promo subscription error, fallback to local:", error);
        callback(getLocalPromo());
      });
    } catch (e) {
      console.warn("Promo listener error:", e);
    }
  }

  // Local fallback
  callback(getLocalPromo());
  const handleUpdate = (e: any) => {
    callback(e.detail || getLocalPromo());
  };
  window.addEventListener('promo-updated', handleUpdate);
  return () => window.removeEventListener('promo-updated', handleUpdate);
};

export const updatePromoConfig = async (config: EventPromoConfig): Promise<void> => {
  const payload = {
    ...config,
    updatedAt: new Date().toISOString()
  };

  if (db) {
    try {
      const promoDocRef = doc(db, 'settings', 'eventPromo');
      await setDoc(promoDocRef, payload, { merge: true });
      console.log("✅ Event promo updated in Firestore!");
      return;
    } catch (e) {
      console.warn("Firestore promo save error, saving local:", e);
    }
  }

  localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent('promo-updated', { detail: payload }));
};

const getLocalPromo = (): EventPromoConfig => {
  const stored = localStorage.getItem(PROMO_STORAGE_KEY);
  if (!stored) {
    return { isActive: true, selectedPresetId: 'first-visit' };
  }
  try {
    return JSON.parse(stored);
  } catch {
    return { isActive: true, selectedPresetId: 'first-visit' };
  }
};
