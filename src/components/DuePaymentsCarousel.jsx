import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check, Bell } from 'lucide-react';
import { formatCurrency, formatDate, getDaysUntil } from '../lib/utils';
import { useCurrency } from '../contexts/CurrencyContext';
import ReminderDialog from './ReminderDialog';

const DuePaymentsCarousel = ({ cards, onMarkPaid }) => {
    const { selectedCurrency } = useCurrency();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCard, setSelectedCard] = useState(null);
    React.useEffect(() => {
        console.log('selectedCard changed:', selectedCard);
    }, [selectedCard]);

    // Filter cards due within next 30 days and sort by due date
    const upcomingCards = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return cards
            .filter((card) => {
                const daysUntil = getDaysUntil(card.dueDate);
                return daysUntil >= 0 && daysUntil <= 30;
            })
            .sort((a, b) => {
                const dateA = a.dueDate.toDate ? a.dueDate.toDate() : new Date(a.dueDate);
                const dateB = b.dueDate.toDate ? b.dueDate.toDate() : new Date(b.dueDate);
                return dateA - dateB;
            });
    }, [cards]);

    if (upcomingCards.length === 0) {
        return null; // Don't show carousel if no upcoming payments
    }

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : upcomingCards.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < upcomingCards.length - 1 ? prev + 1 : 0));
    };

    const visibleCards = upcomingCards.slice(currentIndex, currentIndex + 3);
    if (visibleCards.length < 3 && upcomingCards.length > 1) {
        visibleCards.push(...upcomingCards.slice(0, 3 - visibleCards.length));
    }

    return (
        <>
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">Upcoming Due Payments</h2>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="relative">
                    <div
                        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pb-2 flex-wrap md:flex-nowrap"
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        {upcomingCards.map((card) => {
                            const daysUntil = getDaysUntil(card.dueDate);
                            const isUrgent = daysUntil <= 3;

                            return (
                                <div
                                    key={card.id}
                                    className={`flex-shrink-0 w-full sm:w-[calc(100%-8px)] md:w-[calc(50%-8px)] snap-start bg-dark-card rounded-2xl p-5 border-2 ${isUrgent ? 'border-red-500' : 'border-white/5'
                                        } hover:border-brand-primary/50 transition-all aspect-[3/2] flex flex-col`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-white text-base line-clamp-2 h-12 leading-6">{card.name}</h3>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Due {formatDate(card.dueDate)}
                                            </p>
                                        </div>
                                        {isUrgent && (
                                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full whitespace-nowrap ml-2">
                                                URGENT
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-4 mt-auto">
                                        <p className="text-2xl font-bold text-white">
                                            {formatCurrency(card.minimumPayment || card.statementBalance, selectedCurrency)}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {daysUntil === 0 ? 'Due today' : `${daysUntil} days left`}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                // Custom confirmation alert
                                                const alertBox = document.createElement('div');
                                                alertBox.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/60';
                                                alertBox.innerHTML = `
                                                    <div class='bg-white dark:bg-dark-surface rounded-2xl shadow-2xl p-6 text-center max-w-xs'>
                                                        <h3 class='text-lg font-bold mb-2 text-gray-800 dark:text-white'>Mark as Paid?</h3>
                                                        <p class='text-sm text-gray-500 dark:text-gray-300 mb-4'>Are you sure you want to mark this payment as paid?</p>
                                                        <div class='flex gap-2 justify-center'>
                                                            <button id='paid-confirm' class='px-4 py-2 bg-brand-primary text-white rounded-lg font-bold'>Yes</button>
                                                            <button id='paid-cancel' class='px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg'>Cancel</button>
                                                        </div>
                                                    </div>
                                                `;
                                                document.body.appendChild(alertBox);
                                                document.getElementById('paid-confirm').onclick = () => {
                                                    onMarkPaid?.(card.id);
                                                    document.body.removeChild(alertBox);
                                                };
                                                document.getElementById('paid-cancel').onclick = () => {
                                                    document.body.removeChild(alertBox);
                                                };
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 bg-brand-gradient text-white font-medium py-2.5 rounded-lg hover:shadow-lg hover:shadow-brand-primary/30 transition-all active:scale-95"
                                        >
                                            <Check size={16} />
                                            Paid
                                        </button>
                                        <button
                                            onClick={() => {
                                                console.log('Remind button clicked for card:', card);
                                                setSelectedCard(card);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-lg transition-all active:scale-95"
                                        >
                                            <Bell size={16} />
                                            Remind
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Spacer to show partial card */}
                        <div className="flex-shrink-0 w-[20%]" aria-hidden="true"></div>
                    </div>
                </div>
            </div>

                        <ReminderDialog
                            isOpen={!!selectedCard}
                            onClose={() => {
                                console.log('ReminderDialog closed');
                                setSelectedCard(null);
                            }}
                            payment={selectedCard ? {
                                title: selectedCard.name || 'Payment Due',
                                dueDate: selectedCard.dueDate
                                  ? (selectedCard.dueDate.toDate
                                      ? selectedCard.dueDate.toDate().toISOString().slice(0, 10)
                                      : (selectedCard.dueDate instanceof Date
                                          ? selectedCard.dueDate.toISOString().slice(0, 10)
                                          : new Date(selectedCard.dueDate).toISOString().slice(0, 10)))
                                  : '',
                                description: `Minimum payment: ${formatCurrency(selectedCard.minimumPayment || selectedCard.statementBalance, selectedCurrency)}`
                            } : undefined}
                        />
        </>
    );
};

export default DuePaymentsCarousel;
