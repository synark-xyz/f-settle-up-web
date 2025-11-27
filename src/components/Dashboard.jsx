
import React, { useMemo, useState } from 'react';
import { formatCurrency } from '../lib/utils';
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import CardStack from './CardStack';
import ExpensesChart from './ExpensesChart';

import CardDetails from './CardDetails';

const Dashboard = ({ cards, onDelete }) => {
    const [selectedCard, setSelectedCard] = useState(null);

    const stats = useMemo(() => {
        const totalOwed = cards.reduce((sum, card) => sum + (parseFloat(card.statementBalance) || 0), 0);

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const minDueThisMonth = cards.reduce((sum, card) => {
            if (!card.dueDate) return sum;
            const date = card.dueDate.toDate ? card.dueDate.toDate() : new Date(card.dueDate);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                return sum + (parseFloat(card.minimumPayment) || 0);
            }
            return sum;
        }, 0);

        return { totalOwed, minDueThisMonth };
    }, [cards]);

    return (
        <div className="space-y-8">
            {/* Header / Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Owed Card */}
                <div className="bg-dark-card rounded-2xl p-6 shadow-lg border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={48} />
                    </div>
                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                                <TrendingUp size={18} />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider">Total Balance</span>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white tracking-tight">
                                {formatCurrency(stats.totalOwed)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Across all cards</p>
                        </div>
                    </div>
                </div>

                {/* Min Due Card */}
                <div className="bg-dark-card rounded-2xl p-6 shadow-lg border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Calendar size={48} />
                    </div>
                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                                <AlertCircle size={18} />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider">Due This Month</span>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white tracking-tight">
                                {formatCurrency(stats.minDueThisMonth)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimum payments</p>
                        </div>
                    </div>
                </div>

                {/* Quick Action / Placeholder */}
                <div className="bg-brand-primary rounded-2xl p-6 shadow-lg shadow-brand-primary/20 flex flex-col justify-center items-center text-center text-dark-bg">
                    <h3 className="font-bold text-lg mb-1">Stay on Track</h3>
                    <p className="text-sm opacity-80">You're doing great! Keep your utilization low.</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Card Stack */}
                <div>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-lg font-bold text-white">Your Wallet</h3>
                        <span className="text-xs text-gray-500">{cards.length} Cards</span>
                    </div>
                    <CardStack cards={cards} onCardClick={setSelectedCard} />
                </div>

                {/* Right Column: Analytics */}
                <div>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-lg font-bold text-white">Spending Analysis</h3>
                    </div>
                    <div className="bg-dark-card rounded-2xl p-6 border border-white/5 shadow-lg">
                        <ExpensesChart cards={cards} />
                    </div>
                </div>
            </div>

            {/* Details Sheet */}
            <CardDetails
                card={selectedCard}
                isOpen={!!selectedCard}
                onClose={() => setSelectedCard(null)}
                onDelete={(id) => {
                    // Callback to parent delete
                    onDelete(id);
                }}
            />
        </div>
    );
};

export default Dashboard;

