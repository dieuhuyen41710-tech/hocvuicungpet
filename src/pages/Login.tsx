import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../store/useAppStore';
import { PawPrint, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function Login() {
  const settings = useAppStore(state => state.settings);
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
      let email = identifier.trim();

      // If identifier does not contain '@', lookup email in Firestore (users & students collections)
      if (!email.includes('@')) {
        let foundEmail = '';
        
        const usersQuery = query(collection(db, 'users'), where('username', '==', email));
        const usersSnap = await getDocs(usersQuery);
        if (!usersSnap.empty) {
          const userData = usersSnap.docs[0].data();
          foundEmail = userData.email;
        } else {
          const studentsQuery = query(collection(db, 'students'), where('username', '==', email));
          const studentsSnap = await getDocs(studentsQuery);
          if (!studentsSnap.empty) {
            const studentData = studentsSnap.docs[0].data();
            foundEmail = studentData.email;
          }
        }

        if (!foundEmail) {
          throw new Error('Tên đăng nhập không tồn tại trong hệ thống hoặc chưa được liên kết email.');
        }
        email = foundEmail;
      }

      // Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Sync Auth with Firestore & Auto-Admin if not in DB
      const uid = firebaseUser.uid;
      const userEmail = firebaseUser.email || email;

      let userData: any = null;

      // 1. Check by UID in users
      let userDocRef = doc(db, 'users', uid);
      let userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        userData = userSnap.data();
      } else {
        // 2. Check by UID in students
        const studentDocRef = doc(db, 'students', uid);
        const studentSnap = await getDoc(studentDocRef);
        if (studentSnap.exists()) {
          userData = studentSnap.data();
        } else {
          // 3. Query users collection by email
          const qUsers = query(collection(db, 'users'), where('email', '==', userEmail));
          const snapUsers = await getDocs(qUsers);
          if (!snapUsers.empty) {
            userData = snapUsers.docs[0].data();
            await setDoc(doc(db, 'users', uid), { ...userData, id: uid });
          } else {
            // 4. Query students collection by email
            const qStudents = query(collection(db, 'students'), where('email', '==', userEmail));
            const snapStudents = await getDocs(qStudents);
            if (!snapStudents.empty) {
              userData = snapStudents.docs[0].data();
              await setDoc(doc(db, 'students', uid), { ...userData, id: uid });
            } else {
              // 5. Auto create as ADMIN if not found anywhere
              userData = {
                id: uid,
                email: userEmail,
                username: userEmail.split('@')[0],
                fullName: firebaseUser.displayName || 'Quản trị viên (Auto Admin)',
                role: 'ADMIN',
                createdAt: new Date().toISOString(),
              };
              await setDoc(doc(db, 'users', uid), userData);
            }
          }
        }
      }

      useAppStore.setState({ currentUser: userData });

      if (userData.role === 'ADMIN') {
        navigate('/admin');
      } else if (userData.role === 'TEACHER') {
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

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col items-center justify-center p-4" style={settings.backgroundUrl ? { backgroundImage: `url(${settings.backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
      {settings.backgroundUrl && <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-0"></div>}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-xl mb-3 text-[#3B82F6] border-4 border-[#DBEAFE] overflow-hidden">
            {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : <PawPrint size={40} />}
          </div>
          <h1 className="text-3xl font-black text-[#1E3A8A] mb-1 uppercase tracking-wide">"Học vui cùng Pet"</h1>
          <p className="text-sm font-bold text-[#3B82F6]">Trường THCS Bằng Doãn</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-2xl border-4 border-[#DBEAFE] w-full">
          <h2 className="text-2xl font-black text-[#1E40AF] mb-6 text-center border-b-4 border-[#E0F2FE] pb-3">ĐĂNG NHẬP HỆ THỐNG</h2>

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
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#3B82F6] focus:outline-none font-medium text-gray-800 text-sm"
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
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#3B82F6] focus:outline-none font-medium text-gray-800 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#3B82F6] text-white font-black rounded-2xl shadow-[0_4px_0_#1D4ED8] hover:bg-[#2563EB] active:translate-y-1 active:shadow-none transition-all uppercase text-sm flex items-center justify-center gap-2 disabled:opacity-50"
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

          <div className="mt-8 pt-6 border-t-2 border-gray-100 text-center">
            <p className="text-xs font-bold text-gray-500 italic">
              "Nếu chưa có tài khoản, vui lòng liên hệ Quản trị viên"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
