import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CardList from './components/CardList';
import AddCardModal from './components/AddCardModal';
import Onboarding from './components/Onboarding';
import Profile from './components/Profile';
import Settings from './components/Settings';
import { Plus } from 'lucide-react';
import { db, getAppId } from './lib/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getMockCards, MOCK_USER } from './lib/mockData';
import { isDevMode } from './lib/devMode';
import iPadFrame from './components/iPadFrame';

const SettleUpApp = () => {
  const { user, loading } = useAuth();
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appId] = useState(getAppId());
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [devMode] = useState(isDevMode());

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (hasSeenOnboarding && user) {
      setShowOnboarding(false);
    }
  }, [user]);

  // Dev mode: Auto-populate with mock data
  useEffect(() => {
    if (!user || !devMode || !user.isAnonymous) return;

    const devDataPopulated = sessionStorage.getItem('devDataPopulated');
    if (devDataPopulated) return;

    const collectionPath = appId === 'default'
      ? `users/${user.uid}/creditCards`
      : `artifacts/${appId}/users/${user.uid}/creditCards`;

    const populateDevData = async () => {
      try {
        const mockCards = getMockCards();
        for (const card of mockCards) {
          await addDoc(collection(db, collectionPath), {
            ...card,
            dueDate: Timestamp.fromDate(card.dueDate),
            createdAt: serverTimestamp()
          });
        }
        sessionStorage.setItem('devDataPopulated', 'true');
      } catch (error) {
        console.error('Failed to populate dev data:', error);
      }
    };

    populateDevData();
  }, [user, appId, devMode]);

  useEffect(() => {
    if (!user) return;

    const collectionPath = appId === 'default'
      ? `users/${user.uid}/creditCards`
      : `artifacts/${appId}/users/${user.uid}/creditCards`;

    const q = query(collection(db, collectionPath), orderBy('dueDate', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCards(cardsData);
    });

    return () => unsubscribe();
  }, [user, appId]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleAddCard = async (cardData) => {
    if (!user) return;

    const collectionPath = appId === 'default'
      ? `users/${user.uid}/creditCards`
      : `artifacts/${appId}/users/${user.uid}/creditCards`;

    try {
      await addDoc(collection(db, collectionPath), {
        ...cardData,
        dueDate: Timestamp.fromDate(new Date(cardData.dueDate)),
        minimumPayment: parseFloat(cardData.minimumPayment) || 0,
        statementBalance: parseFloat(cardData.statementBalance),
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding card: ", error);
      alert("Failed to add card. Check console.");
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm("Are you sure you want to delete this card?")) return;

    const collectionPath = appId === 'default'
      ? `users/${user.uid}/creditCards`
      : `artifacts/${appId}/users/${user.uid}/creditCards`;

    try {
      await deleteDoc(doc(db, collectionPath, cardId));
    } catch (error) {
      console.error("Error deleting card: ", error);
      alert("Failed to delete card.");
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-dark-bg dark:text-white">Loading...</div>;
  }

  // Skip onboarding in dev mode
  if (!user || (showOnboarding && !devMode)) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return <Profile onNavigate={handleNavigation} />;
      case 'settings':
        return <Settings onNavigate={handleNavigation} />;
      case 'home':
      default:
        return (
          <>
            <Dashboard cards={cards} onDelete={handleDeleteCard} />

            <div className="mb-4 flex justify-between items-end mt-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Cards</h2>
            </div>

            <CardList cards={cards} onDelete={handleDeleteCard} />

            <button
              onClick={() => setIsModalOpen(true)}
              className="fixed bottom-6 right-6 bg-brand-gradient text-white p-4 rounded-full shadow-xl hover:scale-105 active:scale-95 z-40 transition-all"
              aria-label="Add Card"
            >
              <Plus size={24} />
            </button>

            <AddCardModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAdd={handleAddCard}
            />
          </>
        );
    }
  };

  return (
    <iPadFrame>
      <Layout onNavigate={handleNavigation}>
        {renderPage()}
      </Layout>
    </iPadFrame>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettleUpApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
