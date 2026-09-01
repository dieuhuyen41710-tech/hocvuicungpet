import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../store/useAppStore';
import { PawPrint, Lock, User, AlertCircle, Loader2, UserCheck } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import defaultPosterImg from '../assets/poster.jpg';
import firebaseConfig from '../../firebase-applet-config.json';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import AppTitleLogo from '../components/AppTitleLogo';

export default function Login() {
  const settings = useAppStore(state => state.settings);
  const guestLogin = useAppStore(state => state.guestLogin);
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập/email và mật khẩu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const identifierTrim = identifier.trim().toLowerCase();
      
      // Fetch all students and users from Firestore
      const studentsSnap = await getDocs(collection(db, 'students'));
      const usersSnap = await getDocs(collection(db, 'users'));

      let foundUser: any = null;

      studentsSnap.forEach((d) => {
        const data = d.data();
        if (
          (data.username && data.username.toLowerCase() === identifierTrim) ||
          (data.email && data.email.toLowerCase() === identifierTrim)
        ) {
          foundUser = { ...data, id: d.id };
        }
      });

      if (!foundUser) {
        usersSnap.forEach((d) => {
          const data = d.data();
          if (
            (data.username && data.username.toLowerCase() === identifierTrim) ||
            (data.email && data.email.toLowerCase() === identifierTrim)
          ) {
            foundUser = { ...data, id: d.id };
          }
        });
      }

      // Fallback to local store state if not found in Firestore
      if (!foundUser) {
        const storeState = useAppStore.getState();
        const localStudent = storeState.students.find(
          (s: any) =>
            (s.username && s.username.toLowerCase() === identifierTrim) ||
            (s.email && s.email.toLowerCase() === identifierTrim)
        );
        if (localStudent) {
          foundUser = localStudent;
        } else {
          const localUser = storeState.users.find(
            (u: any) =>
              (u.username && u.username.toLowerCase() === identifierTrim) ||
              (u.email && u.email.toLowerCase() === identifierTrim)
          );
          if (localUser) {
            foundUser = localUser;
          }
        }
      }

      if (!foundUser) {
        throw new Error('Tên đăng nhập hoặc email không tồn tại trong hệ thống.');
      }

      const targetEmail = foundUser.email || `${foundUser.username}@school.local`;

      // Authenticate with Firebase Auth
      try {
        await signInWithEmailAndPassword(auth, targetEmail, password);
      } catch (authErr: any) {
        console.warn("Auth sign-in warning:", authErr.code);
        // If password matches database record, auto-create auth account if missing
        if (foundUser.password && foundUser.password === password) {
          try {
            const secondaryApp = initializeApp(firebaseConfig, "LoginSecondary_" + Date.now());
            const secondaryAuth = getAuth(secondaryApp);
            await createUserWithEmailAndPassword(secondaryAuth, targetEmail, password);
            await deleteApp(secondaryApp);
            await signInWithEmailAndPassword(auth, targetEmail, password);
          } catch (createErr) {
            console.warn("Secondary auth creation note:", createErr);
            // Fallback direct sign-in if possible or proceed
          }
        } else {
          throw new Error('Sai mật khẩu hoặc thông tin đăng nhập không chính xác.');
        }
      }

      // Sync Firestore user doc
      const col = foundUser.role === 'STUDENT' ? 'students' : 'users';
      await setDoc(doc(db, col, foundUser.id), foundUser, { merge: true });

      useAppStore.setState({ currentUser: foundUser });

      if (foundUser.role === 'ADMIN') {
        navigate('/admin');
      } else if (foundUser.role === 'TEACHER') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }

    } catch (err: any) {
      console.error("Login error:", err);
      let msg = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Sai tên đăng nhập, email hoặc mật khẩu.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    guestLogin();
    navigate('/student');
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col lg:flex-row w-full overflow-x-hidden">
      {/* Left Half: Pure Original Poster Image Display */}
      <div className="w-full lg:w-1/2 bg-black relative overflow-hidden flex items-center justify-center">
        <img 
          src={settings.posterUrl || defaultPosterImg} 
          alt="Học Vui Cùng Pet Poster" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Half: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 bg-white relative">
        <div className="w-full max-w-md flex flex-col items-center justify-center">
          <div className="text-center mb-6 flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl mb-3 text-[#3B82F6] border-4 border-[#DBEAFE] overflow-hidden">
              {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <PawPrint size={40} />}
            </div>
            <AppTitleLogo size="md" className="items-center justify-center text-center mt-2" />
          </div>

          <div className="bg-[#F8FAFC] p-8 rounded-[32px] shadow-xl border-4 border-[#DBEAFE] w-full">
            <h3 className="text-2xl font-black text-[#1E40AF] mb-6 text-center border-b-4 border-[#E0F2FE] pb-3">ĐĂNG NHẬP HỆ THỐNG</h3>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-bold">
                <AlertCircle size={20} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Tên đăng nhập hoặc Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Nhập username hoặc email..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 bg-white focus:border-[#3B82F6] focus:outline-none font-medium text-gray-800 text-sm shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 bg-white focus:border-[#3B82F6] focus:outline-none font-medium text-gray-800 text-sm shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#3B82F6] text-white font-black rounded-2xl shadow-[0_4px_0_#1D4ED8] hover:bg-[#2563EB] active:translate-y-1 active:shadow-none transition-all uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-50 tracking-wider"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Đang đăng nhập...
                  </>
                ) : (
                  'Đăng Nhập'
                )}
              </button>
            </form>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleGuest}
                className="w-full py-3.5 bg-amber-500 text-white font-black rounded-2xl shadow-[0_4px_0_#B45309] hover:bg-amber-600 active:translate-y-1 active:shadow-none transition-all uppercase text-sm flex items-center justify-center gap-2 tracking-wider"
              >
                <UserCheck size={18} /> Vào Học Ngay Với Tư Cách Khách
              </button>
              <p className="text-center text-[11px] font-bold text-amber-600 mt-1 italic">
                (Chế độ khách: Học thử không cần đăng nhập, tiến trình sẽ không được lưu)
              </p>
            </div>

            <div className="mt-6 pt-5 border-t-2 border-gray-200 text-center">
              <p className="text-xs font-bold text-gray-500 italic">
                "Nếu chưa có tài khoản, vui lòng liên hệ Quản trị viên"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
