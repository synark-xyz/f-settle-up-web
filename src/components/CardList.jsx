import React from 'react';
import { Trash2, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate, getDaysUntil, getDaysUntilLabel, cn } from '../lib/utils';

const CardList = ({ cards, onDelete }) => {
    if (cards.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400">
                <CreditCard className="mx-auto mb-3 opacity-50" size={48} />
                <p>No cards added yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {cards.map((card) => {
                const days = getDaysUntil(card.dueDate);
                let statusColor = "border-l-gray-300"; // Default/Overdue handled by logic
                let badgeColor = "bg-gray-100 text-gray-600";

                if (days < 0) {
                    statusColor = "border-l-gray-400";
                    badgeColor = "bg-gray-200 text-gray-500";
                } else if (days <= 3) {
                    statusColor = "border-l-red-500";
                    badgeColor = "bg-red-100 text-red-700";
                } else if (days <= 7) {
                    statusColor = "border-l-yellow-400";
                    badgeColor = "bg-yellow-100 text-yellow-800";
                } else {
                    statusColor = "border-l-green-500";
                    badgeColor = "bg-green-100 text-green-700";
                }

                return (
                    <div
                        key={card.id}
                        className={cn(
                            "bg-white rounded-xl shadow-sm p-4 border border-gray-100 border-l-4 relative group transition-all hover:shadow-md",
                            statusColor
                        )}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{card.name}</h3>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <span>Due: {formatDate(card.dueDate)}</span>
                                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", badgeColor)}>
                                        {getDaysUntilLabel(days)}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => onDelete(card.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                aria-label="Delete card"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-50">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Min Payment</p>
                                <p className="font-mono font-medium text-gray-900">{formatCurrency(card.minimumPayment)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Balance</p>
                                <p className="font-mono font-medium text-gray-900">{formatCurrency(card.statementBalance)}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CardList;
