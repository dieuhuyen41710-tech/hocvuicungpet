import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../store/useAppStore';
import { PawPrint, Lock, User, AlertCircle, Loader2, UserCheck, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, cleanFirestoreData } from '../lib/firebase';
import { calculatePetLevelByFeedings } from '../lib/petUtils';
import defaultPosterImg from '../assets/poster.jpg';
import firebaseConfig from '../../firebase-applet-config.json';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import AppTitleLogo from '../components/AppTitleLogo';
import { mockUsers, mockStudents } from '../data/mockData';

export default function Login() {
  const settings = useAppStore(state => state.settings);
  const guestLogin = useAppStore(state => state.guestLogin);
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password verification logic that supports assigned passwords, default fallbacks, and standard classroom logins
  const checkPasswordValidity = (inputPassword: string, user: any): boolean => {
    if (!inputPassword) return false;
    const trimmedInput = inputPassword.trim();

    // 1. Direct match with stored password
    if (user.password && (user.password === trimmedInput || user.password.toLowerCase() === trimmedInput.toLowerCase())) {
      return true;
    }

    // 2. Admin account fallbacks
    if (user.role === 'ADMIN' || user.username?.toLowerCase() === 'admin' || user.email?.toLowerCase().includes('dieuhuyen')) {
      const allowedAdminPass = ['admin', 'admin123', '123456', 'dieuhuyen', 'dieuhuyen41710'];
      if (allowedAdminPass.includes(trimmedInput.toLowerCase())) return true;
      if (!user.password) return true; // If no password set yet, accept and set
    }

    // 3. Teacher account fallbacks
    if (user.role === 'TEACHER') {
      const allowedTeacherPass = ['teacher', 'teacher123', '123456', user.username?.toLowerCase(), `${user.username?.toLowerCase()}123`];
      if (allowedTeacherPass.includes(trimmedInput.toLowerCase())) return true;
      if (!user.password) return true;
    }

    // 4. Student account fallbacks
    if (user.role === 'STUDENT') {
      const allowedStudentPass = ['student', 'student123', '123456', user.username?.toLowerCase(), `${user.username?.toLowerCase()}123`];
      if (allowedStudentPass.includes(trimmedInput.toLowerCase())) return true;
      if (!user.password) return true;
    }

    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập/email và mật khẩu.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const identifierTrim = identifier.trim().toLowerCase();
      
      // 1. Search user in Firestore collections
      let foundUser: any = null;
      try {
        const [studentsSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, 'students')),
          getDocs(collection(db, 'users'))
        ]);

        studentsSnap.forEach((d) => {
          const data = d.data();
          if (
            (data.username && data.username.toLowerCase() === identifierTrim) ||
            (data.email && data.email.toLowerCase() === identifierTrim) ||
            d.id.toLowerCase() === identifierTrim
          ) {
            foundUser = { ...data, id: d.id };
          }
        });

        if (!foundUser) {
          usersSnap.forEach((d) => {
            const data = d.data();
            if (
              (data.username && data.username.toLowerCase() === identifierTrim) ||
              (data.email && data.email.toLowerCase() === identifierTrim) ||
              d.id.toLowerCase() === identifierTrim
            ) {
              foundUser = { ...data, id: d.id };
            }
          });
        }
      } catch (firestoreErr) {
        console.warn("Firestore search warning (fallback to local state):", firestoreErr);
      }

      // 2. Fallback to Zustand local store state if not found in Firestore
      if (!foundUser) {
        const storeState = useAppStore.getState();
        const localStudent = storeState.students.find(
          (s: any) =>
            (s.username && s.username.toLowerCase() === identifierTrim) ||
            (s.email && s.email.toLowerCase() === identifierTrim) ||
            s.id.toLowerCase() === identifierTrim
        );
        if (localStudent) {
          foundUser = { ...localStudent };
        } else {
          const localUser = storeState.users.find(
            (u: any) =>
              (u.username && u.username.toLowerCase() === identifierTrim) ||
              (u.email && u.email.toLowerCase() === identifierTrim) ||
              u.id.toLowerCase() === identifierTrim
          );
          if (localUser) {
            foundUser = { ...localUser };
          }
        }
      }

      // 3. Fallback to mock preset data if still not found
      if (!foundUser) {
        const mockMatch = [...mockUsers, ...mockStudents].find(
          (m: any) =>
            (m.username && m.username.toLowerCase() === identifierTrim) ||
            (m.email && m.email.toLowerCase() === identifierTrim) ||
            m.id.toLowerCase() === identifierTrim
        );
        if (mockMatch) {
          foundUser = { ...mockMatch };
        }
      }

      // Special rule: if email or identifier matches admin's email dieuhuyen41710@gmail.com
      if (!foundUser && (identifierTrim === 'dieuhuyen41710@gmail.com' || identifierTrim.includes('dieuhuyen'))) {
        foundUser = {
          id: 'admin1',
          username: 'admin',
          email: 'dieuhuyen41710@gmail.com',
          fullName: 'Nguyễn Diệu Huyền',
          role: 'ADMIN',
          createdAt: new Date().toISOString()
        };
      }

      // 4. Validate credentials
      let authUser: any = null;
      const targetEmail = foundUser?.email || (identifierTrim.includes('@') ? identifierTrim : `${identifierTrim}@school.local`);
      // Firebase Auth enforces min 6 chars password
      const fbAuthPassword = password.length >= 6 ? password : (password + "123456").slice(0, 6);

      if (foundUser) {
        // Verify password against found user records
        const isPasswordValid = checkPasswordValidity(password, foundUser);
        if (!isPasswordValid) {
          throw new Error('Mật khẩu không chính xác. Vui lòng kiểm tra lại mật khẩu (chú ý phím gõ tiếng Việt hoặc Caps Lock).');
        }

        // Remember password on user object
        foundUser.password = password;

        // Try syncing with Firebase Auth in background/seamlessly
        try {
          const cred = await signInWithEmailAndPassword(auth, targetEmail, fbAuthPassword);
          authUser = cred.user;
        } catch (authErr: any) {
          console.warn("Firebase Auth sign-in note:", authErr.code);
          // If user exists in app but not in Firebase Auth yet, auto-provision it
          if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
            try {
              const secondaryApp = initializeApp(firebaseConfig, "LoginAuto_" + Date.now());
              const secondaryAuth = getAuth(secondaryApp);
              await createUserWithEmailAndPassword(secondaryAuth, targetEmail, fbAuthPassword);
              await deleteApp(secondaryApp);
              const cred = await signInWithEmailAndPassword(auth, targetEmail, fbAuthPassword);
              authUser = cred.user;
            } catch (createErr) {
              console.warn("Secondary auto-create note:", createErr);
            }
          }
        }
      } else {
        // User not found in database records, try direct Firebase Auth sign-in
        try {
          const cred = await signInWithEmailAndPassword(auth, targetEmail, password);
          authUser = cred.user;

          // Check if record exists under authUser UID
          try {
            const userDocSnap = await getDoc(doc(db, 'users', authUser.uid));
            if (userDocSnap.exists()) {
              foundUser = { ...userDocSnap.data(), id: authUser.uid };
            } else {
              const studentDocSnap = await getDoc(doc(db, 'students', authUser.uid));
              if (studentDocSnap.exists()) {
                foundUser = { ...studentDocSnap.data(), id: authUser.uid };
              }
            }
          } catch (fetchErr) {
            console.warn("Doc lookup note:", fetchErr);
          }

          // If not in firestore, treat as Admin if created via console
          if (!foundUser) {
            const usernamePart = authUser.email ? authUser.email.split('@')[0] : 'admin';
            foundUser = {
              id: authUser.uid,
              fullName: authUser.displayName || usernamePart,
              username: usernamePart,
              email: authUser.email || targetEmail,
              role: 'ADMIN',
              createdAt: new Date().toISOString()
            };
          }
        } catch (authErr: any) {
          if (authErr.code === 'auth/invalid-credential' || authErr.code === 'auth/wrong-password') {
            throw new Error('Sai mật khẩu. Vui lòng kiểm tra lại mật khẩu của bạn.');
          } else if (authErr.code === 'auth/user-not-found') {
            throw new Error('Tài khoản hoặc email không tồn tại trong hệ thống.');
          } else if (authErr.code === 'auth/too-many-requests') {
            throw new Error('Đã thử đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ít phút.');
          } else {
            throw new Error('Tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.');
          }
        }
      }

      if (!foundUser) {
        throw new Error('Không tìm thấy thông tin tài khoản. Vui lòng kiểm tra lại.');
      }

      // 5. Ensure student pet level and evolution progress are preserved (Never reset to 1)
      if (foundUser.role === 'STUDENT') {
        const student = foundUser;
        const savedLevel = student.petLevel || 1;
        const activePet = student.ownedPets?.find((p: any) => p.id === student.currentPetId) || student.ownedPets?.[0];
        const petLevelFromOwned = activePet?.level || 1;
        const feedCount = student.petFeedCount || activePet?.feedCount || 0;
        const calculatedFeedLevel = calculatePetLevelByFeedings(feedCount, useAppStore.getState().settings?.globalEvolutions);
        
        const finalLevel = Math.max(savedLevel, petLevelFromOwned, calculatedFeedLevel);
        foundUser.petLevel = finalLevel;
        foundUser.petFeedCount = feedCount;
        if (activePet) {
          activePet.level = finalLevel;
          activePet.feedCount = feedCount;
        }
      }

      // 6. Best-effort Firestore synchronization (prevent crash if security rules or offline)
      try {
        const col = foundUser.role === 'STUDENT' ? 'students' : 'users';
        await setDoc(doc(db, col, foundUser.id), cleanFirestoreData(foundUser), { merge: true });
      } catch (saveErr) {
        console.warn("Firestore sync skipped or permission denied (handled safely):", saveErr);
      }

      // 7. Update active session in App Store
      useAppStore.setState((state) => {
        if (foundUser.role === 'STUDENT') {
          const exists = state.students.some(s => s.id === foundUser.id || s.username?.toLowerCase() === foundUser.username?.toLowerCase());
          const activePet = foundUser.ownedPets?.find((p: any) => p.id === foundUser.currentPetId) || foundUser.ownedPets?.[0];
          return {
            currentUser: foundUser,
            completedLessons: activePet?.completedLessons || state.completedLessons || [],
            students: exists 
              ? state.students.map(s => (s.id === foundUser.id || s.username?.toLowerCase() === foundUser.username?.toLowerCase()) ? foundUser : s) 
              : [...state.students, foundUser]
          };
        } else {
          const exists = state.users.some(u => u.id === foundUser.id || u.username?.toLowerCase() === foundUser.username?.toLowerCase());
          return {
            currentUser: foundUser,
            users: exists 
              ? state.users.map(u => (u.id === foundUser.id || u.username?.toLowerCase() === foundUser.username?.toLowerCase()) ? foundUser : u) 
              : [...state.users, foundUser]
          };
        }
      });

      // 8. Navigate to appropriate dashboard
      if (foundUser.role === 'ADMIN') {
        navigate('/admin');
      } else if (foundUser.role === 'TEACHER') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }

    } catch (err: any) {
      console.error("Login error:", err);
      let msg = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin tài khoản hoặc mật khẩu.';
      if (err.message && !err.message.includes('Missing or insufficient') && !err.message.includes('FirebaseError')) {
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
      {/* Left Half: Original Poster Image Display */}
      <div className="w-full lg:w-1/2 bg-black relative overflow-hidden flex items-center justify-center">
        <img 
          src={settings.posterUrl || defaultPosterImg} 
          alt="Học Vui Cùng Pet Poster" 
          className="w-full h-full object-cover min-h-[300px] lg:min-h-screen"
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

          <div className="bg-[#F8FAFC] p-6 lg:p-8 rounded-[32px] shadow-xl border-4 border-[#DBEAFE] w-full">
            <h3 className="text-2xl font-black text-[#1E40AF] mb-5 text-center border-b-4 border-[#E0F2FE] pb-3 tracking-wide">
              ĐĂNG NHẬP HỆ THỐNG
            </h3>

            {error && (
              <div className="mb-5 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-sm font-bold shadow-sm">
                <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-500" />
                <div className="flex-1 leading-relaxed">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Tên đăng nhập hoặc Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Nhập tên đăng nhập hoặc email..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-gray-200 bg-white focus:border-[#3B82F6] focus:outline-none font-medium text-gray-800 text-sm shadow-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl border-2 border-gray-200 bg-white focus:border-[#3B82F6] focus:outline-none font-medium text-gray-800 text-sm shadow-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                    title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 bg-[#3B82F6] text-white font-black rounded-2xl shadow-[0_4px_0_#1D4ED8] hover:bg-[#2563EB] active:translate-y-1 active:shadow-none transition-all uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-50 tracking-wider cursor-pointer"
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

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGuest}
                className="w-full py-3.5 bg-amber-500 text-white font-black rounded-2xl shadow-[0_4px_0_#B45309] hover:bg-amber-600 active:translate-y-1 active:shadow-none transition-all uppercase text-sm flex items-center justify-center gap-2 tracking-wider cursor-pointer"
              >
                <UserCheck size={18} /> Vào Học Ngay Với Tư Cách Khách
              </button>
              <p className="text-center text-[11px] font-bold text-amber-700 mt-1.5 italic">
                (Chế độ khách: Trải nghiệm học và nuôi Pet ngay mà không cần mật khẩu)
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 text-center">
              <p className="text-[11px] font-bold text-gray-500 italic">
                "Nếu chưa có tài khoản, vui lòng liên hệ Giáo viên hoặc Quản trị viên"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
