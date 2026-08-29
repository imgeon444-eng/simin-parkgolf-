import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  Firestore 
} from 'firebase/firestore';
import { ReservationData, ReservationStatus } from '../types';

// 💡 Firebase 설정 (추후 Firebase Console에서 발급받은 키를 여기에 넣으면 실제 Cloud DB와 100% 연동됩니다)
const env = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: env.VITE_FIREBASE_APP_ID || ""
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

// Firebase 설정이 유효한지 확인
const isFirebaseConfigured = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    console.log("🔥 Firebase Firestore Connected Successfully!");
  } catch (error) {
    console.warn("Firebase initialization failed, running in Smart LocalStorage mode:", error);
  }
}

// 📦 로컬 스토리지 키
const LOCAL_STORAGE_KEY = 'simin_parkgolf_reservations_v1';

// 초기 데모 데이터 생성기
const getInitialDemoData = (): ReservationData[] => {
  const today = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'demo-1',
      facility: 'outdoor',
      facilityLabel: '옥상 350평 실외 숏게임장',
      date: today,
      timeSlot: '13:00 ~ 15:00',
      name: '김태호',
      phone: '010-8912-3456',
      peopleCount: '4',
      memo: '동호회 4인 숏게임 및 퍼팅 집중 연습 희망',
      status: 'new',
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 'demo-2',
      facility: 'lesson',
      facilityLabel: '파크골프 전문 1:1 레슨',
      date: today,
      timeSlot: '15:00 ~ 17:00',
      name: '이영희',
      phone: '010-5421-9876',
      peopleCount: '1',
      memo: '초보 입문 기본기 레슨 상담 희망',
      status: 'contacting',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: 'demo-3',
      facility: 'screen',
      facilityLabel: '실내 스크린 파크골프 타석',
      date: today,
      timeSlot: '11:00 ~ 13:00',
      name: '박준형',
      phone: '010-3344-7788',
      peopleCount: '2',
      memo: '2인 스크린 코스 연습',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    }
  ];
};

// 로컬 데이터 읽기
const getLocalReservations = (): ReservationData[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    const initial = getInitialDemoData();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

// 로컬 데이터 저장 및 브로드캐스트 이벤트 발생
const saveLocalReservations = (data: ReservationData[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('reservation-updated', { detail: data }));
};

// ==============================================================
// 🚀 1. 실시간 예약 신청 (Firestore / LocalStorage)
// ==============================================================
export const createReservation = async (reservation: Omit<ReservationData, 'id' | 'createdAt' | 'status'>): Promise<string> => {
  const newReservation: ReservationData = {
    ...reservation,
    id: 'res-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    status: 'new',
    createdAt: new Date().toISOString()
  };

  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'reservations'), {
        ...newReservation,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (e) {
      console.warn("Firestore save failed, fallback to local:", e);
    }
  }

  // Local fallback
  const current = getLocalReservations();
  const updated = [newReservation, ...current];
  saveLocalReservations(updated);
  return newReservation.id;
};

// ==============================================================
// 🚀 2. 실시간 CRM 칸반 데이터 구독 (onSnapshot / Event Listener)
// ==============================================================
export const subscribeReservations = (callback: (reservations: ReservationData[]) => void): (() => void) => {
  if (db) {
    try {
      const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const items: ReservationData[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ReservationData, 'id'>)
        }));
        callback(items);
      });
    } catch (e) {
      console.warn("Firestore subscription failed, fallback to local:", e);
    }
  }

  // Local 실시간 이벤트 리스너
  callback(getLocalReservations());
  const handleUpdate = (e: any) => {
    callback(e.detail || getLocalReservations());
  };
  const handleStorage = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      callback(getLocalReservations());
    }
  };

  window.addEventListener('reservation-updated', handleUpdate);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener('reservation-updated', handleUpdate);
    window.removeEventListener('storage', handleStorage);
  };
};

// ==============================================================
// 🚀 3. CRM 예약 상태 변경 (신규 -> 상담중 -> 확정 -> 완료)
// ==============================================================
export const updateReservationStatus = async (id: string, newStatus: ReservationStatus): Promise<void> => {
  if (db) {
    try {
      const docRef = doc(db, 'reservations', id);
      await updateDoc(docRef, { status: newStatus });
      return;
    } catch (e) {
      console.warn("Firestore update failed, fallback to local:", e);
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
  if (db) {
    try {
      await deleteDoc(doc(db, 'reservations', id));
      return;
    } catch (e) {
      console.warn("Firestore delete failed, fallback to local:", e);
    }
  }

  const current = getLocalReservations();
  const updated = current.filter((item) => item.id !== id);
  saveLocalReservations(updated);
};
