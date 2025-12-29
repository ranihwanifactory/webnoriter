
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, loginWithGoogle, logout } from './firebase';
import { User } from './types';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import GameDetails from './pages/GameDetails';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="text-center">
          <div className="animate-bounce mb-4 text-6xl text-pink-400">🎮</div>
          <p className="text-pink-500 font-bold text-xl">놀이터 문 여는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogin={loginWithGoogle} onLogout={logout} />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/admin" element={<AdminDashboard user={user} />} />
            <Route path="/game/:id" element={<GameDetails user={user} />} />
          </Routes>
        </main>
        <footer className="bg-white border-t py-8 text-center text-gray-500">
          <div className="container mx-auto px-4">
            <p className="mb-2">© 2024 방구석놀이터. 즐거운 방학 보내세요! 🎈</p>
            <p className="text-sm">
              제작자 출처 : 
              <a 
                href="https://ranihwanibaby.tistory.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 text-pink-400 hover:text-pink-600 font-bold underline transition-colors"
              >
                great80k
              </a>
            </p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
