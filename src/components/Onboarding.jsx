import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';

const slides = [
    {
        id: 1,
        title: "Take Control of Your Credit",
        description: "SettleUp helps you track due dates, minimum payments, and balances across all your cards in one place.",
        image: "💳"
    },
    {
        id: 2,
        title: "Smart Features",
        description: "Scan cards, upload statements with AI, and visualize your spending with interactive charts.",
        image: "📊"
    },
    {
        id: 3,
        title: "Premium Access",
        description: "Unlock full potential for just $2.49/week. Secure your financial peace of mind today.",
        image: "💎"
    }
];

const Onboarding = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { user } = useAuth();

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            onComplete();
        } catch (error) {
            console.error("Google login failed", error);
            alert("Login failed. See console.");
        }
    };

    const handleAppleLogin = async () => {
        const provider = new OAuthProvider('apple.com');
        try {
            await signInWithPopup(auth, provider);
            onComplete();
        } catch (error) {
            console.error("Apple login failed", error);
            alert("Apple login requires configuration in Firebase Console.");
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-dark-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-brand-secondary opacity-20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-brand-primary opacity-20 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md z-10 flex flex-col h-[80vh]">
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center"
                        >
                            <div className="text-8xl mb-8">{slides[currentSlide].image}</div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{slides[currentSlide].title}</h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{slides[currentSlide].description}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="flex justify-center gap-2 mb-6">
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 w-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-brand-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                            />
                        ))}
                    </div>

                    {currentSlide < slides.length - 1 ? (
                        <button
                            onClick={handleNext}
                            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            Next <ChevronRight size={20} />
                        </button>
                    ) : (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full py-3.5 bg-white border border-gray-200 text-gray-800 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                                Continue with Google
                            </button>
                            <button
                                onClick={handleAppleLogin}
                                className="w-full py-3.5 bg-black text-white rounded-xl font-semibold shadow-sm hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                            >
                                <img src="https://www.svgrepo.com/show/508767/apple.svg" className="w-5 h-5 invert" alt="Apple" />
                                Continue with Apple
                            </button>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                By continuing, you agree to our Terms & Privacy Policy.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
