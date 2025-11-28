import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CardList from './components/CardList';
import AddCardModal from './components/AddCardModal';
import LoginModal from './components/LoginModal';
import DuePaymentsCarousel from './components/DuePaymentsCarousel';
import Onboarding from './components/Onboarding';
import Profile from './components/Profile';
import Settings from './components/Settings';
import { Plus } from 'lucide-react';
import { db, getAppId } from './lib/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, Timestamp, getDocs } from 'firebase/firestore';
import { getMockCards, MOCK_USER } from './lib/mockData';
import { isDevMode } from './lib/devMode';
import IpadFrame from './components/iPadFrame';

const SettleUpApp = () => {
  const { user, loading } = useAuth();

  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [appId] = useState(getAppId());
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    return !hasSeenOnboarding;
  });
  const [currentPage, setCurrentPage] = useState('home');
  const [devMode] = useState(isDevMode());

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
        // Check if we already have cards in Firestore
        const q = query(collection(db, collectionPath));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          console.log("Data already exists, skipping mock population");
          sessionStorage.setItem('devDataPopulated', 'true');
          return;
        }

        console.log("Populating mock data...");
        const mockCards = getMockCards();
        for (const card of mockCards) {
          // Remove the hardcoded ID from the data we save to Firestore
          // so Firestore generates a unique ID, or use the ID as the doc ID
          const { id, ...cardData } = card;
          await addDoc(collection(db, collectionPath), {
            ...cardData,
            dueDate: Timestamp.fromDate(card.dueDate),
            createdAt: serverTimestamp()
          });
        }
        sessionStorage.setItem('devDataPopulated', 'true');
        console.log("Mock data populated");
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
        ...doc.data(),
        id: doc.id
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
    console.log("Attempting to add card:", cardData);
    if (!user) {
      console.error("No user logged in, cannot add card.");
      return;
    }

    const collectionPath = appId === 'default'
      ? `users/${user.uid}/creditCards`
      : `artifacts/${appId}/users/${user.uid}/creditCards`;

    console.log("Saving to collection path:", collectionPath);

    try {
      await addDoc(collection(db, collectionPath), {
        ...cardData,
        dueDate: Timestamp.fromDate(new Date(cardData.dueDate)),
        minimumPayment: parseFloat(cardData.minimumPayment) || 0,
        statementBalance: parseFloat(cardData.statementBalance),
        createdAt: serverTimestamp()
      });
      console.log("Card added successfully!");
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

  // Show onboarding if user hasn't seen it, regardless of login status
  if (showOnboarding && !devMode) {
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

            <DuePaymentsCarousel
              cards={cards}
              onMarkPaid={handleDeleteCard}
            />

            <CardList cards={cards} onDelete={handleDeleteCard} />

            <button
              onClick={() => {
                if (!user) {
                  setIsLoginModalOpen(true);
                } else {
                  setIsModalOpen(true);
                }
              }}
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

            <LoginModal
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
            />
          </>
        );
    }
  };

  return (
    <IpadFrame>
      <Layout onNavigate={handleNavigation} onLogin={() => setIsLoginModalOpen(true)}>
        {renderPage()}
      </Layout>
    </IpadFrame>
  );
};



function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <SettleUpApp />
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
