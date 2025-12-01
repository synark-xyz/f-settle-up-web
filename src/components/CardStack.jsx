import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { detectCardType, getCardLogo, getCardGradient } from '../lib/cardUtils';
import { CreditCard, X, Trash2 } from 'lucide-react';

/**
 * CardList component renders a horizontal scrollable list of cards.
 * Each card has a transparent background and premium UI.
 * @param {Object[]} cards - Array of card objects
 * @param {Function} onCardClick - Handler for card click (details)
 * @param {Function} onDelete - Handler for card delete
 */
const CardStack = ({ cards, onCardClick, onDelete }) => {

    if (!cards || cards.length === 0) {
        return (
            <div className="h-48 flex flex-col items-center justify-center bg-dark-card rounded-2xl border-2 border-dashed border-gray-700 text-gray-500">
                <CreditCard size={40} className="mb-2 opacity-50" />
                <p className="text-sm">No cards added yet</p>
            </div>
        );
    }

    return (
        <div className="w-full mb-8 px-4">
            <div className="flex gap-6 overflow-x-auto pb-6 pt-2 hide-scrollbar" style={{paddingRight: '2rem', paddingLeft: '2rem'}}>
                <AnimatePresence>
                    {cards.map((card) => {
                        const cardType = detectCardType(card.last4 || card.cardNumber);
                        const logo = getCardLogo(cardType);
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className={cn(
                                    "min-w-[320px] h-52 rounded-2xl p-6 shadow-2xl cursor-pointer overflow-hidden border border-white/10 backdrop-blur-sm",
                                    "bg-dark-card/60",
                                    "hover:border-emerald-400/40 hover:scale-[1.03] transition-all duration-200"
                                )}
                                onClick={() => onCardClick && onCardClick(card)}
                            >
                                <div className="flex justify-between items-start text-white relative z-10">
                                    <div>
                                        <h3 className="font-bold text-lg tracking-wide drop-shadow-md">{card.name}</h3>
                                        <p className="text-xs opacity-90 font-mono mt-1">**** **** **** {card.last4 || '0000'}</p>
                                    </div>
                                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md flex items-center">
                                        <img src={logo} className={cn("w-10 h-6 object-contain", cardType === 'visa' && "invert") } alt={cardType} />
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs opacity-80 uppercase tracking-wider mb-1">Balance</p>
                                            <p className="text-2xl font-bold font-mono drop-shadow-md">{formatCurrency(card.statementBalance)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs opacity-80 uppercase tracking-wider mb-1">Due</p>
                                            <p className="text-sm font-semibold">{formatDate(card.dueDate)}</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Static subtle shine */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CardStack;
