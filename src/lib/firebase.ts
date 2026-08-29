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
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import { ReservationData, ReservationStatus } from '../types';

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
      console.log(`✅ Status updated to ${newStatus} for reservation ${id}`);
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
      console.log(`✅ Reservation ${id} deleted from Firestore`);
      return;
    } catch (e) {
      console.warn("Firestore delete error, deleting local:", e);
    }
  }

  const current = getLocalReservations();
  const updated = current.filter((item) => item.id !== id);
  saveLocalReservations(updated);
};
