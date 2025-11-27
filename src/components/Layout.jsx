import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard } from 'lucide-react';
import UserMenu from './UserMenu';

const Layout = ({ children, onNavigate }) => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-dark-bg text-gray-100 font-sans selection:bg-brand-primary/30">
            <header className="sticky top-0 z-40 backdrop-blur-md bg-dark-bg/80 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <button
                        onClick={() => onNavigate?.('home')}
                        className="flex items-center gap-3 group"
                    >
                        <div className="bg-brand-gradient p-2 rounded-xl shadow-lg shadow-brand-primary/20 group-hover:scale-105 transition-transform">
                            <CreditCard size={20} className="text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight">SettleUp</h1>
                    </button>
                    <UserMenu onNavigate={onNavigate} />
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
