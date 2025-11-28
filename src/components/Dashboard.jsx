
import React, { useMemo, useState } from 'react';
import { formatCurrency } from '../lib/utils';
import { useCurrency } from '../contexts/CurrencyContext';
import { TrendingUp, Calendar, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import CardStack from './CardStack';
import ExpensesChart from './ExpensesChart';

import CardDetails from './CardDetails';

const Dashboard = ({ cards, onDelete }) => {
    const [selectedCard, setSelectedCard] = useState(null);
    const { selectedCurrency } = useCurrency();
    const [showCards, setShowCards] = useState(true);

    const stats = useMemo(() => {
        const totalOwed = cards.reduce((sum, card) => sum + (parseFloat(card.statementBalance) || 0), 0);

        // Simplified minDueThisMonth calculation as per new instruction
        const minDueThisMonth = cards.reduce((sum, card) => sum + (parseFloat(card.minimumPayment) || 0), 0);

        return { totalOwed, minDueThisMonth };
    }, [cards]);

    const handleCardDelete = async (id) => {
        onDelete(id);
    };

    return (
        <div className="space-y-8">
            {/* Header / Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Owed Card */}
                <div className="bg-dark-card rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-brand-primary/20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-brand-primary/10 rounded-lg">
                                <TrendingUp className="text-brand-primary" size={20} />
                            </div>
                            <h3 className="text-gray-400 font-medium text-sm">Total Owed</h3>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white tracking-tight">
                                {formatCurrency(stats.totalOwed, selectedCurrency)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Across all cards</p>
                        </div>
                    </div>
                </div>

                {/* Min Due Card */}
                <div className="bg-dark-card rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Calendar className="text-purple-400" size={20} />
                            </div>
                            <h3 className="text-gray-400 font-medium text-sm">Due This Month</h3>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white tracking-tight">
                                {formatCurrency(stats.minDueThisMonth, selectedCurrency)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimum payments</p>
                        </div>
                    </div>
                </div>

                {/* Expenses Chart (Promoted to top) */}
                <div className="bg-dark-card rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400 font-medium text-sm">Spending by Category</h3>
                    </div>
                    <div className="h-32">
                        <ExpensesChart cards={cards} />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8">
                {/* Card Stack */}
                <div>
                    <div
                        className="flex items-center justify-between mb-4 px-1 cursor-pointer md:cursor-default"
                        onClick={() => setShowCards(!showCards)}
                    >
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            Your Cards
                            <span className="md:hidden">
                                {showCards ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </span>
                        </h3>
                        <span className="text-xs text-gray-500">{cards.length} Cards</span>
                    </div>

                    <div className={`transition-all duration-300 overflow-hidden ${showCards ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'}`}>
                        <CardStack cards={cards} onCardClick={setSelectedCard} />
                    </div>
                </div>
            </div>

            {/* Details Sheet */}
            <CardDetails
                card={selectedCard}
                isOpen={!!selectedCard}
                onClose={() => setSelectedCard(null)}
                onDelete={handleCardDelete}
            />
        </div>
    );
};

export default Dashboard;

