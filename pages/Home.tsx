
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Game, User } from '../types';
import GameCard from '../components/GameCard';

interface HomeProps {
  user: User | null;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [loading, setLoading] = useState(true);

  const categories = ['전체', '액션', '퍼즐', '교육', '아케이드', '시뮬레이션'];

  useEffect(() => {
    const q = query(collection(db, 'games'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const gameList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Game[];
      setGames(gameList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredGames = selectedCategory === '전체' 
    ? games 
    : games.filter(g => g.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-10 bg-gradient-to-b from-blue-50 to-white rounded-3xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-4 animate-pulse">
            심심할 땐? 방구석놀이터! 🚀
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            방학 동안 즐길 수 있는 재미있는 게임들을 모았어요. <br/>
            좋아하는 게임을 선택해 플레이하고 친구들과 후기를 나눠보세요!
          </p>
        </div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-yellow-200 rounded-full blur-3xl opacity-50"></div>
      </section>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full font-bold transition-all shadow-sm ${
              selectedCategory === cat 
                ? 'bg-indigo-600 text-white scale-110 shadow-lg' 
                : 'bg-white text-indigo-400 hover:bg-indigo-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Game Grid */}
      {loading ? (
        <div className="text-center py-20 text-indigo-300">
          <i className="fas fa-spinner fa-spin text-4xl"></i>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.length > 0 ? (
            filteredGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-4">🎈</div>
              <h3 className="text-2xl font-bold text-gray-400">아직 준비된 게임이 없어요! 곧 찾아올게요.</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
